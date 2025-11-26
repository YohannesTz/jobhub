#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   JobHub Database Seeding Script      ${NC}"
echo -e "${BLUE}========================================${NC}"

# Database connection details
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-jobhub}"
DB_USER="${DB_USER:-jobhub_user}"
DB_PASS="${DB_PASS:-jobhub_pass}"

# Check if PostgreSQL is accessible
echo -e "\n${BLUE}Checking database connection...${NC}"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Cannot connect to database${NC}"
    echo "Please ensure PostgreSQL is running and credentials are correct"
    exit 1
fi
echo -e "${GREEN}✓ Database connection successful${NC}"

# BCrypt hash for password "password123" (for testing only)
# Generated using BCrypt with strength 10
HASHED_PASSWORD='$2a$10$xV5wZ7X6XGJ7aJQM0eYVbOCXDkJBGLKRIQ7fW3gW5qJ9Y6V7aW6cO'

echo -e "\n${BLUE}Clearing existing data...${NC}"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Disable triggers temporarily to avoid FK constraints
SET session_replication_role = 'replica';

TRUNCATE TABLE job_applications CASCADE;
TRUNCATE TABLE jobs CASCADE;
TRUNCATE TABLE companies CASCADE;
TRUNCATE TABLE refresh_tokens CASCADE;
TRUNCATE TABLE users CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Existing data cleared${NC}"
else
    echo -e "${RED}✗ Failed to clear data${NC}"
    exit 1
fi

echo -e "\n${BLUE}Seeding users...${NC}"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Insert Users (5 users with different roles)
INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES
    (gen_random_uuid(), 'Admin User', 'admin@jobhub.com', '$HASHED_PASSWORD', 'ADMIN', NOW(), NOW()),
    (gen_random_uuid(), 'Tech Innovations Inc', 'tech@innovations.com', '$HASHED_PASSWORD', 'COMPANY', NOW(), NOW()),
    (gen_random_uuid(), 'Global Solutions Corp', 'contact@globalsolutions.com', '$HASHED_PASSWORD', 'COMPANY', NOW(), NOW()),
    (gen_random_uuid(), 'John Doe', 'john.doe@email.com', '$HASHED_PASSWORD', 'USER', NOW(), NOW()),
    (gen_random_uuid(), 'Jane Smith', 'jane.smith@email.com', '$HASHED_PASSWORD', 'USER', NOW(), NOW()),
    (gen_random_uuid(), 'Alice Johnson', 'alice.j@email.com', '$HASHED_PASSWORD', 'USER', NOW(), NOW());
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Users seeded (6 users)${NC}"
    echo "  - admin@jobhub.com (ADMIN)"
    echo "  - tech@innovations.com (COMPANY)"
    echo "  - contact@globalsolutions.com (COMPANY)"
    echo "  - john.doe@email.com (USER)"
    echo "  - jane.smith@email.com (USER)"
    echo "  - alice.j@email.com (USER)"
    echo -e "${BLUE}  Password for all users: password123${NC}"
else
    echo -e "${RED}✗ Failed to seed users${NC}"
    exit 1
fi

echo -e "\n${BLUE}Seeding companies...${NC}"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Insert Companies (3 companies)
INSERT INTO companies (id, name, description, website, owner_id, created_at)
SELECT 
    gen_random_uuid(),
    'Tech Innovations Inc',
    'Leading technology company specializing in AI and Machine Learning solutions. We build cutting-edge products that transform industries and improve lives.',
    'https://techinnovations.com',
    u.id,
    NOW()
FROM users u WHERE u.email = 'tech@innovations.com';

INSERT INTO companies (id, name, description, website, owner_id, created_at)
SELECT 
    gen_random_uuid(),
    'Global Solutions Corp',
    'International consulting firm providing business solutions and digital transformation services to Fortune 500 companies worldwide.',
    'https://globalsolutions.com',
    u.id,
    NOW()
FROM users u WHERE u.email = 'contact@globalsolutions.com';

INSERT INTO companies (id, name, description, website, owner_id, created_at)
SELECT 
    gen_random_uuid(),
    'StartUp Ventures',
    'Dynamic startup accelerator and venture capital firm. We fund and mentor the next generation of innovative tech companies.',
    'https://startupventures.com',
    u.id,
    NOW()
FROM users u WHERE u.email = 'tech@innovations.com';
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Companies seeded (3 companies)${NC}"
else
    echo -e "${RED}✗ Failed to seed companies${NC}"
    exit 1
fi

echo -e "\n${BLUE}Seeding jobs...${NC}"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Insert Jobs (12 jobs)
-- Tech Innovations Inc Jobs
INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Senior Full Stack Developer',
    'We are seeking an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies including React, Node.js, and PostgreSQL. This role offers the opportunity to work on exciting projects that impact millions of users.',
    E'• 5+ years of experience in full-stack development\n• Strong proficiency in JavaScript, React, and Node.js\n• Experience with PostgreSQL or other relational databases\n• Knowledge of cloud platforms (AWS, GCP, or Azure)\n• Excellent problem-solving and communication skills\n• Bachelor\'s degree in Computer Science or related field',
    'San Francisco, CA',
    150000.00,
    c.id,
    NOW() - INTERVAL '2 days'
FROM companies c WHERE c.name = 'Tech Innovations Inc' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Machine Learning Engineer',
    'Join our AI research team to develop state-of-the-art machine learning models. You will work on cutting-edge projects involving natural language processing, computer vision, and predictive analytics. We offer a collaborative environment with access to powerful computing resources.',
    E'• Master\'s or PhD in Computer Science, Statistics, or related field\n• 3+ years of experience in machine learning\n• Proficiency in Python, TensorFlow, and PyTorch\n• Strong mathematical background in statistics and linear algebra\n• Experience with large-scale data processing\n• Published research papers (preferred)',
    'San Francisco, CA',
    180000.00,
    c.id,
    NOW() - INTERVAL '3 days'
FROM companies c WHERE c.name = 'Tech Innovations Inc' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'DevOps Engineer',
    'We need a skilled DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will be responsible for automating deployment processes, ensuring system reliability, and implementing security best practices across our production environment.',
    E'• 4+ years of DevOps experience\n• Expert knowledge of AWS, Docker, and Kubernetes\n• Experience with Infrastructure as Code (Terraform, CloudFormation)\n• Strong scripting skills (Bash, Python)\n• Knowledge of monitoring tools (Prometheus, Grafana, DataDog)\n• Experience with CI/CD tools (Jenkins, GitLab CI, GitHub Actions)',
    'Remote',
    140000.00,
    c.id,
    NOW() - INTERVAL '1 day'
FROM companies c WHERE c.name = 'Tech Innovations Inc' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Product Manager',
    'Lead the development of our flagship products from conception to launch. You will work closely with engineering, design, and business teams to define product strategy, prioritize features, and ensure successful delivery of products that delight our customers.',
    E'• 5+ years of product management experience in tech\n• Strong analytical and data-driven decision making skills\n• Experience with Agile methodologies\n• Excellent communication and leadership abilities\n• Technical background or CS degree preferred\n• Experience with B2B SaaS products',
    'San Francisco, CA',
    160000.00,
    c.id,
    NOW()
FROM companies c WHERE c.name = 'Tech Innovations Inc' LIMIT 1;

-- Global Solutions Corp Jobs
INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Senior Software Engineer',
    'Join our enterprise solutions team to build scalable applications for Fortune 500 clients. You will architect and implement robust software solutions, mentor junior developers, and collaborate with stakeholders to deliver high-quality products on time and within budget.',
    E'• 6+ years of software development experience\n• Expertise in Java, Spring Boot, and microservices\n• Experience with RESTful APIs and web services\n• Knowledge of design patterns and software architecture\n• Strong understanding of SDLC and Agile practices\n• Excellent client-facing communication skills',
    'New York, NY',
    145000.00,
    c.id,
    NOW() - INTERVAL '5 days'
FROM companies c WHERE c.name = 'Global Solutions Corp' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Cloud Solutions Architect',
    'Design and implement cloud-native architectures for enterprise clients. You will lead technical discussions, create architectural blueprints, and guide development teams in building secure, scalable, and cost-effective cloud solutions on AWS and Azure.',
    E'• 7+ years of experience in software architecture\n• AWS and Azure certifications (Solutions Architect)\n• Deep knowledge of cloud services, networking, and security\n• Experience with microservices and serverless architectures\n• Strong presentation and consulting skills\n• Experience working with enterprise clients',
    'New York, NY',
    175000.00,
    c.id,
    NOW() - INTERVAL '4 days'
FROM companies c WHERE c.name = 'Global Solutions Corp' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Data Engineer',
    'Build and maintain our data infrastructure to support analytics and business intelligence initiatives. You will design ETL pipelines, optimize data warehouses, and ensure data quality across multiple systems serving various business units.',
    E'• 4+ years of experience in data engineering\n• Strong SQL skills and database optimization knowledge\n• Experience with data pipeline tools (Airflow, dbt, Spark)\n• Knowledge of data warehousing (Snowflake, Redshift, BigQuery)\n• Python programming proficiency\n• Understanding of data modeling and dimensional design',
    'Remote',
    135000.00,
    c.id,
    NOW() - INTERVAL '2 days'
FROM companies c WHERE c.name = 'Global Solutions Corp' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Business Analyst',
    'Bridge the gap between business stakeholders and technical teams. You will gather requirements, analyze business processes, create documentation, and ensure successful delivery of IT solutions that meet client needs and drive business value.',
    E'• 3+ years of business analysis experience\n• Strong requirements gathering and documentation skills\n• Experience with Agile/Scrum methodologies\n• Proficiency in tools like JIRA, Confluence, and MS Office\n• Excellent analytical and problem-solving abilities\n• Bachelor\'s degree in Business, IT, or related field',
    'Chicago, IL',
    95000.00,
    c.id,
    NOW() - INTERVAL '1 day'
FROM companies c WHERE c.name = 'Global Solutions Corp' LIMIT 1;

-- StartUp Ventures Jobs
INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Frontend Developer (React)',
    'Create beautiful and responsive user interfaces for our portfolio companies. You will work with modern frontend technologies, collaborate with designers to implement pixel-perfect UIs, and optimize applications for maximum performance and scalability.',
    E'• 3+ years of frontend development experience\n• Expert knowledge of React, TypeScript, and modern CSS\n• Experience with state management (Redux, Zustand, or similar)\n• Understanding of responsive design and cross-browser compatibility\n• Knowledge of performance optimization techniques\n• Experience with testing frameworks (Jest, React Testing Library)',
    'Austin, TX',
    115000.00,
    c.id,
    NOW() - INTERVAL '3 days'
FROM companies c WHERE c.name = 'StartUp Ventures' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Backend Developer (Node.js)',
    'Develop robust and scalable backend services for our startup ecosystem. You will design RESTful APIs, implement business logic, integrate with third-party services, and ensure the security and performance of our server-side applications.',
    E'• 3+ years of backend development experience\n• Strong proficiency in Node.js and Express.js\n• Experience with MongoDB or PostgreSQL\n• Knowledge of RESTful API design principles\n• Understanding of authentication and authorization (JWT, OAuth)\n• Experience with microservices architecture',
    'Austin, TX',
    120000.00,
    c.id,
    NOW() - INTERVAL '4 days'
FROM companies c WHERE c.name = 'StartUp Ventures' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'UX/UI Designer',
    'Shape the user experience of innovative products across our portfolio. You will conduct user research, create wireframes and prototypes, design intuitive interfaces, and work closely with developers to bring your designs to life.',
    E'• 4+ years of UX/UI design experience\n• Proficiency in Figma, Sketch, or Adobe XD\n• Strong portfolio demonstrating design process and outcomes\n• Understanding of user-centered design principles\n• Experience with design systems and component libraries\n• Knowledge of HTML/CSS is a plus',
    'Remote',
    110000.00,
    c.id,
    NOW() - INTERVAL '6 days'
FROM companies c WHERE c.name = 'StartUp Ventures' LIMIT 1;

INSERT INTO jobs (id, title, description, requirements, location, salary, company_id, posted_at)
SELECT 
    gen_random_uuid(),
    'Mobile Developer (iOS/Android)',
    'Build native mobile applications for both iOS and Android platforms. You will develop feature-rich mobile apps, ensure smooth performance across devices, and collaborate with backend teams to integrate APIs and deliver exceptional mobile experiences.',
    E'• 4+ years of mobile development experience\n• Proficiency in Swift (iOS) and Kotlin (Android)\n• Experience with mobile app architecture patterns (MVVM, Clean Architecture)\n• Knowledge of mobile UI/UX best practices\n• Experience with RESTful APIs and mobile networking\n• Published apps on App Store and Google Play',
    'Seattle, WA',
    130000.00,
    c.id,
    NOW()
FROM companies c WHERE c.name = 'StartUp Ventures' LIMIT 1;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Jobs seeded (12 jobs)${NC}"
else
    echo -e "${RED}✗ Failed to seed jobs${NC}"
    exit 1
fi

# Display summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}    Database Seeding Completed!        ${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "\n${BLUE}Summary:${NC}"
echo "  • 6 Users (1 Admin, 2 Company, 3 Regular Users)"
echo "  • 3 Companies"
echo "  • 12 Jobs across all companies"
echo ""
echo -e "${BLUE}Test Credentials:${NC}"
echo "  Email: admin@jobhub.com | Role: ADMIN"
echo "  Email: tech@innovations.com | Role: COMPANY"
echo "  Email: contact@globalsolutions.com | Role: COMPANY"
echo "  Email: john.doe@email.com | Role: USER"
echo "  Email: jane.smith@email.com | Role: USER"
echo "  Email: alice.j@email.com | Role: USER"
echo ""
echo -e "  ${GREEN}Password for all users: password123${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"

