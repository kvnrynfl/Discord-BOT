const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('🎵 | Join voice channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('🎵 | Tag voice channel')
            .addChannelTypes(ChannelType.GuildVoice)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .setDMPermission(false),
    async execute(interaction) {
        const opJoinChannel = interaction.options.getChannel('channel');
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();

        const createQueue = await interaction.client.player.createQueue(interaction.guild,{
            metadata: interaction.channel
        })
        
        if(opJoinChannel){
            if (interaction.guild.members.me.voice.channelId && opJoinChannel == interaction.guild.members.me.voice.channelId) {
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Bot is already on the same voice channel**`)
                return interaction.reply({ embeds : [NewEmbed], ephemeral: true });
            }

            try {
                if (!createQueue.connection) {
                    await createQueue.connect(opJoinChannel);
                }
            } catch {
                createQueue.destroy();
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Unable to join your voice channel**`)
                return interaction.reply({ embeds : [NewEmbed], ephemeral: true });
            }
            
            NewEmbed
                .setColor(color)
                .setDescription(`**✅ | Joined ${opJoinChannel}**`)
        } else {
            if (!interaction.member.voice.channel) {
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | You must in a voice channel to use this command**`)
                return interaction.editReply({ embeds : [NewEmbed], ephemeral: true });
            }   

            if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId == interaction.guild.members.me.voice.channelId) {
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Bot is already on the same voice channel**`)
                return interaction.reply({ embeds : [NewEmbed], ephemeral: true });
            }
            
            try {
                if (!createQueue.connection) {
                    await createQueue.connect(interaction.member.voice.channel);
                }
            } catch {
                await createQueue.destroy();
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Unable to join your voice channel**`)
                return interaction.reply({ embeds : [NewEmbed], ephemeral: true });
            }

            NewEmbed
                .setColor(color)
                .setDescription(`**✅ | Joined ${interaction.member.voice.channel}**`)
        }

        await interaction.reply({ embeds : [NewEmbed] });
    },
};