import { GuildMembers, TatsuMember } from "./types";

const dotenv = require("dotenv");
dotenv.config();

const extractLevels = async (limit: number = 50, after?: string | undefined) => {

  if (
    !process.env.TOKEN ||
    !process.env.TARGET_GUILD ||
    !process.env.TATSU_API
  ) {
    throw new Error(
      "Heya! Thank you for using this tool, it appears that you're missing some if not all information on your .env file. Please make sure you provide the Discord Token (Can be retreived by making a application, create the bot and getting it's token), Tatsi API Key (Doing t!apikey create), and the Target Guild_ID which can be retreived from right-clicking the server icon and pressing 'Copy Server ID' (If you don't see that ensure that Developer Mode is enabled)"
    );
  }
  const baseURL = "https://discord.com/api/v10";
  const tatsuBaseURL = "https://api.tatsu.gg/v1"
  const failed = []
  const request = await fetch(
    `${baseURL}/guilds/${process.env.TARGET_GUILD}/members?limit=${limit}${after ? `&after: ${after}` : ""}`,
    {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    }
  );
  const list_members: GuildMembers = await request.json();
  if (!Array.isArray(list_members)) {
    throw new Error(
      `An error has occured while fetching the members. Please make sure that the bot has the 'Server Members Intent' enabled.`
    );
  }
  list_members.forEach(async (member) => {
    if (member.user.bot) { 
        return
    }
    const tatsuRequest = await fetch(`${tatsuBaseURL}/users/${member.user.id}/profile`, {
        headers: {
            Authorization: `${process.env.TATSU_API}`,
        }
    })
    const profile: TatsuMember = await tatsuRequest.json()
    if (profile.code) {
        console.log(`An error has occured while fetching: ${member.user.username} will retry after this`)
        failed.push(member.user.id)
    }
    
    
    console.log(profile)

  });
};



extractLevels();
