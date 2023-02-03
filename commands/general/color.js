const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription('🤖 | Display color and display hex color code')
        .addSubcommand(subcommand => subcommand 
			.setName('find')
			.setDescription('🤖 | Displays the specified color and displays the hex color code')
			.addStringOption(option => option 
				.setName('color')
				.setDescription('🤖 | Masukan warna')
				.setRequired(true)
                .addChoices(
                    { name: 'monochrome', value: 'monochrome' },
                    { name: 'red', value: 'red' },
                    { name: 'orange', value: 'orange' },
                    { name: 'yellow', value: 'yellow' },
                    { name: 'green', value: 'green' },
                    { name: 'blue', value: 'blue' },
                    { name: 'purple', value: 'purple' },
                    { name: 'pink', value: 'pink' },
                )
			)
            .addStringOption(option => option 
				.setName('luminosity')
				.setDescription('🤖 | Masukan kecerahan')
                .addChoices(
                    { name: 'random', value: 'random' },
                    { name: 'bright', value: 'bright' },
                    { name: 'light', value: 'light' },
                    { name: 'dark', value: 'dark' },
                )
				.setRequired(true)
			)
		)
        .addSubcommand(subcommand => subcommand 
			.setName('random')
			.setDescription('🤖 | Displays a random color and displays a hex color code')
		)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
	async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["find", "random"]);
        const optColorFindColor = interaction.options.getString('color');
        const optColorFindLuminosity = interaction.options.getString('luminosity');
        let NewEmbed = new EmbedBuilder()
        
        switch (subcmd) {
            case 'find':
                var color = randomColor({
                    hue: `${optColorFindColor}}`,
                    luminosity: `${optColorFindLuminosity}`,
                    format: 'hex',
                });
                NewEmbed
                    .setColor(color)
                    .setDescription(`Random Color, Code **${color}**`)
                break;
            case 'random':
                var color = randomColor();
                NewEmbed
                    .setColor(color)
                    .setDescription(`Random Color, Code **${color}**`)
                break;
        }
        interaction.reply({ embeds : [NewEmbed] })
	},
};