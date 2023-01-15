const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');
const lyricsFinder = require("lyrics-finder");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lyrics')
		.setDescription('🎵 | Display music lyrics')
        .addSubcommand((subcommand) => subcommand
            .setName('nowplaying')
            .setDescription('Display lyrics of the music being played')
        )
        .addSubcommand((subcommand) => subcommand
            .setName('find')
            .setDescription('Display more specific music lyrics')
            .addStringOption((option) => option
                .setName('title')
                .setDescription('Enter the title of the music for which you want the lyrics to appear.')
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('author')
                .setDescription('Enter the author of the music for which you want the lyrics to appear.')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["nowplaying", "find"]);
        var color = randomColor();
        let LyricsEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        switch(subcmd){
            case "nowplaying":
                songTitle = getQueue.current.title;
                filterTitle = getQueue.current.title.indexOf("(");

                if (filterTitle !== -1) {
                    songTitle = songTitle.slice(0, filterTitle);
                }

                try {
                    lyrics = await lyricsFinder(songTitle, "");
                    if (!lyrics) lyrics = ":x: | No lyrics found.";
                } catch (error) {
                    console.log(`Lyrics : ${error}`);
                }

                LyricsEmbed
                    .setColor(color)
                    .setTitle(`Lyrics for ${songTitle}`)
                    .setDescription(lyrics)
                    .setThumbnail(`${getQueue.current.thumbnail}`)

                if (LyricsEmbed.toJSON().description.length >= 4096) {
                    LyricsEmbed.setDescription(`${LyricsEmbed.toJSON().description.substring(
                        0,
                        4095,
                    )}...`)
                }

                interaction.editReply({ embeds : [LyricsEmbed] });
                break;

            case "find":
                songTitle = interaction.options.getString('title');
                songAuthor = interaction.options.getString('author');

                try {
                    lyrics = await lyricsFinder(songTitle, songAuthor);
                    if (!lyrics) lyrics = ":x: | No lyrics found.";
                } catch (error) {
                    console.log(`Lyrics : ${error}`);
                }

                LyricsEmbed
                    .setColor(color)
                    .setTitle(`Lyrics for ${songTitle} | ${songAuthor}`)
                    .setDescription(lyrics)

                if (LyricsEmbed.toJSON().description.length >= 4096) {
                    LyricsEmbed.setDescription(`${LyricsEmbed.toJSON().description.substring(
                        0,
                        4095,
                    )}...`)
                }

                interaction.editReply({ embeds : [LyricsEmbed]});
                break;
        }
    },
};