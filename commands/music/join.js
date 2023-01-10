const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
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
        let JoinEmbed = new EmbedBuilder();

        const createQueue = await interaction.client.player.createQueue(interaction.guild,{
            metadata: interaction.channel
        })
        
        if(opJoinChannel){
            await createQueue.connect(opJoinChannel);
            JoinEmbed
                .setColor(color)
                .setDescription(`**✅ | Joined ${opJoinChannel}**`)
        } else {
            if (!interaction.member.voice.channel) {
                JoinEmbed
                    .setColor(color)
                    .setDescription(`**❌ | You must in a voice channel to use this command**`)
                return interaction.editReply({ embeds : [JoinEmbed] });
            }   
            await createQueue.connect(interaction.member.voice.channel);
            JoinEmbed
                .setColor(color)
                .setDescription(`**✅ | Joined ${interaction.member.voice.channel}**`)
        }

        await interaction.editReply({ embeds : [JoinEmbed] });
    },
};