import definitions from "./const";
import { Flags } from "./utils";

const flags = new Flags(definitions);
const item = flags.get<boolean>("config");
console.log(item)
