const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('🎵 | Jump to another queue')
        .addNumberOption((option) => option
            .setName("number")
            .setDescription("Enter the number of queues | if you don't know, you can use /queue")
            .setMinValue(1)
            .setRequired(true)
        ),
    async execute(interaction) {
        const jumpnumber = interaction.options.getNumber("number");
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!jumpnumber) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | Option number not detected, please enter the number in the option number**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

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
        
        if (!getQueue || !getQueue.playing){
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        if (countQueue < 1) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music in the queue**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        if (countQueue < jumpnumber) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | Invalid Number. There are only a total of ${countQueue} queue**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        } 
 
        try {
            getQueue.jump(jumpnumber - 1);
        } catch {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | Unable to jump another queue**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        NewEmbed
            .setColor(color)
            .setDescription(`**⏭ | Successfully jump music to queue number ${jumpnumber} **`)

        await interaction.reply({ embeds : [NewEmbed] });
    },
};