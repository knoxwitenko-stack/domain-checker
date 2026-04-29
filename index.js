const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  new SlashCommandBuilder()
    .setName("run")
    .setDescription("Runs API check")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log("Slash command registered");
})();

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "run") {
    await interaction.deferReply();

    try {
      const res = await fetch("https://bdyoutube.org/api/check?domains=google.com", {
        headers: {
          "x-api-key": process.env.API_KEY
        }
      });

      const data = await res.json();

      await interaction.editReply(
        "```json\n" + JSON.stringify(data, null, 2) + "\n```"
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply("Request failed.");
    }
  }
});

client.login(TOKEN);
for (const domain of domains) {
  try {
    const res = await fetch(
      `https://bdyoutube.org/api/check?domains=${domain}`,
      {
        headers: {
          "x-api-key": process.env.API_KEY
        }
      }
    );

    const data = await res.json();

    // fake pricing logic (IONOS-style filter)
    const likelyCheap =
      domain.endsWith(".com") ||
      domain.endsWith(".net") ||
      domain.endsWith(".org");

    results.push({
      domain,
      available: data?.available ?? "unknown",
      likely_under_10_usd: likelyCheap
    });

  } catch (err) {
    results.push({
      domain,
      error: "Request failed"
    });
  }
}