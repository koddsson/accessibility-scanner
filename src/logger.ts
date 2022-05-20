enum LogLevel {
  OFF = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  TRACE = 5,
}

export class Logger {
  #loglevel: LogLevel;

  constructor(loglevel: LogLevel = LogLevel.DEBUG) {
    this.#loglevel = loglevel;
  }

  log(...data: unknown[]) {
    const userSetting: LogLevel = Number(
      localStorage.getItem("@koddsson/accessibility-runner:loglevel")
    );
    if (userSetting === LogLevel.OFF) return;
    if (userSetting >= this.#loglevel) {
      const key = LogLevel[this.#loglevel].toLowerCase();
      if (key in console) {
        // @ts-ignore
        console[key](data);
      } else {
        console.log(data);
      }
    }
  }
}
