import { GuildMembers, TatsuMember } from "./types";
import fs from "fs";
import { guildRequestCall, memberRequestCall, tatsuRequestCall } from './utils'

const dotenv = require("dotenv");
dotenv.config();

const extractLevels = async () => {
  if (
    !process.env.TOKEN ||
    !process.env.TARGET_GUILD ||
    !process.env.TATSU_API
  ) {
    throw new Error(
      "Heya! Thank you for using this tool, it appears that you're missing some if not all information on your .env file. Please make sure you provide the Discord Token (Can be retreived by making a application, create the bot and getting it's token), Tatsi API Key (Doing t!apikey create), and the Target Guild_ID which can be retreived from right-clicking the server icon and pressing 'Copy Server ID' (If you don't see that ensure that Developer Mode is enabled)"
    );
  }

  let after: string | null = null;
  let count = 0;
  const failed: string[] = [];
  let finalFail: string[] = []
  const guildRequest = await guildRequestCall()
  const guild = await guildRequest.json();
  if (guild.code == 0) {
    throw new Error(
      `An error has occured while fetching the guild. Please make sure that the bot has the 'Server Members Intent' enabled.`
    );
  }
  const guildMemberCount = guild.approximate_member_count;
  console.log(`Total members in guild: ${guildMemberCount}, This process will take ${(guildMemberCount/50) + 1} minutes to complete.`)

  // Loop through all members in the guild 50 at a time
  for (let i = 0; i < guildMemberCount; i += 50) {
    const memberRequest = await memberRequestCall(after)
    console.log(`Fetching ${i}/${guildMemberCount} members`);
    const listMembers: GuildMembers = await memberRequest.json();
    if (!Array.isArray(listMembers)) {
      throw new Error(
        `An error has occured while fetching the members. Please make sure that the bot has the 'Server Members Intent' enabled.`
      );
    }
    listMembers.forEach(async (member) => {
      console.log(
        `Fetching ${member.user.username} (${count+1}/${guildMemberCount})`
      );
      if (member.user.bot) {
        console.log(`Skipping ${member.user.username} as it's a bot`);
        count+=1;
        return;
      }
      count += 1;
      const tatsuRequest = await tatsuRequestCall(member)
      const profile: TatsuMember = await tatsuRequest.json();
      if (profile.code) {
        console.log(
          `An error has occured while fetching: ${member.user.username} will retry after this`
        );
        failed.push(member.user.id);
        return
      }
    });
    after = listMembers[listMembers.length - 1].user.id;
    await Promise.resolve(setTimeout(() => {}, 60000))
  }

  if (failed.length > 0) {
    console.log(`Retrying ${failed.length} members in 1 minute`)
    await Promise.resolve(setTimeout(() => {}, 60000))
    failed.forEach(async (id) => {
      const memberRequest = await memberRequestCall(id)
      const member: GuildMembers = await memberRequest.json();
      if (!Array.isArray(member)) {
        throw new Error(
          `An error has occured while fetching the members. Please make sure that the bot has the 'Server Members Intent' enabled.`
        );
      }
      const tatsuRequest = await tatsuRequestCall(member[0])
      const profile: TatsuMember = await tatsuRequest.json();
      if (profile.code) {
        console.log(
          `An error has occured while fetching: ${member[0].user.username} will retry after this`
        );
        finalFail.push(member[0].user.id);
        return
      }
    })
  }
  console.log(`Failed to fetch ${finalFail.length} members`)
  console.log(`Finished fetching ${count} members`)
};

extractLevels();
