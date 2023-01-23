const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QueryType } = require("discord-player");
const randomColor = require('randomcolor');
const ascii = require("ascii-table");
const table = new ascii();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('🎵 | Started playing music')
        .addSubcommand((subcommand) => subcommand
            .setName('auto')
            .setDescription('🎵 | Started playing music with automatic music search')
            .addStringOption((option) => option
                .setName('track')
                .setDescription('Enter the Name/URL/PlayList you want to play')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('specific')
            .setDescription('🎵 | Start playing music with the specified music search engine and music search selected')
            .addStringOption((option) => option
                .setName('engine')
                .setDescription('Select')
                .addChoices(
                    { name: 'Automatic', value: 'AUTO' },
                    { name: 'YouTube', value: 'YOUTUBE' },
                    { name: 'YouTube Video', value: 'YOUTUBE_VIDEO' },
                    { name: 'YouTube Search', value: 'YOUTUBE_SEARCH' },
                    { name: 'YouTube PlayList', value: 'YOUTUBE_PLAYLIST' },
                    { name: 'SounCloud', value: 'SOUNDCLOUD' },
                    { name: 'SounCloud Track', value: 'SOUNDCLOUD_TRACK' },
                    { name: 'SounCloud Search', value: 'SOUNDCLOUD_SEARCH' },
                    { name: 'SounCloud PlayList', value: 'SOUNDCLOUD_PLAYLIST' },
                    { name: 'Spotify Song', value: 'SPOTIFY_SONG' },
                    { name: 'Spotify Album', value: 'SPOTIFY_ALBUM' },
                    { name: 'Spotify Playlist', value: 'SPOTIFY_PLAYLIST' },
                    { name: 'FaceBook', value: 'FACEBOOK' },
                    { name: 'Vimeo', value: 'VIMEO' },
                    { name: 'Arbitrary', value: 'ARBITRARY' },
                    { name: 'Reverbnation', value: 'REVERBNATION' },
                )
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('track')
                .setDescription('Enter the Name/URL/PlayList you want to play')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["auto", "find", "specific"]);
        const opPlayTrack = interaction.options.getString('track');
        const opPlayEngine = interaction.options.getString('engine');
        let color = randomColor();
        let MusicEmbed = new EmbedBuilder();
        let result;

        const createQueue = await interaction.client.player.createQueue(interaction.guild,{
            metadata: interaction.channel
        });

        if (!interaction.member.voice.channel) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.reply({ embeds : [MusicEmbed], ephemeral: true});
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.reply({ embeds : [MusicEmbed], ephemeral: true});
		}

        try {
			if (!createQueue.connection) {
				await createQueue.connect(interaction.member.voice.channel);
			}
		} catch {
			createQueue.destroy();
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | Unable to join your voice channel**`)
            return interaction.reply({ embeds : [MusicEmbed], ephemeral: true});
		}

        switch (subcmd) {
            case "auto":
                result = await interaction.client.player.search(opPlayTrack, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                });

                if (!result || !result.tracks.length) {
                    MusicEmbed
                        .setColor(color)
                        .setDescription(`**❌ | No Songs/Videos/Playlists found when searching : ${opPlayTrack}**`)
                    return interaction.reply({ embeds : [MusicEmbed], ephemeral: true});
                }
        
                if (result.playlist) {
                    const song = result.tracks;
                    const playlist = result.playlist;
                    createQueue.addTracks(song);
        
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
                } else {
                    const song = result.tracks[0];
                    createQueue.addTrack(song);
        
                    MusicEmbed
                        .setColor(color)
                        .setTitle(`**🎶 Music added to the queue**`)
                        .setURL(`${song.url}`)
                        .setDescription(
                            `**Author** : ${song.author}\n` +
                            `**Title** : ${song.title}\n` +
                            `**Duration** : ${song.duration}\n` +
                            `**Views** : ${song.views}\n` +
                            `**Request By** : <@${song.requestedBy.id}>`
                        )
                        .setThumbnail(song.thumbnail)    
                }
        
                if (!createQueue.playing) {
                    await createQueue.play();
                }
        
                return interaction.reply({ embeds : [MusicEmbed] });
            case "specific":
                switch (opPlayEngine) {
                    case 'AUTO':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy : interaction.user,
                            searchEngine : QueryType.AUTO
                        });
                        break;
                    case 'YOUTUBE':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.YOUTUBE
                        });
                        break;
                    case 'YOUTUBE_VIDEO':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.YOUTUBE_VIDEO
                        });
                        break;
                    case 'YOUTUBE_SEARCH':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.YOUTUBE_SEARCH
                        });
                        break;
                    case 'YOUTUBE_PLAYLIST':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.YOUTUBE_PLAYLIST
                        });
                        break;
                    case 'SOUNDCLOUD':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.SOUNDCLOUD
                        });
                        break;
                    case 'SOUNDCLOUD_TRACK':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.SOUNDCLOUD_TRACK
                        });
                        break;
                    case 'SOUNDCLOUD_SEARCH':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.SOUNDCLOUD_SEARCH
                        });
                        break;
                    case 'SOUNDCLOUD_PLAYLIST':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.SOUNDCLOUD_PLAYLIST
                        });
                        break;
                    case 'SPOTIFY_SONG':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.SPOTIFY_SONG
                        });
                        break;
                    case 'SPOTIFY_ALBUM':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.SPOTIFY_ALBUM
                        });
                        break;
                    case 'SPOTIFY_PLAYLIST':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.SPOTIFY_PLAYLIST
                        });
                        break;
                    case 'FACEBOOK':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.FACEBOOK
                        });
                        break;
                    case 'VIMEO':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.VIMEO
                        });
                        break;
                    case 'ARBITRARY':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.ARBITRARY
                        });
                        break;
                    case 'REVERBNATION':
                        result = await interaction.client.player.search(opPlayTrack, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.REVERBNATION
                        });
                        break;
                }

                if (!result || !result.tracks.length) {
                    MusicEmbed
                        .setColor(color)
                        .setDescription(`**❌ | No Songs/Videos/Playlists found when searching : ${opPlayTrack}**`)
                    return interaction.reply({ embeds : [MusicEmbed], ephemeral: true });
                }

                if (result.tracks.length > 10) {
                    var resultlength = 10;
                } else {
                    var resultlength = result.tracks.length;
                }
                
                const resultembed = result.tracks.slice(0, resultlength).map((song, i) => 
                    `**${i + 1}.** \`[${song.duration}]\` ${song.title}`
                ).join(`\n`);
                
                const resultoption = result.tracks.slice(0, resultlength).map((song, i) => (
                    {
                        label: `${i + 1}. ${song.title}`,
                        description: `Duration : ${song.duration}`,
                        value: `${i}`,
                    }
                ));

                MusicEmbed
                    .setColor(color)
                    .setTitle(`**🎶 Select the music to play**`)
                    .setDescription(`${resultembed}`);

                const SSMBplay1 = new StringSelectMenuBuilder()
                    .setCustomId('SelectMenu1')
                    .setPlaceholder('Nothing selected')
                    .addOptions(resultoption);

                const ARBplay1 = new ActionRowBuilder().addComponents(SSMBplay1);

                return interaction.reply({ embeds : [MusicEmbed], components : [ARBplay1], ephemeral: true });
        }
    },
};