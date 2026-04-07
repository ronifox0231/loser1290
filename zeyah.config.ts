import { defineConfig } from "@zeyah-bot/registry";
import "dotenv/config";
import { sixSevenPlugin } from "./checked/sixSeven-plugin.js";
import { menuHandlePlugin } from "./checked/menu-handle.js";

export default defineConfig({
  DESIGN: {
    Title: "ARUSH",
    Admin: "ARUSH",
    Theme: "retro",
  },
  adminBot: ["100046863708863", "100070089944542"],
  moderatorBot: [],
  prefixes: [process.env.PREFIX ?? "+"],
  useDiscord: true,
  useFacebook: process.env.FB_STATE ? true : false,
  discordToken: process.env.DISCORD_TOKEN ?? "",
  plugins: [sixSevenPlugin, menuHandlePlugin],
  pluginConfig: {
    "menu-handle": {},
    "six-seven": {
      enabled: true,
    },
  },
  lang: "en",
});
