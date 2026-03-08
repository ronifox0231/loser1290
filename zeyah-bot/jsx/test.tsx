import {
  Bold,
  Break,
  CassFormat,
  type FC,
  Heading,
  Italic,
  Line,
  List,
  ListItem,
  type PropsWithInfo,
  renderZeyahTree,
  Spoiler,
} from "./index.js";

const favItems = ["Minecraft", "GD", "Coding", "IbisPaint"];

const res = (
  <>
    Ang crush ko po ay si{" "}
    <Spoiler>
      <Bold>Secret, baliw</Bold>
    </Spoiler>
    <Break />
    <br />
    <Heading level={2}>My Fav things:</Heading>
    <br />
    <List ordered indent={2} boldPrefix>
      {favItems.map((i) => (
        <ListItem>{i}</ListItem>
      ))}
    </List>
    <fragment></fragment>
  </>
);
console.log("FB:");
console.log(res.renderFacebook());
console.log();
console.log();
console.log("Discord:");
console.log(res.renderDiscord());

const test1 = (
  <CassFormat title="🎈 Test" fbContentFont="fancy" fbTitleFont="bold">
    Hi bozo!
    <Break />
    <Italic>Well... Well.. Hmm.</Italic>
  </CassFormat>
);
console.log();
console.log();
console.log(test1.renderFacebook());
console.log();
console.log();
console.log(test1.renderDiscord());

const test2 = (
  <>
    Hello, <Bold>World!</Bold>
    <br />
    <Italic>Helloooo.....</Italic>
    <br />
    <Line />
    <br />
    <Bold>Rules!!!</Bold>
    <br />
    <List ordered boldPrefix>
      {[
        "cute si liane",
        "kayelaa na name ni liane",
        "axera-fca tomorrow",
        "may jsx na",
        "ok madam",
      ].map((i) => (
        <ListItem>{i}</ListItem>
      ))}
    </List>
  </>
);
console.log();
console.log();
// console.log(test2.renderFacebook());
console.log();
console.log();
console.log(test2.renderDiscord());
