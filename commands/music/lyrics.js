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
        let NewEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        switch(subcmd){
            case "nowplaying":
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

                songTitle = getQueue.current.title;
                filterTitle = getQueue.current.title.indexOf("(");

                if (filterTitle !== -1 && filterTitle > 5) {
                    songTitle = songTitle.slice(0, filterTitle);
                }

                try {
                    lyrics = await lyricsFinder(songTitle, "");
                    if (!lyrics) lyrics = ":x: | No lyrics found.";
                } catch (error) {
                    console.log(`Lyrics : ${error}`);
                }

                NewEmbed
                    .setColor(color)
                    .setTitle(`Lyrics for ${songTitle}`)
                    .setDescription(lyrics)
                    .setThumbnail(`${getQueue.current.thumbnail}`)

                if (NewEmbed.toJSON().description.length >= 4096) {
                    NewEmbed.setDescription(`${NewEmbed.toJSON().description.substring(
                        0,
                        4095,
                    )}...`)
                }

                interaction.reply({ embeds : [NewEmbed] });
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

                NewEmbed
                    .setColor(color)
                    .setTitle(`Lyrics for ${songTitle} | ${songAuthor}`)
                    .setDescription(lyrics)

                if (NewEmbed.toJSON().description.length >= 4096) {
                    NewEmbed.setDescription(`${NewEmbed.toJSON().description.substring(
                        0,
                        4095,
                    )}...`)
                }

                interaction.reply({ embeds : [NewEmbed]});
                break;
        }
    },
};