export class WaitAmountOfSeconds {
  constructor(private seconds: number) {}
  private timeout: NodeJS.Timeout;

  async *run() {
    yield new Promise((resolve) => {
      this.timeout = setTimeout(resolve, this.seconds * 1000);
    });
  }

  stop() {
    clearTimeout(this.timeout);
  }
}

type RawTask = Generator<WaitAmountOfSeconds, void, void>;

type Task = (...args: unknown[]) => RawTask;

export class TaskScheduler {
  name: string;
  task: RawTask;
  isExecuting: boolean = false;
  result: IteratorResult<WaitAmountOfSeconds, void>;
  constructor(task: Task, ...args: unknown[]) {
    this.task = task(...args);
    this.name = task.name;
  }

  public resume() {
    this.isExecuting = true;
    this.execute();
  }

  public start() {
    if (this.isExecuting) return;
    else {
      this.execute();
      this.isExecuting = true;
    }
  }

  private execute() {
    this.result = this.task.next();
    if (this.result.done) {
      this.isExecuting = false;
      return;
    }
    const value = this.result.value;
    if (value instanceof WaitAmountOfSeconds) {
      value
        .run()
        .next()
        .then(() => {
          this.task.next();
          this.execute();
        });
    }
  }

  public stop() {
    this.isExecuting = false;
    const value = this.result.value;
    if (value instanceof WaitAmountOfSeconds) {
      value.stop();
    }
    this.task.return();
  }
}
