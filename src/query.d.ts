import { Component } from "./component";
import { World } from "./world";
export type QuerySearchType = new (...args: any[]) => Component | Component;
export declare class Query<T extends QuerySearchType[], U extends QuerySearchType[]> {
    private withTypes;
    private withOutTypes;
    constructor(world: World);
    private result;
    private world;
    queryNeedToUpdate: boolean;
    private queryType;
    private execute;
    with<T extends QuerySearchType[]>(...types: T): Query<T, U>;
    without<U extends QuerySearchType[]>(...types: U): Query<T, U>;
    findFirst(): {
        [K in keyof T]: InstanceType<T[K]>;
    };
    findLast(): [{
        [K in keyof T]: InstanceType<T[K]>;
    }];
    findNone(): any[];
    findAll(): {
        [K in keyof T]: InstanceType<T[K]>;
    }[];
    resolveQueryResultTypeMapper<U extends unknown[]>(): U[];
}
