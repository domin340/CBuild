import { exit } from "process";
import { exec, ExecException } from "child_process";
import { Logger } from "./logger";

export function recursiveExec(
  cmd: string,
  onError?: (turn: number, err: ExecException) => void,
  onSuccess?: () => void,
  n_of_recursion: number = 1,
  endProgramOnFail: boolean = true,
  attempt: number = 0
): void {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      attempt++;
      if (onError) onError(attempt, error);
      // call until n_of_recursion reaches 0
      if (attempt <= n_of_recursion)
        recursiveExec(
          cmd,
          onError,
          onSuccess,
          n_of_recursion,
          endProgramOnFail,
          attempt
        );
      else {
        Logger.log("error", `Failed to run ${cmd}`);
        if (endProgramOnFail) exit(-1);
      }
    } else {
      if (onSuccess) onSuccess();
      if (stdout) console.log(stdout);
      if (stderr) Logger.log("warn", stderr);
    }
  });
}
