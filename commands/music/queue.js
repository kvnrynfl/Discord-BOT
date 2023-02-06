const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('🎵 | Option for music queue')
        .addSubcommand(subcommand => subcommand
            .setName('view')
            .setDescription('🎵 | Menampilkan music status')
            .addIntegerOption((option) => option
                .setName('page')
                .setDescription('🎵 | Enter the queue page number')
                .setMinValue(1)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('move')
            .setDescription('🎵 | Move music positions in the queue')    
            .addIntegerOption((option) => option
                .setName('track')
                .setDescription(`🎵 | Enter track number of queues | if you don't know, you can use /queue`)
                .setMinValue(1)
                .setRequired(true)
            )
            .addIntegerOption((option) => option
                .setName('position')
                .setDescription(`🎵 | Enter position number of queues | if you don't know, you can use /queue`)
                .setMinValue(1)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('swap')
            .setDescription('🎵 | Swap music positions in the queue')  
            .addIntegerOption((option) => option
                .setName('track1')
                .setDescription(`🎵 | Enter track number of queues | if you don't know, you can use /queue`)
                .setMinValue(1)
                .setRequired(true)
            )
            .addIntegerOption((option) => option
                .setName('track2')
                .setDescription(`🎵 | Enter track number of queues | if you don't know, you can use /queue`)
                .setMinValue(1)
                .setRequired(true)
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
            .addIntegerOption((option) => option
                .setName('number')
                .setDescription(`🎵 | Enter track number of queues | if you don't know, you can use /queue`)
                .setMinValue(1)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('clear')
            .setDescription('🎵 | Clear the music queue')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .setDMPermission(false),
    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["view", "move", "swap", "shuffle", "loop", "remove"]);
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
                const opViewPage = (interaction.options.getInteger('page') || 1) - 1;
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

            case 'move':
                const opMoveTrack = interaction.options.getInteger('track') - 1;
                const opMovePosition = interaction.options.getInteger('position') - 1;
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
                } else if (opMoveTrack > countQueue) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Invalid Track Number. There are only a total of ${countQueue} queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                } else if (opMovePosition > countQueue) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Invalid Position Number. There are only a total of ${countQueue} queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                const track = await getQueue.remove(opMoveTrack);
                await getQueue.insert(track, opMovePosition);
                NewEmbed
                    .setColor(color)
                    .setDescription(`**✅ | Successfully move music in queue number ${opMoveTrack + 1} to queue number${opMovePosition + 1}**`)
                interaction.reply({ embeds: [NewEmbed] });
                break;

            case 'swap':
                const queueNumbers = [interaction.options.getInteger('track1') - 1, interaction.options.getInteger('track2') - 1];
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
                } else if (queueNumbers[0] > countQueue) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Invalid Track1 Number. There are only a total of ${countQueue} queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                } else if (queueNumbers[1] > countQueue) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Invalid Track2 Number. There are only a total of ${countQueue} queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                queueNumbers.sort(function (a, b) {
                    return a - b;
                });

                const track2 = queue.remove(queueNumbers[1]);
                const track1 = queue.remove(queueNumbers[0]);
                queue.insert(track2, queueNumbers[0]);
                queue.insert(track1, queueNumbers[1]);

                NewEmbed
                    .setColor(color)
                    .setDescription(`**✅ | Successfully swapped music queue number ${queueNumbers[0] + 1} with queue number${queueNumbers[1] + 1}**`)
                interaction.reply({ embeds: [NewEmbed] });
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

                await getQueue.shuffle();

                NewEmbed
                    .setColor(color)
                    .setDescription(`**🔀 | Successfully shuffle the music queue**`)
                interaction.reply({ embeds : [NewEmbed] });  
                break;

            case 'loop':
                const opLoopMode = interaction.options.getInteger('mode');
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
                const opRemoveNumber = interaction.option.getInteger('number');
                if (countQueue < 1) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | There are no music in the queue, use command \`/stop\` to stop the music playing**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                } else if (opRemoveNumber > countQueue) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Invalid Track Number. There are only a total of ${countQueue} queue**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                await getQueue.remove(opRemoveNumber - 1);

                NewEmbed
                    .setColor(color)
                    .setDescription(`**✅ | Successfully deleted music in queue number ${opRemoveNumber}**`)
                interaction.reply({ embeds : [NewEmbed] });
                break;

            case 'clear':
                if (countQueue < 1) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`**❌ | There are no music in the queue, use command \`/stop\` to stop the music playing**`)
                    return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
                }

                await getQueue.clear();

                NewEmbed
                    .setColor(color)
                    .setDescription(`✅ | Successfully removed all music queue`)
                interaction.reply({ embeds : [NewEmbed] });
                break;
        }
    },
};