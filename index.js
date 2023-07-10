const dotenv = require('dotenv')
dotenv.config()

export const extractLevels = async () => {
    const baseURL = 'https://discord.com/api/v10';
    const list_members = await fetch(`${baseURL}/guilds/{guild.id}/members`, {
        headers: {
            "Authorization": process.env.TOKEN
        }
    })
    console.log(list_members)

}