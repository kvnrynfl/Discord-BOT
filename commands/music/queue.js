const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('🎵 | Displays the music queue')
        .addSubcommand(subcommand => subcommand
            .setName('view')
            .setDescription('🎵 | Menampilkan music status')
            .addNumberOption((option) => option
                .setName('page')
                .setDescription('🎵 | Enter the queue page number')
                .setMinValue(1)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('shuffle')
            .setDescription('🎵 | Shuffle the music queue')
        )
        .addSubcommand(subcommand => subcommand
            .setName('loop')
            .setDescription('🎵 | Setting loop mode')
            .addIntegerOption((option) => option
                .setName('mode')
                .setDescription('🎵 | Select option loop mode')
                .addChoices(
                    { name: 'OFF', value: QueueRepeatMode.OFF },
                    { name: 'Track', value: QueueRepeatMode.TRACK },
                    { name: 'Queue', value: QueueRepeatMode.QUEUE },
                    { name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY },
                )
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('🎵 | Delete the music that is in the queue')
            .addNumberOption((option) => option
                .setName('number')
                .setDescription(`🎵 | Enter the number of queues | if you don't know, you can use /queue`)
                .setMinValue(1)
                .setRequired(true)
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .setDMPermission(false),
    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["view", "shuffle", "loop", "remove"]);
        const opViewPage = (interaction.options.getNumber('page') || 1) - 1;
        const opLoopMode = interaction.options.getInteger('mode');
        const opRemoveNumber = interaction.option.getNumber('number');
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

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        switch (subcmd) {
            case 'view':
                if (countQueue < 1) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | There are no music in the queue, use command \`/nowplaying\` to see the music currently playing**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                const totalPages = Math.ceil(countQueue / 10) || 1;

                if (opViewPage + 1 > totalPages) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Invalid Page. There are only a total of ${totalPages} pages of queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                NewEmbed
                    .setColor(color)
                    .setTitle(`**🎶 List of music queue to be played**`)
                    .setDescription(
                        `${getQueue.tracks.slice(opViewPage * 10, opViewPage * 10 + 10).map((song, i) => 
                            `**${opViewPage * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
                        ).join("\n")}`
                    )
                    .setFooter({
                        text: `Page ${opViewPage + 1} of ${totalPages}`,
                        iconURL: `${interaction.client.user.displayAvatarURL()}`
                    })
                interaction.reply({ embeds : [NewEmbed] });
                break;

            case 'shuffle':
                if (countQueue < 1) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | There are no music in the queue, use command \`/nowplaying\` to see the music currently playing**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                } else if (countQueue == 1) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | There are only 1 music in the queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                getQueue.shuffle();

                NewEmbed
                    .setColor(color)
                    .setDescription(`**🔀 | Successfully shuffle the music queue**`)
                interaction.reply({ embeds : [NewEmbed] });  
                break;

            case 'loop':
                function StringLoop(repeatMode) {
                    let StringLoop;
                    switch (repeatMode) {
                        case QueueRepeatMode.OFF:
                            StringLoop = "OFF";
                            break;
                        case QueueRepeatMode.TRACK:
                            StringLoop = "TRACK";
                            break;
                        case QueueRepeatMode.QUEUE:
                            StringLoop = "QUEUE";
                            break;
                        case QueueRepeatMode.AUTOPLAY:
                            StringLoop = "AUTOPLAY";
                            break;
                    }
                    return StringLoop
                }

                if (opLoopMode === getQueue.repeatMode) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Repeat mode is currently ${StringLoop(getQueue.repeatMode)}**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                const success = await queue.setRepeatMode(opLoopMode);

                if (success) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**✅ | Successfully changed loop mode from ${StringLoop(getQueue.repeatMode)} to ${StringLoop(opLoopMode)}**`)
                    interaction.reply({ embeds : [NewEmbed] });
                } else {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Failed to change loop mode, please report it using ``/report bug`` so that it can be fixed immediately**`)
                    interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }
                break;

            case 'remove':
                if (countQueue < 1) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | There are no music in the queue, use command \`/nowplaying\` to see the music currently playing**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                } else if (opRemoveNumber > countQueue) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Invalid Number. There are only a total of ${countQueue} queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                getQueue.remove(opRemoveNumber - 1);

                NewEmbed
                    .setColor(color)
                    .setDescription(`**⏭ | Successfully skip music to queue number ${opRemoveNumber}**`)
                interaction.reply({ embeds : [NewEmbed] });
                break;
        }
    },
};