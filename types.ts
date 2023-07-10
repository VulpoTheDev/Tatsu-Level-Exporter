export type GuildMember = {
  user: {
    id: string;
    username: string;
    bot: boolean;
  };
};

export type TatsuMember = {
    xp: number
} | { message: string, code: number }

export type GuildMembers = GuildMember[] | { message: string, code: number };
