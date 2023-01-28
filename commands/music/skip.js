const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('🎵 | Skip the currently playing song')
        .addNumberOption((option) => option
            .setName('amount')
            .setDescription(`Enter the number of queues | if you don't know, you can use /queue`)
            .setMinValue(1)
        ),
    async execute(interaction) {
        const skipnumber = interaction.options.getNumber("amount");
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
            return interaction.editReply({ embeds : [NewEmbed], ephemeral : true });
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

        if (skipnumber) {
            if (skipnumber > countQueue) {
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Invalid Number. There are only a total of ${countQueue} queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
            }

            getQueue.skipTo(skipnumber - 1);

            NewEmbed
                .setColor(color)
                .setDescription(`**⏭ | Successfully skip music to queue number ${skipnumber}**`)
        } else {
            getQueue.skip();
            
            NewEmbed
                .setColor(color)
                .setDescription(`**⏭ | Successfully to skip music**`)
        }
        
        interaction.reply({ embeds : [NewEmbed] });
    },
};