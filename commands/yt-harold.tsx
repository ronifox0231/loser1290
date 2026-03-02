import { Bold, CassFormat } from "@kayelaa/zeyah";
import { Breaks } from "@zeyah-bot/components";
import { getStreamFromUrlFull } from "@zeyah-bot/utils";
import axios from "axios";
import yts from "yt-search";

export const YTH = module.register({
  emoji: "🎧",
  name: "music",
  version: "1.0.1",
  author: ["@lianecagara", "@Jonell-Magallanes"],
  pluginNames: [],
  description: "Play and Download Youtube Music",
  WrapperFC({ getChildrenString }) {
    return (
      <CassFormat
        title="🎶 Music Player YT"
        fbContentFont="none"
        fbTitleFont="bold"
      >
        {getChildrenString()}
      </CassFormat>
    );
  },
  async onCommand({ zeyahIO, args, event }) {
    const query = args.join(" ");
    if (!query) {
      return zeyahIO.reply(<>❌ Please provide a song name to search.</>);
    }
    const p = await zeyahIO.reply(<>Processing....</>);

    const search = await yts(query);
    if (!search.videos.length) {
      await zeyahIO.reply(<>❌ No results found.</>);
      await zeyahIO.unsend(p);
      return;
    }

    const video: yts.VideoSearchResult = search.videos.at(0);
    const url = video.url;

    const apiUrl = `https://ccproject.serv00.net/ytdl2.php`;
    const res = await axios.get<{ download: string }>(apiUrl, {
      params: {
        url,
      },
    });
    const { download } = res.data;
    const audio = await getStreamFromUrlFull(download, "music.mp3", {});
    const musicMessage = await zeyahIO
      .reply(
        <>
          <Bold>Title:</Bold> {video.title}
          <br />
          <Bold>Author:</Bold> {video.author.name}
          <br />
          <Bold>Duration:</Bold> {video.timestamp}
          <br />
          <Bold>YouTube URL:</Bold> {video.url}
          <Breaks n={2} />
          💾 Type <Bold>"dl"</Bold> or <Bold>"download"</Bold> to get download
          link.
        </>,
      )
      .setAttachments([{ name: "music.mp3", stream: audio.stream }]);
    const author = event.senderID;

    musicMessage.listenReplies({ timeout: 5 * 1000 });
    musicMessage.on("reply", async (zeyahIO, event) => {
      const { body, senderID } = event;

      if (senderID !== author) return;

      const message = body.toLowerCase().trim();

      if (message === "dl" || message === "download") {
        const downloadMessage = await zeyahIO.reply(
          <>body:📥 Download URL:\n${download}</>,
        );

        setTimeout(async () => {
          try {
            await zeyahIO.unsend(downloadMessage);
          } catch (e) {}
        }, 50000);
      }
    });
    await zeyahIO.unsend(p);
  },
});
