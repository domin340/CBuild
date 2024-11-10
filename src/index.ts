import { exit } from "process";
import { join } from "path";
import consts from "./const";
import {
  Logger,
  Flags,
  wildcardsToURL,
  shellCall,
  ExitWithCode,
  BUILD_TOOLS,
  validateInputOutput,
} from "./utils";

function _HELP_FUNCTION_() {
  Flags.display_help(consts);
  exit(0);
}

async function main() {
  const map = {
    ["h"]: _HELP_FUNCTION_,
    ["help"]: _HELP_FUNCTION_,
    onError: (k: string) => ExitWithCode(`${k} is not a part of args`),
  };
  const cli = new Flags(consts, map, true);
  const buildTools = new BUILD_TOOLS(cli);
  // IMPORTANT CONSTANTS DECIDING OF WHAT TO COMPILE
  const _IS_TEST_ = cli.get<string>("test") ? "./test" : "./src";
  const _INPUT_ = cli.get<string>("input") ?? _IS_TEST_;
  const _OUTPUT_ = cli.get<string>("out") ?? "./bin/%";
  const _PROJECTS_ = await buildTools.getAllProjects(_INPUT_);
  // defined in consts that compl is a string if not it will log the error
  const _COMPILER_ = cli.get<string>("compl");
  const _FILE_ =
    (cli.get("file") ?? "main") + (_COMPILER_ == "g++" ? ".cpp" : ".c");
  // iterate thru all found projects
  _PROJECTS_.forEach(async (value, index) => {
    index++;
    const out = wildcardsToURL(_OUTPUT_, value, index);
    const _LIBS_ = await buildTools.getLibs(value);
    const file = join(value, _FILE_);
    validateInputOutput(file, out);
    const cmd = [_COMPILER_, file, _LIBS_.join(" "), "-o", out].join(" ");
    Logger.log("bold", `Compiling: ${value}`);
    shellCall(
      cmd,
      (error) => {
        Logger.log("error", "ERROR FOUND");
        console.log(error.message);
      },
      () => Logger.log("success", `successfully built ${value}`),
    );
  });
}

main();
