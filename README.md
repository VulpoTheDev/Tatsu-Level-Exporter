# Tatsu Member Levels to JSON
This script will get all the users from your discord server and simply calls the API from tatsu to fetch the level of each user and then saves it to a json file. This will avoid hitting the ratelimit of the tatsu API and will allow you to use the data for other purposes such as migrating to another leveling bot or "just in case" situations.

## How to use
1. Install the dependencies (`yarn install`)
2. Modify the .env providing the token of your bot, guild id and the tastu API Key (This can be retreived via t!apikey create)
3. Let her rip (`yarn start`)

## Resources

- Discord Developer Portal (https://discord.com/developers/applications)
- Tatsu API (https://dev.tatsu.gg)