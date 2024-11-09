import { type parsedArgs } from "./argv";
import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export type ConfigJson = Partial<{
  out: string;
  input: string;
  proj: string;
  file: string;
  test: boolean;
}>;

/**
 *@description iterate through all files and its subdirectories.
 * If filter argument is given it will check the match with the file's absolute path
 * if so the item is pushed to the list
 */
export async function fetchAllFiles(
  dir: string,
  filter?: RegExp
): Promise<string[]> {
  const files: string[] = [];
  const fetchedFiles = await readdir(dir, { withFileTypes: true });
  for (const file of fetchedFiles) {
    const absPath = join(file.parentPath, file.name);
    if (file.isDirectory()) {
      const rest = await fetchAllFiles(absPath, filter);
      files.push(...rest);
    } else {
      if (filter && !filter.test(absPath)) continue;
      files.push(absPath);
    }
  }
  return files;
}

export async function fetchAllDirectories(base: string) {
  const fetched_items = await readdir(base, { withFileTypes: true });
  return fetched_items
    .filter((item) => item.isDirectory())
    .map((item) => join(item.parentPath, item.name));
}

export const _C_REGEXP_ = /\.c|\.cpp$/;

export async function getLibs(project_path: string): Promise<string[]> {
  // fetch all libraries
  const _LIB_PATH_ = join(project_path, "lib");
  return existsSync(_LIB_PATH_)
    ? await fetchAllFiles(_LIB_PATH_, _C_REGEXP_)
    : [];
}

export async function getOpts(args: parsedArgs): Promise<parsedArgs> {
  return args["config"] ? await readConfigJson(args["config"]) : args;
}

export async function readConfigJson(
  path: string | boolean
): Promise<ConfigJson> {
  path = typeof path == "boolean" ? "./" : path;
  const data = await readFile(join(path, "build.config.json"), {
    encoding: "utf-8",
  });
  return JSON.parse(data);
}

export async function getAllProjects(
  opts: parsedArgs,
  _INPUT_: string
): Promise<string[]> {
  let _projects_: string[];
  if (_INPUT_.endsWith("*")) {
    _projects_ = await fetchAllDirectories(_INPUT_.replace("*", ""));
  } else {
    const proj = opts["proj"] as string;
    _projects_ = proj ? [join(_INPUT_, proj)] : [_INPUT_];
  }
  return _projects_;
}
