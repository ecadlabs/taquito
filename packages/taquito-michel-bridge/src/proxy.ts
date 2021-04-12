import { MichelsonData } from "@taquito/michel-codec";
import { TypeInfo, UnionID } from "./typeinfo";
import { assembleData } from "./assemble";

export interface Proxy<T> {
    [method: string]: (arg: unknown) => T;
    default: (arg: unknown) => T;
}

type Backend<T> = (ep: string, data: MichelsonData) => T;

export function getProxy<T>(t: TypeInfo, backend: Backend<T>): Proxy<T> {
    const getMethod = <T>(t: TypeInfo, ep: string, backend: Backend<T>) => (arg: unknown): T => backend(ep, assembleData(t, arg)) as T;
    const proxy: Proxy<T> = {
        default: getMethod(t, "", backend),
    }
    if (t.type === UnionID) {
        for (const f of t.fields) {
            proxy[f.field] = getMethod(f, f.field !== "default" ? f.field : "", backend);
        }
    }
    return proxy;
}