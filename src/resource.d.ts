export declare class Resource<T> {
    private data: T;

    constructor(data: T);
    
    public get(): T;
}

export declare class ResourceManager {
    private resources: Map<string, Resource<any>>;

    public getResource<T>(type: new (...args: any[]) => T): Resource<T> | undefined;
    
    public addResource<T>(resource: T): void;
    
    public removeResource(name: string): void;
} 