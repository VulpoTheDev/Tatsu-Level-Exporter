export type GuildMember = {
  user: {
    id: string;
    username: string;
    bot: boolean;
  };
};

export type TatsuMember = {
    xp: number
    code: number
    message: string
} 

export type GuildMembers = GuildMember[]
