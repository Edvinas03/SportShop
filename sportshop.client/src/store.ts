import { create } from 'zustand'
import { IStore } from "./interfaces/IStore";

export { useShallow } from 'zustand/react/shallow'

export const useStore = create<IStore>((set) => ({
    auth: undefined,
    setAuth: (auth) => set((state) => ({ auth }))
}))