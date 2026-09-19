import { create } from 'zustand'

interface AppLoadingState {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useAppLoadingStore = create<AppLoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading })
  },
}))
