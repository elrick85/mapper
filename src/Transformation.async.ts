import {TransformFnAsync} from "./types";

export class TransformationAsync<T, P, K extends keyof T, D extends keyof P> {
    constructor(public sourcePropName: K, public destPropName: D, public cb?: TransformFnAsync<T, P, K, D>) {

    }

    transform(source: T, value?: T[K]): Promise<P[D]> {
        if (this.cb) {
            return this.cb({value, source});
        } else {
            return TransformationAsync.transform(value) as Promise<P[D]>;
        }
    }

    static Create<T, P, K extends keyof T, D extends keyof P>(sourcePropName: K, destPropName: D, cb?: TransformFnAsync<T, P, K, D>) {
        return new TransformationAsync(sourcePropName, destPropName, cb);
    }

    static transform(data: any): Promise<any> {
        return Promise.resolve(data);
    }
}