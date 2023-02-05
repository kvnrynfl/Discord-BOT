const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('🎵 | Displays the music being played')
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .setDMPermission(false),
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

        if (!getQueue || !getQueue.playing){
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        NewEmbed
            .setColor(color)
            .setTitle(`**🎶 Music being played**`)
            .setDescription(
                `Author : ${getQueue.current.author}\n` +
                `Title : [${getQueue.current.title}](${getQueue.current.url})\n` +
                `Duration : ${getQueue.current.duration}\n` +
                `Views : ${getQueue.current.views}\n` +
                `Request By : <@${getQueue.current.requestedBy.id}>`
            )
            .setThumbnail(getQueue.current.thumbnail)
            .addFields(
                { name: "Progress Bar", value: `${getQueue.createProgressBar({ timecodes: true , queue : true,})}` },
                { name: "Music Option", value: 
                    `Paused : ${getQueue.connection.paused}\n` +
                    `LeaveOnEnd : ${getQueue.options.leaveOnEnd}\n` +
                    `LeaveOnStop : ${getQueue.options.leaveOnStop}\n` +
                    `LeaveOnEmpty : ${getQueue.options.leaveOnEmpty}\n` +
                    `LeaveOnEndCooldown : ${getQueue.options.leaveOnEndCooldown}\n` +
                    `LeaveOnEmptyCooldown : ${getQueue.options.leaveOnEmptyCooldown}`
                }
            )
        interaction.reply({ embeds : [NewEmbed] });
    },
};