import { IAuth } from "@/interfaces/IAuth";

export interface IStore {
    auth: IAuth | undefined
    setAuth: (auth: IAuth | undefined) => void
}