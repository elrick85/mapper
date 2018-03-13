import {TransformFn, TransformFnAsync} from "./types";
import {Transformation} from "./Transformation";
import {TransformationAsync} from "./Transformation.async";

export class MapperAsync<T, P> {
    mapping: TransformationAsync<T, P, keyof T, keyof P>[] = [];

    private destinationType: {new (): P};

    constructor() {
    }

    map<K extends keyof T, D extends keyof P>(source: T): Promise<P> {
        const obj = this.destinationType ? new this.destinationType() : <P>{};

        return this.mapping.reduce((res: Promise<P>, val) => {
            return res.then((result: P) => {
                const value = val.sourcePropName ? source[val.sourcePropName] : null;

                return val.transform(source, value)
                    .then((value) => {
                        result[val.destPropName] = value;
                        return result;
                    })
            });
        }, Promise.resolve(obj));
    }

    forMember<K extends keyof T, D extends keyof P>(sourcePropName: K, destPropName: D, cb?: TransformFnAsync<T, P, K, D>) {
        this.mapping.push(TransformationAsync.Create(sourcePropName, destPropName, cb));

        return this;
    }

    toType(destinationType: {new (): P}) {
        this.destinationType = destinationType;
        return this;
    }

    static Create<T, P>() {
        return new MapperAsync<T, P>();
    }
}