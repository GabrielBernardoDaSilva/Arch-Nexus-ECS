export declare class WaitAmountOfSeconds {
    private seconds;
    constructor(seconds: number);
    private timeout;
    run(): AsyncGenerator<unknown, void, unknown>;
    stop(): void;
}
type RawTask = Generator<WaitAmountOfSeconds, void, void>;
type Task = (...args: any[]) => RawTask;
export declare class TaskScheduler {
    name: string;
    task: RawTask;
    isExecuting: boolean;
    result: IteratorResult<WaitAmountOfSeconds, void>;
    constructor(task: Task, ...args: any[]);
    resume(): void;
    start(): void;
    private execute;
    stop(): void;
}
export {};
