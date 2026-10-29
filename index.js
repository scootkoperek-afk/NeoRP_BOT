const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once(Events.ClientReady, (bot) => {
  console.log(`NeoRP_BOT działa jako ${bot.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'panel-weryfikacji') {
    const button = new ButtonBuilder()
      .setCustomId('neorp_weryfikacja')
      .setLabel('Zweryfikuj się')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: 'Kliknij przycisk poniżej, aby się zweryfikować.',
      components: [row]
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'neorp_weryfikacja') return;

  const roleId = process.env.VERIFIED_ROLE_ID;

  if (!roleId) {
    await interaction.reply({
      content: 'Weryfikacja nie jest jeszcze skonfigurowana przez administratora.',
      ephemeral: true
    });
    return;
  }

  try {
    await interaction.member.roles.add(roleId);
    await interaction.reply({
      content: 'Weryfikacja zakończona pomyślnie.',
      ephemeral: true
    });
  } catch {
    await interaction.reply({
      content: 'Nie udało się nadać roli. Administrator musi sprawdzić uprawnienia bota.',
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
