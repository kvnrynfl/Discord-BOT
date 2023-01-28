const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('🎵 | Leave voice channel'),
    async execute(interaction) {
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        if (!interaction.guild.members.me.voice.channel) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | Bot is not on the voice channel**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }
        
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
		}

        try {
            await getQueue.destroy();
        } catch {
            interaction.guild.members.me.voice.disconnect();
        }

        NewEmbed
            .setColor(color)
            .setDescription(`**⏭ | Successfully to leave voice channel**`)
        await interaction.reply({ embeds : [NewEmbed] });
    },
};