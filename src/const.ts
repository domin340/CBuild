export type ARG_VALUE = "string" | "number" | "boolean";
export type ARG_VAL_T = string | number | boolean;
export type ConstantARGS = {
  [key: string]: {
    type: ARG_VALUE;
    desc: string;
    required?: boolean;
  };
};
export default {
  input: {
    type: "string",
    desc: "defines the where the source code is. To define multi project use ./path_to_source",
  },
  out: {
    type: "string",
    desc: `determines where the compiled c++ code will end up, supports wild cards like (
          $: input_dir,
          %: replaces for the project name,
          #: iteration loop counter. Starts from 1.
        )`,
  },
  test: {
    type: "boolean",
    desc: "determines whenever to run input_dir or ./test",
  },
  config: {
    type: "string",
    desc: "config determines whenever to continue with cli commands or just json",
  },
  proj: {
    type: "string",
    desc: "when input ends like path/* this will be useful if you want to run just 1 directory",
  },
  compl: {
    type: "string",
    desc: "determines the compiler you want to use. g++ or gcc",
    required: true,
  },
  file: {
    type: "string",
    desc: "defines what file to run. Default is main.",
  },
  h: {
    type: "boolean",
    desc: "displays help",
  },
  help: {
    type: "boolean",
    desc: "does what h do but the name is resolved 😁",
  },
} satisfies ConstantARGS;
