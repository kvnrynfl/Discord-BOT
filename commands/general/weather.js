const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');
const weather = require('weather-js');
const moment = require('moment-timezone');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('🌦️ | Get the weather information for a specific city')
        .addStringOption(option => option
            .setName('city')
            .setDescription('🌃 | The name of the city to get the weather information for')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
	async execute(interaction) {
        const opWeatherCity = interaction.options.getString('city');
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();
        
        weather.find({search: opWeatherCity, degreeType: 'C'}, function(err, result) {
            if(err) {
                console.log(err);
                NewEmbed
                    .setColor(color)
                    .setDescription(`An error occurred while searching for the weather information`)
                return interaction.reply({ embeds: [NewEmbed], ephemeral: true });
            }

            if(result.length === 0) {
                NewEmbed
                    .setColor(color)
                    .setDescription(`No weather information found for city: ${opWeatherCity}`)
                return interaction.reply({ embeds: [NewEmbed], ephemeral: true });
            }
            
            const locationWeather = result[0].location;
            const currentWeather = result[0].current;


            const formattedTimezone = `Etc/GMT${locationWeather.timezone > 0 ? `-${locationWeather.timezone}` : `+${Math.abs(locationWeather.timezone)}`}`;
            const localTime = moment.tz(`${currentWeather.date} ${currentWeather.observationtime}`, formattedTimezone);

            NewEmbed
                .setColor(color)
                .addFields(
                    { name: `Temperature`, value: `\`\`\`${currentWeather.temperature}°C\`\`\``, inline: true },
                    { name: `Humidity`, value: `\`\`\`${currentWeather.humidity}%\`\`\``, inline: true },
                    { name: `Feels Like`, value: `\`\`\`${currentWeather.feelslike}°C\`\`\``, inline: true },
                    { name: `Sky Condition`, value: `\`\`\`${currentWeather.skytext}\`\`\``, inline: true },
                    { name: `Wind Speed`, value: `\`\`\`${currentWeather.winddisplay}\`\`\``, inline: true },
                    { name: `Observation Point`, value: `\`\`\`${currentWeather.observationpoint}\`\`\`` },
                    { name: `Observation Time`, value: `\`\`\`${localTime.format('HH:mm:ss A')}\`\`\``, inline: true },
                    { name: `Timezone`, value: `\`\`\`${localTime.format('UTCZ')}\`\`\``, inline: true },
                    { name: `Observation Date`, value: `\`\`\`${localTime.format('dddd, DD MMMM YYYY')}\`\`\`` },
                )
                .setThumbnail(currentWeather.imageUrl)
                    
            interaction.reply({ embeds: [NewEmbed] });
        });
	},
};
