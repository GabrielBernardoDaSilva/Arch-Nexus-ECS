import { Component } from "./component";
import { World } from "./world";
type QuerySearchType = new (...args: any[]) => Component;
export declare class Query<T extends QuerySearchType[]> {
    types: T;
    constructor(world: World, ...types: T);
    result: QuerySearchType[][];
    world: World;
    queryNeedToUpdate: boolean;
    private queryType;
    findAll(): Query<T>;
    findFirst(): void;
    resolveQueryResultTypeMapper<U extends unknown[]>(): U[];
}
export {};
