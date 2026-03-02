import { getContent } from "@zeyah-bot/utils";

export const Catfact = module.register({
  emoji: "😺",
  name: "catfact",
  version: "1.0.0",
  author: ["@lianecagara", "@popcat"],
  pluginNames: [],
  description: "I GIVE YU SUM RANOMIZED FACTS!!",
  WrapperFC({ getChildrenString }) {
    return (
      <Comps.CassFormat
        title="😺 LulCat Wisdom!"
        fbContentFont="fancy"
        fbTitleFont="bold"
      >
        {getChildrenString()}
      </Comps.CassFormat>
    );
  },
  async onCommand({ zeyahIO }) {
    const {
      message: { fact },
    } = await getContent<{ message: { fact: string } }>(
      "https://api.popcat.xyz/v2/fact",
    );

    const {
      message: { text: catVer },
    } = await getContent<{ message: { text: string } }>(
      "https://api.popcat.xyz/v2/lulcat",
      {
        text: fact,
      },
    );

    await zeyahIO.reply(<>{catVer}</>);
  },
});
