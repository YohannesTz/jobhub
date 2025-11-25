import { create } from 'zustand';

const useJobStore = create((set) => ({
  jobs: [],
  currentJob: null,
  totalPages: 0,
  currentPage: 0,
  searchKeyword: '',

  setJobs: (jobs, totalPages, currentPage) => set({ 
    jobs, 
    totalPages, 
    currentPage 
  }),

  setCurrentJob: (job) => set({ currentJob: job }),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  clearJobs: () => set({ 
    jobs: [], 
    totalPages: 0, 
    currentPage: 0 
  })
}));

export default useJobStore;

