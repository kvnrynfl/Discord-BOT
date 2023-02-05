const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType  } = require('discord.js');
const { QueryType } = require("discord-player");
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
        const focusedValue = interaction.options.getFocused();

        const result = await interaction.client.player.search(focusedValue, {
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

        const createQueue = await interaction.client.player.createQueue(interaction.guild,{
            metadata: interaction.channel
        });

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

        try {
			if (!createQueue.connection) {
				await createQueue.connect(interaction.member.voice.channel);
			}
		} catch {
			createQueue.destroy();
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | Unable to join your voice channel**`)
            return interaction.reply({ embeds : [MusicEmbed], ephemeral : true });
		}

        const result = await interaction.client.player.search(opPlayTrack, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        if (!result || !result.tracks.length) {
            MusicEmbed
                .setColor(color)
                .setDescription(`**❌ | No Songs/Videos/Playlists found when searching : ${opPlayTrack}**`)
            return interaction.reply({ embeds : [MusicEmbed], ephemeral : true });
        }

        if (result.playlist) {
            const song = result.tracks;
            const playlist = result.playlist;
            await createQueue.addTracks(song);

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
        } else if (result.tracks.length == 1) {
            const song = result.tracks[0];
            await createQueue.addTrack(song);

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

            if (!createQueue.playing) {
                await createQueue.play();
            }

            return interaction.reply({ embeds : [MusicEmbed] });
        } else if (result.tracks.length > 1) {
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

            const collector = await message.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 15000 });

            let CollectorEmbed = new EmbedBuilder();
            
            collector.on('collect', async i => {
                interaction.deleteReply();
                console.log(`Collector | MusicPlay: <@${i.user.id}> using \`/play\` command, and clicked the \`${i.customId}\` menu button with a value of \`${i.values}\``);

                let value = i.values;
                let song = result.tracks[value];

                await createQueue.addTrack(song);

                if (!createQueue.playing) {
                    await createQueue.play();
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
                await i.reply({ embeds : [CollectorEmbed] });
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