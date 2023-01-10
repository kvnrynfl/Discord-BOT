const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player");
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('🎵 | Started playing music')
        .addStringOption((option) => option
            .setName('track')
            .setDescription('Enter the name/url/playlist you want to play.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const opPlayTrack = interaction.options.getString('track');
        var color = randomColor();
        let MusicEmbed = new EmbedBuilder();
        
        if (!interaction.member.voice.channel) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.editReply({ embeds : [MusicEmbed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.editReply({ embeds : [MusicEmbed] });
		}

        const createQueue = await interaction.client.player.createQueue(interaction.guild,{
            metadata: interaction.channel
        });

        try {
			if (!createQueue.connection) {
				await createQueue.connect(interaction.member.voice.channel);
			}
		} catch {
			createQueue.destroy();
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | Unable to join your voice channel**`)
            return interaction.editReply({ embeds : [MusicEmbed] });
		}

        const result = await interaction.client.player.search(opPlayTrack, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        if (!result || !result.tracks.length) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | No Songs/Videos/Playlists found when searching : ${track}**`)
            return interaction.editReply({ embeds : [MusicEmbed] });
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
                    `**Description** : ${playlist.description}`
                    // `${song.slice(0, 10).map((song, i) => `**${i+1}.** \`[${song.duration}]\` ${song.title}`).join("\n")}`
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

        await interaction.editReply({ embeds : [MusicEmbed] });
    },
};