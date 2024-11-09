import { argv } from "process";
import { Logger } from "./logger";
import { ConstantARGS, ARG_VALUE } from "../const";

export type parsedArgs = { [key: string]: string | boolean };

export type ArgMap = {
  [key: string]: (key: string) => void;
} & { onError: (key: string) => void };

export function isArgTypeValue(
  input: any,
  type: ARG_VALUE
): input is typeof type {
  return typeof input == type;
}

export class CLI_TOOLS {
  constructor(public listed_args: ConstantARGS) {}
  public display_help(): void {
    Logger.display_help();
    Logger.log("success", "ARGUMENTS HELP");
    for (const key in this.listed_args) {
      const value = this.listed_args[key];
      console.log(
        `${key}:\n\t-${value.desc}\n\t-type: ${value.type}\n\t-required? ${
          value.required ? "yes" : "no"
        }`
      );
    }
  }
  /**
   * @description parse arguments. Skips first 2 (compiler and file)
   */
  public parseArgs(map?: ArgMap): parsedArgs {
    const args = {};
    for (const arg of argv.slice(2)) {
      // prepare key
      const [key, val] = arg.split("=");
      const fixedKey = key.replace(/\-/g, "").toLowerCase().trim();
      const listed_arg = this.listed_args[fixedKey];
      // is key in listed args? (./src/consts default object export)
      if (listed_arg) {
        const fixed_val = val ?? true;
        const arg_type = listed_arg.type;
        // type checker defined using type guard
        if (!isArgTypeValue(fixed_val, arg_type)) {
          Logger.log(
            "error",
            `${key} expected type ${arg_type} got ${typeof fixed_val}`
          );
        }
        // checks if the map exists and key is being listened on in map if so run it
        map?.[fixedKey]?.(fixedKey);
        args[fixedKey] = fixed_val;
      } else {
        // if the the key is not in listed args run onError function if exists
        map?.onError(fixedKey);
      }
    }
    return args;
  }
}
