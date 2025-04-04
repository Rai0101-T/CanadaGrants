declare module 'node-cron' {
  namespace cron {
    interface ScheduleOptions {
      scheduled?: boolean;
      timezone?: string;
    }

    interface ScheduledTask {
      stop(): void;
      start(): void;
      getStatus(): string;
    }
  }

  function schedule(
    expression: string,
    func: () => void,
    options?: cron.ScheduleOptions
  ): cron.ScheduledTask;

  function validate(expression: string): boolean;

  export = { schedule, validate };
}