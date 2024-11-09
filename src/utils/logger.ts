import { exit } from "process";
export type levels = Exclude<keyof typeof Logger.levels, "_RESET">;

export class Logger {
  public static levels = {
    error: "\x1b[91m",
    success: "\x1b[92m",
    warn: "\x1b[93m",
    bold: "\x1b[1m",
    _RESET: "\x1b[0m",
  };
  public static display_help(): void {
    this.log("success", "LOGGER HELP");
    for (const key of Object.keys(Logger.levels)) {
      if (key == "_RESET") continue;
      console.log(`${Logger.levels[key]}${key}${Logger.levels["_RESET"]}`);
    }
  }
  // This is not meant to be mixed with Logger.log
  public static bold_text(msg: string): string {
    return `${this.levels.bold}${msg}${this.levels._RESET}`;
  }
  public static log(level: levels, msg: string): void {
    console.log(`== ${this.levels[level]}${msg}${this.levels._RESET} ==`);
  }
}

export function ExitWithCode(msg: string | (() => void), code: number = -1) {
  if (typeof msg == "string") Logger.log("error", msg);
  else msg();
  exit(code);
}
