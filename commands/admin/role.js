const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('🤖 | Add or remove a role from a user')
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('🤖 | Add a role to a user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('🤖 | The user to add a role to')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('role')
                .setDescription('🤖 | The role to add')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('🤖 | Remove a role from a user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('🤖 | The user to remove a role from')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('role')
                .setDescription('🤖 | The role to remove')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('check')
            .setDescription('🤖 | Check the roles of a user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('🤖 | The user to check the roles of')
                .setRequired(true)
            )
        )
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(['add', 'remove', 'check']);
        const opRoleUser = interaction.options.getUser('user');
        const opRoleName = interaction.options.getRole('role');
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();

        switch (subcmd) {
            case 'add':
                if (opRoleUser.roles.cache.find(role => role.name === opRoleName)) {
                    NewEmbed
                        .setColor(color)
                        .setTitle(`Error`)
                        .setDescription(`The user "${opRoleUser.username}" already has the role "${opRoleName}". No action was taken.`)
                    return interaction.reply({ embeds: [NewEmbed] });
                }

                await opRoleUser.roles.add(interaction.guild.roles.cache.find(role => role.name === opRoleName));

                NewEmbed
                    .setColor(color)
                    .setTitle('Success')
                    .setDescription(`The role ${opRoleName} has been added to the user ${opRoleUser.username}`)
                interaction.reply({ embeds: [NewEmbed] });
                break;

            case 'remove':
                if (!opRoleUser.roles.cache.find(role => role.name === opRoleName)) {
                    NewEmbed
                        .setColor(color)
                        .setTitle(`Error`)
                        .setDescription(`The user "${opRoleUser.username}" does not have the role "${opRoleName}". No action was taken.`)
                    return interaction.reply({ embeds: [NewEmbed] });
                }

                await opRoleUser.roles.remove(interaction.guild.roles.cache.find(role => role.name === opRoleName));

                NewEmbed
                    .setColor(color)
                    .setTitle(`Success`)
                    .setDescription(`The role "${opRoleName}" has been removed from the user "${opRoleUser.username}".`)
                interaction.reply({ embeds: [NewEmbed] });
                break;
            case 'check':
                let userRoles = opRoleUser.roles.cache.map(role => role.name).join(', ') || 'No roles';
                NewEmbed
                    .setColor(color)
                    .setTitle(`Roles for ${opRoleUser.username}`)
                    .setDescription(userRoles)
                interaction.reply({ embeds: [NewEmbed] });
                break;
        }
    },
};