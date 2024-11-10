import { readdir } from "fs/promises";
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

