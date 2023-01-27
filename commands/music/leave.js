const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('🎵 | Leave voice channel'),
    async execute(interaction) {
        var color = randomColor();
        let LeaveEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            JoinEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.reply({ embeds : [JoinEmbed] });
        }   

        if (!interaction.guild.members.me.voice.channel) {
            JoinEmbed
                .setColor(color)
                .setDescription(`**❌ | Bot is not on the voice channel**`)
            return interaction.reply({ embeds : [JoinEmbed] });
        }   
        
        if (interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            LeaveEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.reply({ embeds : [LeaveEmbed] });
		}

        // getQueue.destroy();
        interaction.guild.members.me.voice.disconnect();
        
        LeaveEmbed
            .setColor(color)
            .setDescription(`**⏭ | Successfully to leave voice channel**`)

        await interaction.reply({ embeds : [LeaveEmbed] });
    },
};