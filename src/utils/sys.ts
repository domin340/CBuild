import { exit } from "process";
import { exec, ExecException } from "child_process";
import { Logger } from "./logger";

export type onError = (err: ExecException) => void;

export function shellCall(
  cmd: string,
  onError?: onError,
  onSuccess?: () => void,
  attempts: number = 0
): void {
  exec(cmd, (err, stdout, stderr) => {
    Logger.log("bold", `executing: ${cmd}`)
    if (err) {
      onError?.(err);
      if (attempts > 0)
        shellCall(cmd, onError, onSuccess, attempts - 1);
    } else {
      onSuccess?.();
      if (stdout) console.log(stdout);
      if (stderr) Logger.log("warn", stderr);
    }
  });
}
