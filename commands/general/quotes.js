const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quotes')
        .setDescription('🤖 | Quote command')
        .addSubcommand(subcommand => subcommand
            .setName('find')
            .setDescription('🤖 | Find a quote by category')
            .addStringOption(option => option
                .setName('category')
                .setDescription('🤖 | The category of the quote')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('help')
            .setDescription('🤖 | Get help with using the quotes command')
        )
        .addSubcommand(subcommand => subcommand
            .setName('random')
            .setDescription('🤖 | Get a random quote')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        const choices = [
            'age',
            'alone',
            'amazing',
            'anger',
            'architecture',
            'art',
            'attitude',
            'beauty',
            'best',
            'birthday',
            'business',
            'car',
            'change',
            'communications',
            'computers',
            'cool',
            'courage',
            'dad',
            'dating',
            'death',
            'design',
            'dreams',
            'education',
            'environmental',
            'equality',
            'experience',
            'failure',
            'faith',
            'family',
            'famous',
            'fear',
            'fitness',
            'food',
            'forgiveness',
            'freedom',
            'friendship',
            'funny',
            'future',
            'god',
            'good',
            'government',
            'graduation',
            'great',
            'happiness',
            'health',
            'history',
            'home',
            'hope',
            'humor',
            'imagination',
            'inspirational',
            'intelligence',
            'jealousy',
            'knowledge',
            'leadership',
            'learning',
            'legal',
            'life',
            'love',
            'marriage',
            'medical',
            'men',
            'mom',
            'money',
            'morning',
            'movies',
            'success',
        ];
        const filtered = choices.filter(choice =>
            choice.toLocaleLowerCase().startsWith(focusedValue.toLocaleLowerCase())
        );
        await interaction.respond(
            filtered.slice(0, 24).map(choice => (
                { name: choice.charAt(0).toUpperCase() + choice.slice(1), value: choice }
            )),
        );
    },
    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand([ "find", "help", "random" ]);
        const optFindCategory = interaction.options.getString('category');
        let NewEmbed = new EmbedBuilder()
        var color = randomColor();

        if (subcmd == 'find' || subcmd == 'random') {
            let options = {
                method: 'GET',
                url: 'https://api.api-ninjas.com/v1/quotes',
                headers: {
                    'X-Api-Key': process.env.API_NINJAS,
                },
                params: {
                    category: optFindCategory ?? ''
                },
            }

            try {
                const apiResponse = await axios.request(options);

                NewEmbed
                    .setColor(color)
                    .setDescription(
                        `Quote : ${apiResponse.data[0].quote}\n` +
                        `Author : ${apiResponse.data[0].author}\n` +
                        `Category : ${apiResponse.data[0].category}`
                    )
                    console.log(apiResponse.data[0]);
            } catch (error) {
                console.log(error);
            }
        } else if (subcmd == 'help') {
            NewEmbed
                .setColor(color)
                .addFields(
                    { name: 'Example Usage', value: '\`/quotes find [category : *inputcategory*]\n/quotes random\`' },
                    { name: 'List Category Quotes', value: '\`age\`, \`alone\`, \`amazing\`, \`anger\`, \`architecture\`, \`art\`, \`attitude\`, \`beauty\`, \`best\`, \`birthday\`, \`business\`, \`car\`, \`change\`, \`communications\`, \`computers\`, \`cool\`, \`courage\`, \`dad\`, \`dating\`, \`death\`, \`design\`, \`dreams\`, \`education\`, \`environmental\`, \`equality\`, \`experience\`, \`failure\`, \`faith\`, \`family\`, \`famous\`, \`fear\`, \`fitness\`, \`food\`, \`forgiveness\`, \`freedom\`, \`friendship\`, \`funny\`, \`future\`, \`god\`, \`good\`, \`government\`, \`graduation\`, \`great\`, \`happiness\`, \`health\`, \`history\`, \`home\`, \`hope\`, \`humor\`, \`imagination\`, \`inspirational\`, \`intelligence\`, \`jealousy\`, \`knowledge\`, \`leadership\`, \`learning\`, \`legal\`, \`life\`, \`love\`, \`marriage\`, \`medical\`, \`men\`, \`mom\`, \`money\`, \`morning\`, \`movies\`, \`success\`' },
                )
        }
        return interaction.reply({ embeds: [ NewEmbed ] });
    },
};