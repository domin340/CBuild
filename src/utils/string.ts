import { join, basename } from "path";

/*
  parses the wildcards found in _OUTPUT_, to its corresponding declarations.
  Can be found in ./src/consts
*/
export function wildcardsToURL(
  _OUTPUT_: string,
  proj: string,
  iter_n: number
): string {
  return join(
    ..._OUTPUT_
      .replace(/\$|\%|\#/g, (match: string) => {
        let item: string = "";
        switch (match) {
          case "$":
            item = proj;
            break;
          case "%":
            item = basename(proj);
            break;
          case "#":
            item = iter_n.toString();
            break;
        }
        return item;
      })
      .split("/")
  );
}

export function getStringAndElse(input: any, otherwise: string): string {
  return typeof input == "string" ? input : otherwise;
}
