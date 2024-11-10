import { argv, exit } from "process";
import { Logger } from "./logger";
import { ConstantARGS, ARG_VAL_T } from "../const";

export type parsedArgs = { [key: string]: ARG_VAL_T };
export type ArgMap = {
  [key: string]: (key: string) => void;
} & { onError: (key: string) => void };

export class Flags {
  public args!: parsedArgs;
  public static validate_def(def: ConstantARGS, args: parsedArgs): boolean {
    return (
      Object.entries(def).filter(([key, val]) => {
        const is_missing = val.required && !(key in args);
        if (is_missing) Logger.log("error", `${key} not provided`);
        return is_missing;
      }).length > 0
    );
  }
  constructor(
    public def: ConstantARGS,
    public map?: ArgMap,
    public strict: boolean = true
  ) {
    this.args = this.parseArgs();
  }
  /** @description returns (is key defined and valid, fixed key, parsed val) */
  private stripArg(arg: string): [boolean, string, ARG_VAL_T] {
    const [key, val] = arg.split("=");
    const fixedKey = key.replace(/\-/g, "").toLowerCase().trim();
    const defined = this.def[fixedKey];
    if (!defined) return [false, fixedKey, 0];
    const fixed_val = val ?? true;
    return [
      typeof fixed_val == defined.type,
      fixedKey,
      defined.type == "number" ? Number(fixed_val) : fixed_val,
    ];
  }
  private parseArgs(): parsedArgs {
    const args = {};
    for (const arg of argv.slice(2)) {
      const [isValid, key, val] = this.stripArg(arg);
      if (isValid) {
        // if theres a key listening for this event. Run it
        this.map?.[key]?.(key);
        args[key] = val;
      } else {
        this.map?.onError(key);
        Logger.log(
          "error",
          `${key}'s type is either invalid or it is not a part of defined list`
        );
      }
    }
    if (this.strict && Flags.validate_def(this.def, args)) exit(-1);
    return args;
  }
  public static display_help(def: ConstantARGS): void {
    Logger.display_help();
    Logger.log("success", "ARGUMENTS HELP");
    for (const key in def) {
      const value = def[key];
      console.log(
        `${key}:\n\t-${value.desc}\n\t-type: ${value.type}\n\t-required? ${
          value.required ? "yes" : "no"
        }`
      );
    }
  }
  public get<T extends ARG_VAL_T>(item: string): T | undefined {
    const val = this.def[item];
    const arg = this.args[item];
    if (!val || !arg) return undefined;
    else if (typeof arg == val.type) return arg as T;
    else undefined;
  }
}
