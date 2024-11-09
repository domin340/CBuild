import consts from "./const";
import {
  Logger,
  CLI_TOOLS,
  parsedArgs,
  getOpts,
  getStringAndElse,
  wildcardsToURL,
  getLibs,
  recursiveExec,
  ExitWithCode,
  getAllProjects
} from "./utils";
import { dirname, join } from "path";
import { mkdirSync, existsSync } from "fs";

// Arguments and some cli tools Manager
const cli = new CLI_TOOLS(consts);
const _HELP_FUNCTION_ = () => ExitWithCode(cli.display_help, 0);

// parse arguments and listen on found argv
const args = cli.parseArgs({
  ["h"]: _HELP_FUNCTION_,
  ["help"]: _HELP_FUNCTION_,
  onError: (k) => ExitWithCode(`${k} is not a part of args`),
});

async function main() {
  // get and validate options
  const opts: parsedArgs = await getOpts(args);
  // IMPORTANT CONSTANTS DECIDING OF WHAT TO COMPILE
  const _IS_TEST_ = opts["test"] ? "./test" : "./src";
  const _INPUT_ = getStringAndElse(opts["input"], _IS_TEST_);
  const _OUTPUT_ = getStringAndElse(opts["out"], "./bin/%");
  const _PROJECTS_ = await getAllProjects(opts, _INPUT_);
  // defined in consts that compl is a string if not it will log the error
  const _COMPILER_ = opts["compl"] as string;
  const _FILE_: string =
    getStringAndElse(opts["file"], "main") +
    (_COMPILER_ == "g++" ? ".cpp" : ".c");
  // iterate thru all found projects
  _PROJECTS_.forEach(async (value, index) => {
    index++;
    const out = wildcardsToURL(_OUTPUT_, value, index);
    const _LIBS_ = await getLibs(value);
    const dir = dirname(out);
    const file = join(value, _FILE_);
    if (!existsSync(file)) ExitWithCode(`${file} not found!`);
    // build command
    const cmd = [_COMPILER_, file, _LIBS_.join(" "), "-o", out].join(" ");
    Logger.log("bold", `Compiling: ${value}`);
    /*
      try recursively build the project.
      The main issue often tends to be the lack of output directory.
    */
    recursiveExec(
      cmd,
      (turn: number) => {
        Logger.log("bold", `ATTEMPT ${turn}`);
        try {
          Logger.log("bold", `creating ${dir} recursively`);
          mkdirSync(dir, { recursive: true });
          Logger.log("success", "successfully created");
        } catch {
          Logger.log("error", "UNABLE TO CREATE DIRECTORY");
        }
      },
      () => {
        Logger.log("success", `Successfully built ${value}`);
      }
    );
  });
}

main();
