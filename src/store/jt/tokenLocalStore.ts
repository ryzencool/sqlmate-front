import {atom, useAtom} from "jotai";


export const tokenAtom = atom(localStorage.getItem("authToken")  ?? {})


export const tokenAtomWithPersistence = atom(
    (get) => get(tokenAtom),
    (get, set, newStr) => {
        set(tokenAtom, newStr)
        // @ts-expect-error TS(2345) FIXME: Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
        localStorage.setItem('authToken', newStr)
    }
)
