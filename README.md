# CBuild

Mainly a shcool purpose c/c++ builder.
CBuild is a tool that allow you to easily build ( and maybe debug in the future) using flags or config.

## Wildcards

CBuild supports wildcards for only input and out flags.

out flag wildcards:

- $ means the full project path
- % means the base name of the project
- \# the iteration count

input flag wildcards:

- \* used at the end defines whenever the input has more than 1 project\

## Flags

CBuild has few very useful flags you should remember!\
**These are also listed in [consts.ts](https://github.com/domin340/CBuild/blob/alpha/src/const.ts)**

- input - defines the source code path. Default src,
- out - defines the output of the build,
- test - works if input is not provided. Changes the default input to test directory,
- config - instead of checking other flags it will use the json file provided as value.\
Default ./build.config.json,
- proj - what project do you want to run. Only works if while using input * wildcard at the end\
Allow you to run one out of few projects,
- compl - required argument that's used to determine whenever you want to compile c or c++ code,
- file - this argument defines the main file of the project. Default main,
- h / help - displays help. Stops the program if provided

## Examples

After you either built the project using webpack or installed the pre-release.\
You can now use CBuild!

Defaultly the path after build should be dist/index.min.cjs

```bash
# example for multi-project source code for c++
node path/name.cjs --input="MY_CPP_SOURCE_CODE/*" --out="./bin/%" --compl="g++";
# single project source code for c
node path/name.cjs --input="MY_C_SOURCE_CODE" --out="$/bin/main" --compl="gcc";
# using config
node path/name.cjs --config="./configs/cbuild.json" # defeaultly it will be ./build.config.json
```

## Express installation

Change the name after "o" and 0 flag however you like!

using CURL

```bash
curl -o ./index.min.cjs https://github.com/domin340/CBuild/releases/download/alpha/index.min.cjs;
```

using WGET

```powershell
wget -0 ./index.min.cjs https://github.com/domin340/CBuild/releases/download/alpha/index.min.cjs;
```

Thank you for visiting my repository 🔥
