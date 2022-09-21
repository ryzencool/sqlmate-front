import {atom} from "jotai";


export const tokenAtom = atom(localStorage.getItem("authToken") ?? {})


export const tokenAtomWithPersistence = atom(
    (get) => get(tokenAtom),
    (get, set, newStr) => {
        set(tokenAtom, newStr)
        localStorage.setItem('authToken', newStr)
    }
)
