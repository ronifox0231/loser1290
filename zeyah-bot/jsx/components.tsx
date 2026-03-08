import { applyFonts, FontTypes, UNIRedux } from "@nea-liane/styler";
import { ensureArrayChildren, type FC, Platform, type PropsWithInfo } from "./zeyah.js";

export const Break: FC<{}> = ({}) => {
  return "\n";
};

Break.displayName = "Break";

export const Bold: FC<PropsWithInfo> = ({ childrenString }) => {
  return (
    <>
      <Platform type="facebook">{applyFonts(childrenString, "bold")}</Platform>
      <Platform type="discord">{`**${escapeDiscordMarkdown(childrenString)}**`}</Platform>
    </>
  );
};

Bold.displayName = "Bold";

export const Italic: FC<PropsWithInfo> = ({ childrenString }) => {
  return (
    <>
      <Platform type="facebook">
        {applyFonts(childrenString, "fancy_italic")}
      </Platform>
      <Platform type="discord">{`*${escapeDiscordMarkdown(childrenString)}*`}</Platform>
    </>
  );
};

Italic.displayName = "Italic";

export const UniFont: FC<PropsWithInfo<{ type: FontTypes }>> = ({
  type,
  childrenString,
}) => {
  return (
    <>
      <Platform type="facebook">{applyFonts(childrenString, type)}</Platform>
      <Platform type="discord">
        {escapeDiscordMarkdown(childrenString)}
      </Platform>{" "}
    </>
  );
};

export const Code: FC<PropsWithInfo> = ({ childrenString }) => {
  return (
    <>
      <Platform type="facebook">
        {applyFonts(childrenString, "typewriter")}
      </Platform>
      <Platform type="discord">{`\`${escapeDiscordMarkdown(childrenString)}\``}</Platform>
    </>
  );
};

Code.displayName = "Code";

export interface CodeBlockProps {
  lang?: string;
}

export const CodeBlock: FC<PropsWithInfo<CodeBlockProps>> = ({
  lang = "",
  childrenString,
}) => {
  return (
    <>
      <Platform type="facebook">
        Language: {lang}
        <Break />
        {applyFonts(childrenString, "typewriter")}
      </Platform>
      <Platform type="discord">
        {`\`\`\`${lang}\n${escapeDiscordMarkdown(childrenString)}\n\`\`\``}
      </Platform>
    </>
  );
};

CodeBlock.displayName = "CodeBlock";

export const Quote: FC<PropsWithInfo> = ({ childrenString }) => {
  return (
    <>
      <Platform type="facebook">
        {applyFonts(childrenString, "fancy_italic")}
      </Platform>
      <Platform type="discord">
        {escapeDiscordMarkdown(childrenString)
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n")}
      </Platform>
    </>
  );
};

Quote.displayName = "Quote";

export const Spoiler: FC<PropsWithInfo> = ({ childrenString }) => {
  return (
    <>
      <Platform type="facebook">{childrenString}</Platform>
      <Platform type="discord">{`||${escapeDiscordMarkdown(childrenString)}||`}</Platform>
    </>
  );
};

Spoiler.displayName = "Spoiler";

export const Text: FC<PropsWithInfo<{ noEscape?: boolean }>> = ({
  childrenString,
  noEscape = false,
}) => {
  return (
    <>
      <Platform type="facebook">{applyFonts(childrenString, "fancy")}</Platform>
      <Platform type="discord">
        {!noEscape ? escapeDiscordMarkdown(childrenString) : childrenString}
      </Platform>
    </>
  );
};

export function escapeDiscordMarkdown(str: string) {
  return str.replace(/([*_~`|>])/g, "\\$1");
}

export const Repeated: FC<PropsWithInfo<{ times: number }>> = ({
  times,
  childrenString,
}) => {
  return childrenString.repeat(times);
};

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: FC<PropsWithInfo<HeadingProps>> = ({
  level = 1,
  childrenString,
}) => {
  const fbFont: FontTypes = "bold";
  const discordPrefix = "#".repeat(level) + " ";
  return (
    <>
      <Platform type="facebook">{applyFonts(childrenString, fbFont)}</Platform>
      <Platform type="discord">
        {discordPrefix + escapeDiscordMarkdown(childrenString)}
      </Platform>
    </>
  );
};

export interface LinkProps {
  url: string;
}

export const Link: FC<PropsWithInfo<LinkProps>> = ({ url, childrenString }) => {
  return (
    <>
      <Platform type="facebook">{childrenString}</Platform>
      <Platform type="discord">{`[${escapeDiscordMarkdown(childrenString)}](${url})`}</Platform>
    </>
  );
};

export const Line: FC = ({}) => (
  <>
    <Platform type="facebook">{UNIRedux.standardLine}</Platform>
    <Platform type="discord">{UNIRedux.standardLine}</Platform>
  </>
);

export interface MentionProps {
  discordID?: string;
  fbName?: string;
}

export const Mention: FC<PropsWithInfo<MentionProps>> = ({
  discordID: id,
  fbName: name,
}) => (
  <>
    <Platform type="facebook">@{name ?? id}</Platform>
    <Platform type="discord">{`<@${id}>`}</Platform>
  </>
);

export interface ListProps {
  ordered?: boolean;
  prefix?: string;
  start?: number;
  boldPrefix?: boolean;
  indent?: number;
}

export const List: FC<PropsWithInfo<ListProps>> = ({
  ordered = false,
  prefix = "•",
  start = 1,
  childrenData,
  platform,
  boldPrefix = false,
  indent = 0,
}) => {
  let counter = start;

  const lines = childrenData.map((child) => {
    const isItem =
      child.fiber !== "string" &&
      child.fiber.type.displayName === ListItem.displayName;
    const rendered = child.getRendered();

    if (isItem) {
      const ind = indent <= 0 ? "" : " ".repeat(Math.floor(indent));
      const line = ordered
        ? `${ind}${boldPrefix ? (platform === "facebook" ? applyFonts(counter.toString(), "bold") : `**${counter}**`) : counter}. ${rendered}`
        : `${ind}${platform === "discord" ? "-" : prefix} ${rendered}`;
      counter++;

      return line;
    } else {
      return rendered;
    }
  });

  const finalStr = lines.join("\n");

  return (
    <>
      <Platform type="facebook">{finalStr}</Platform>
      <Platform type="discord">{finalStr}</Platform>
    </>
  );
};

export const ListItem: FC<PropsWithInfo> = ({ childrenString }) => (
  <>
    <Platform type="facebook">{childrenString}</Platform>
    <Platform type="discord">{childrenString}</Platform>
  </>
);

ListItem.displayName = "ListItem";

export const Indent: FC<PropsWithInfo<{ level: number }>> = ({
  childrenString,
  level,
}) => {
  return childrenString
    .split("\n")
    .map((i) => `${" ".repeat(level)}${i}`)
    .join("\n");
};

Indent.displayName = "Indent";

export interface CassProps {
  title: string;
  fbTitleFont?: FontTypes;
  fbContentFont?: FontTypes;
}

export const CassFormat: FC<PropsWithInfo<CassProps>> = ({
  childrenString,
  title,
  fbTitleFont: titleFont,
  fbContentFont: contentFont,
}) => {
  titleFont ??= "bold";
  contentFont ??= "fancy";
  return (
    <>
      <Platform type="facebook">
        <UniFont type={titleFont}>{title}</UniFont>
        <Break />
        <Line />
        <Break />
        <UniFont type={contentFont}>{childrenString}</UniFont>
      </Platform>
      <Platform type="discord">
        <Bold>{title}</Bold>
        <Break />
        <Line />
        <Break />
        <Text noEscape>{childrenString}</Text>
      </Platform>
    </>
  );
};
