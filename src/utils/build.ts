import {
  Flags,
  parsedArgs,
  ConfigJson,
  fetchAllDirectories,
  fetchAllFiles,
  Logger,
  ExitWithCode,
} from ".";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { exit } from "process";

// TODO: FIX CODE MESS and to not reference the Flags class
// Consider inheratence with Flags

export class BUILD_TOOLS {
  public static _C_REGEXP_ = /\.c|\.cpp$/;
  public opts!: parsedArgs;
  constructor(protected cli: Flags) {
    this.init();
  }
  public async init(): Promise<this> {
    this.opts = await this.getOpts();
    return this;
  }
  async getLibs(project_path: string): Promise<string[]> {
    // fetch all libraries
    const _LIB_PATH_ = join(project_path, "lib");
    return existsSync(_LIB_PATH_)
      ? await fetchAllFiles(_LIB_PATH_, BUILD_TOOLS._C_REGEXP_)
      : [];
  }
  public async getOpts(): Promise<parsedArgs> {
    const config = this.cli.get<string>("config");
    return config ? await this.readConfigJson(config) : this.cli.args;
  }
  public async readConfigJson(path: string): Promise<ConfigJson> {
    const data = await readFile(path, { encoding: "utf-8" });
    return JSON.parse(data);
  }
  public async getAllProjects(_INPUT_: string): Promise<string[]> {
    let _projects_: string[];
    if (_INPUT_.endsWith("*")) {
      _projects_ = await fetchAllDirectories(_INPUT_.replace("*", ""));
    } else {
      const proj = this.cli.get<string>("proj");
      _projects_ = proj ? [join(_INPUT_, proj)] : [_INPUT_];
    }
    return _projects_;
  }
}

export function validateInputOutput(file: string, out: string) {
  if (!existsSync(file)) ExitWithCode(`${file} not found!`);
  const out_dir = dirname(out);
  if (!existsSync(out_dir)) {
    try {
      Logger.log("bold", `ATTEMPTING TO CREATE ${out_dir}`);
      mkdirSync(out_dir, { recursive: true });
      Logger.log("success", `SUCCESSFULLY CREATED ${out_dir}`);
    } catch (e) {
      Logger.log("error", `unable to create ${out_dir}`);
      exit(-1);
    }
  }
}
