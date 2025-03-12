
export class Resource<T> {
    private data: T;

    constructor(data: T) {
        this.data = data;
    }
    
    public get(): T {
        return this.data;
    }
    
}


export class ResourceManager {
    private resources: Map<string, Resource<any>> = new Map();

    public getResource<T>(type: new (...args: any[]) => T): Resource<T> {
        const name = type.name;
        return this.resources.get(name) as Resource<T>;
    }

    public addResource<T>(resource: T) {
        const name = resource.constructor.name;
        if (this.resources.has(name)) {
            throw new Error(`Resource ${name} already exists`);
        }
        this.resources.set(name, new Resource(resource));
    }

    public removeResource(name: string) {
        this.resources.delete(name);
    }
}