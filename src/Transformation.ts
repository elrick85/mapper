import {TransformFn} from "./types";

export class Transformation<T, P, K extends keyof T, D extends keyof P> {
    constructor(public sourcePropName: K, public destPropName: D, public cb?: TransformFn<T, P, K, D>) {

    }

    transform(source: T, value?: T[K]): P[D] {
        if (this.cb) {
            return this.cb({source, value});
        } else {
            return Transformation.transform(value) as P[D];
        }
    }

    static Create<T, P, K extends keyof T, D extends keyof P>(sourcePropName: K, destPropName: D, cb?: TransformFn<T, P, K, D>) {
        return new Transformation(sourcePropName, destPropName, cb);
    }

    static transform(data: any): any {
        return data;
    }
}