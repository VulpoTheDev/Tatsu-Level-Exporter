import fs from "fs";
import { GuildMember, TatsuMember } from "./types";

export const memberRequestCall = async (after: string | null) => {
  return await fetch(
    `${process.env.DISCORD_BASE_API}/guilds/${
      process.env.TARGET_GUILD
    }/members?limit=50${after ? `&after=${after}` : ""}`,
    {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    }
  );
};

export const guildRequestCall = async () => {
  return await fetch(
    `${process.env.DISCORD_BASE_API}/guilds/${process.env.TARGET_GUILD}?with_counts=true`,
    {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    }
  );
};

export const tatsuRequestCall = async (member: GuildMember) => {
  return await fetch(
    `${process.env.TATSU_BASE_API}/users/${member.user.id}/profile`,
    {
      headers: {
        Authorization: `${process.env.TATSU_API}`,
      },
    }
  );
};

export const updateJSON = (member: GuildMember, profile: TatsuMember) => {
  const file = `levels.json`;
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data[member.user.id] = profile.xp;
  const update = JSON.stringify(data);
  fs.writeFileSync(file, update);
};
