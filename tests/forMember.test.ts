import {Mapper, MapperAsync} from "../index";
import 'jest';

interface IDataModel {
    id: string;
    name: string;
}

class DataModel implements IDataModel {
    id: string;
    name: string;
    foo: boolean;
}

interface IDestinationModel {
    newId: number;
    newName: string;
    description: string;
    init(): number;
}

class DestinationModel implements IDestinationModel {
    newId: number;
    newName: string;
    description: string;
    init() {
        return this.newId;
    }
}

describe('For member tests', () => {
    test('should map sync', () => {
        const mapper = Mapper.Create<IDataModel, IDestinationModel>();
        mapper
            .forMember('newId', 'id', ({value}) => parseInt(value))
            .forMember('newName', 'name')
            .forMember('description', null, ({source}) => `${source.id}_${source.name}`)
            .toType(DestinationModel);

        const source = new DataModel();
        source.id = "111";
        source.name = "test";
        source.foo = true;

        const destinationObject: IDestinationModel = mapper.map(source);
        expect(destinationObject.newId).toBe(parseInt(source.id));
        expect(destinationObject.newName).toBe(source.name);
        expect(destinationObject.description).toBe(`${source.id}_${source.name}`);
        expect(destinationObject['foo']).toBeUndefined();
        expect(destinationObject.init).toBeDefined();
    });

    test('should map async', async () => {
        const mapper = MapperAsync.Create<DataModel, DestinationModel>();
        mapper
            .forMember('id', 'newId', ({value}) => Promise.resolve(parseInt(value)))
            .forMember('name', 'newName')
            .toType(DestinationModel);

        const source = new DataModel();
        source.id = "111";
        source.name = "test";
        source.foo = true;

        const destinationObject: DestinationModel = await mapper.map(source);
        expect(destinationObject.newId).toBe(parseInt(source.id));
        expect(destinationObject.newName).toBe(source.name);
        expect(destinationObject['foo']).toBeUndefined();
    });

    test('should handle errors during async mapping', async () => {
        const mapper = MapperAsync.Create<DataModel, DestinationModel>();
        const error = new Error('Test error');

        mapper
            .forMember('id', 'newId', () => Promise.reject(error))
            .forMember('name', 'newName')
            .toType(DestinationModel);

        const source = new DataModel();
        source.id = "111";
        source.name = "test";
        source.foo = true;

        let destinationObject: DestinationModel;

        try {
            destinationObject = await mapper.map(source);
        }
        catch (e) {
            expect(destinationObject).toBeUndefined();
            expect(e.message).toBe(error.message);
        }
    });
});