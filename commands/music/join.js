const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { QueryType } = require("discord-player");
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('🎵 | Join voice channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Tag voice channel')
            .addChannelTypes(ChannelType.GuildVoice)
        ),
    async execute(interaction) {
        const opJoinChannel = interaction.options.getChannel('channel');
        var color = randomColor();
        let MusicEmbed = new EmbedBuilder();

        const createQueue = await interaction.client.player.createQueue(interaction.guild,{
            metadata: interaction.channel
        })

        // if(createQueue.connection){
        //     MusicEmbed
        //         .setColor(color)
        //         .setDescription(`**❌ | Bot is currently being used on the ${interaction.client.member.channel} channel**`)
        //     return interaction.editreply({ embeds : [MusicEmbed] });
        // }

        if(opJoinChannel){
            await createQueue.connect(opJoinChannel);
            MusicEmbed
                .setColor(color)
                .setDescription(`**✅ | Joined ${opJoinChannel}**`)
        } else {
            if (!interaction.member.voice.channel) {
                MusicEmbed
                    .setColor(color)
                    .setDescription(`**❌ | You must in a voice channel to use this command**`)
                return interaction.editreply({ embeds : [MusicEmbed] });
            }   
            await createQueue.connect(interaction.member.voice.channel);
            MusicEmbed
                .setColor(color)
                .setDescription(`**✅ | Joined ${interaction.member.voice.channel}**`)
        }

        await interaction.editreply({ embeds : [MusicEmbed] });
    },
};