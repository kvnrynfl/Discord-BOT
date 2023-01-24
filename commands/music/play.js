const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QueryType } = require("discord-player");
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('🎵 | Started playing music')
        .addStringOption((option) => option
            .setName('track')
            .setDescription('Enter the Name/URL/PlayList you want to play')
            .setRequired(true)
        ),
    async execute(interaction) {
        const opPlayTrack = interaction.options.getString('track');
        let color = randomColor();
        let MusicEmbed = new EmbedBuilder();

        const createQueue = await interaction.client.player.createQueue(interaction.guild,{
            metadata: interaction.channel,
            spotifyBridge: true,
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

        const result = await interaction.client.player.search(opPlayTrack, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
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

            if (!createQueue.playing) {
                await createQueue.play();
            }

            return interaction.reply({ embeds : [MusicEmbed] });
        } else {
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