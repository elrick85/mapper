import {TransformFn} from "./types";
import {Transformation} from "./Transformation";

export class Mapper<T, P> {
    mapping: Transformation<T, P, keyof T, keyof P>[] = [];

    private destinationType: {new (): P};

    constructor() {
    }

    map<K extends keyof T, D extends keyof P>(source: T): P {
        return this.mapping.reduce((res: P, val) => {
            const propValue = val.sourcePropName ? source[val.sourcePropName] : null;

            res[val.destPropName] = val.transform(source, propValue);
            return res;
        }, new this.destinationType());
    }

    forMember<K extends keyof T, D extends keyof P>(destPropName: D, sourcePropName?: K, cb?: TransformFn<T, P, K, D>) {
        this.mapping.push(Transformation.Create(sourcePropName, destPropName, cb));
        return this;
    }

    toType(destinationType: {new (): P}) {
        this.destinationType = destinationType;
        return this;
    }

    static Create<T, P>() {
        return new Mapper<T, P>();
    }
}