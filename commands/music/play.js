const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType  } = require('discord.js');
const { useMasterPlayer, QueryType, QueueRepeatMode } = require("discord-player");
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('🎵 | Started playing music')
        .addStringOption((option) => option
            .setName('track')
            .setDescription('🎵 | Enter the Title/URL/PlayList you want to play')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .setDMPermission(false),
    async autocomplete(interaction) {
        const player = useMasterPlayer();
        const focusedValue = interaction.options.getFocused();

        if (!focusedValue) return;

        const result = await player.search(focusedValue, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });
        
        if (!result || !result.tracks.length) return;

        const resultFilter = result.tracks.filter(res => 
			res.title.toLowerCase().includes(focusedValue.toLowerCase())
		).sort((a, b) => 
			b.views - a.views
		);

        await interaction.respond(
			resultFilter.slice(0, 10).map(res => (
				{ name: `[ ${res.duration} ] ${res.title.slice(0, 85)}`, value: res.url }
			)),
		);
    },
    async execute(interaction) {
        const opPlayTrack = interaction.options.getString('track');
        let color = randomColor();
        let MusicEmbed = new EmbedBuilder();
        let CollectorEmbed = new EmbedBuilder();
        const player = useMasterPlayer();

        if (!interaction.member.voice.channel) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.reply({ embeds : [MusicEmbed], ephemeral : true });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.reply({ embeds : [MusicEmbed], ephemeral : true });
		}

        let queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            player.nodes.create(interaction.guild, {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user,
                },
                repeatMode: QueueRepeatMode.OFF, // OFF = 0, TRACK = 1, QUEUE = 2, AUTOPLAY = 3
                volume: 100,
                selfDeaf: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
                leaveOnStop: true,
                leaveOnStopCooldown: 300000,
            });

            queue = player.nodes.get(interaction.guild.id);
        }

        if (!queue.connection) {
            try {
                await queue.connect(interaction.member.voice.channel);
            } catch (error) {
                await queue.delete();

                MusicEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Unable to join your voice channel**`)
                return interaction.reply({ embeds : [MusicEmbed], ephemeral : true });
            }
        }

        const result = await player.search(opPlayTrack, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        if (!result || !result.tracks || !result.tracks.length) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | No Songs/Videos/Playlists found when searching : ${opPlayTrack}**`)
            return interaction.reply({ embeds : [MusicEmbed], ephemeral : true });
        }

        if (result.playlist) {
            const song = result.tracks;
            const playlist = result.playlist;

            try {
                await queue.addTrack(song);
                if (!queue.node.isPlaying()) queue.node.play();
            } catch (error) {
                console.log(error);
            }

            MusicEmbed
                .setColor(color)
                .setTitle(`**🎶 Playlist added to the queue**`)
                .setURL(`${playlist.url}`)
                .setDescription(
                    `**Author** : [${playlist.author.name}](${playlist.author.url})\n` +
                    `**Title** : ${playlist.title}\n` +
                    `**Track Size** : ${song.length}\n` +
                    `**Description** : ${playlist.description}\n` +
                    `${song.slice(0, 10).map((song, i) => `**${i+1}.** \`[${song.duration}]\` ${song.title}`).join("\n")}`
                )
                .setThumbnail(playlist.thumbnail.url)
            return interaction.reply({ embeds : [MusicEmbed] });
        } else if (result.tracks.length == 1) {
            const song = result.tracks[0];

            try {
                await queue.addTrack(song);
                if (!queue.node.isPlaying()) queue.node.play();
            } catch (error) {
                console.log(error);
            }

            MusicEmbed
                .setColor(color)
                .setTitle(`**🎶 Music added to the queue**`)
                .setURL(`${song.url}`)
                .setDescription(
                    `**Author** : ${song.author}\n` +
                    `**Title** : ${song.title}\n` +
                    `**Duration** : ${song.duration}\n` +
                    `**Views** : ${song.views}\n` +
                    `**Request By** : <@${song.requestedBy.id}>\n`
                )
                .setThumbnail(song.thumbnail)
            return interaction.reply({ embeds : [MusicEmbed] });
        } else if (result.tracks.length > 1) {
            if (result.tracks.length > 10) {
                var resultLength = 10;
            } else {
                var resultLength = result.tracks.length;
            }

            const resultembed = result.tracks.slice(0, resultLength).map((song, i) => 
                `**${i + 1}.** \`[${song.duration}]\` ${song.title}`
            ).join(`\n`);
            
            const resultoption = result.tracks.slice(0, resultLength).map((song, i) => (
                {
                    label: `${i + 1}. ${song.title.substring(0, 95)}`,
                    description: `Duration : ${song.duration}  ||  Views ${song.views}`,
                    value: `${i}`
                }
            ));

            MusicEmbed
                .setColor(color)
                .setTitle(`**🎶 Select the music to play**`)
                .setDescription(`${resultembed}`);

            const SSMBplay1 = new StringSelectMenuBuilder()
                .setCustomId('MusicPlay')
                .setPlaceholder('Nothing selected')
                .addOptions(resultoption);

            const ARBplay1 = new ActionRowBuilder().addComponents(SSMBplay1);

            const message = await interaction.reply({ embeds : [MusicEmbed], components : [ARBplay1], ephemeral : true, fetchReply : true });

            const filter = (i) => i.customId === 'MusicPlay' && i.user.id === interaction.user.id;

            const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 15000 });
            
            collector.on('collect', async(i) => {
                await interaction.deleteReply();

                let value = i.values;
                let song = result.tracks[value];

                try {
                    await queue.addTrack(song);
                    if (!queue.node.isPlaying()) queue.node.play();
                } catch (error) {
                    console.log(error);
                }

                CollectorEmbed
                    .setColor(color)
                    .setTitle(`**🎶 Music added to the queue using the menu button**`)
                    .setURL(`${song.url}`)
                    .setDescription(
                        `**Author** : ${song.author}\n` +
                        `**Title** : ${song.title}\n` +
                        `**Duration** : ${song.duration}\n` +
                        `**Views** : ${song.views}\n` +
                        `**Request By** : <@${song.requestedBy.id}>`
                    )
                    .setThumbnail(song.thumbnail)
                i.reply({ embeds : [CollectorEmbed] });
            });

            collector.on('end', async (collected) => {
                if (!collected.size){
                    interaction.deleteReply();
                    CollectorEmbed
                        .setColor(color)
                        .setDescription(`**❌ | Timeout, Use the command \`/play\` again**`)
                    interaction.followUp({ embeds : [CollectorEmbed], ephemeral : true });
                }
            });            
        }
    },
};