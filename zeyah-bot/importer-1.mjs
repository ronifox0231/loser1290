import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./zeyah-bot/loader.mjs", pathToFileURL("./"));
