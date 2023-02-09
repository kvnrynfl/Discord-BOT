const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('Ban')
        .setDescription('🤖 | Ban a user from this server')
        .addSubcommand(subcommand => subcommand
            .setName('Temporary')
            .setDescription('🤖 | Ban a user temporarily from the server')
            .addUserOption(option => option
                .setName('User')
                .setDescription('🤖 | The user to ban')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('Duration')
                .setDescription('🤖 | The duration of the ban in days')
                .setMinValue(1)
                .setRequired(true)
            )
            .addReasonOption(option => option
                .setName('Reason')
                .setDescription('The reason for the ban')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('Permanent')
            .setDescription('🤖 | Ban a user permanently from the server')
            .addUserOption(option => option
                .setName('User')
                .setDescription('🤖 | The user to ban')
                .setRequired(true)
            )
            .addReasonOption(option => option
                .setName('Reason')
                .setDescription('🤖 | The reason for the ban')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('Check')
            .setDescription('🤖 | Check the ban status of a user')
            .addIntegerOption(option => option
                .setName('UserID')
                .setDescription('🤖 | The ID of the user to check')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('List')
            .setDescription('🤖 | List all banned users in the server')
        )
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(['temporary', 'permanent', 'check', 'list']);
		const opBanTarget = interaction.options.getUser('target');
		const opBanReason = interaction.options.getString('reason');
        const opBanUserId = interaction.options.getInteger('userId');
        const opBanDuration = interaction. options.getInteger('duration');
		var color = randomColor();
        let NewEmbed = new EmbedBuilder();

        switch (subcmd) {
            case 'temporary':
                try {
                    await opBanTarget.ban({
                        days: opBanDuration,
                        reason: opBanReason,
                    });
        
                    NewEmbed
                        .setColor(color)
                        .setDescription(`✅ Successfully banned ${opBanTarget.tag} from this server for ${opBanDuration} days. Reason: ${opBanReason}`);
                    interaction.reply({ embeds : [NewEmbed] });
                } catch (error) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`❌ Unable to ban the user, Error: ${error}`);
                    interaction.reply({ embeds : [NewEmbed], ephemeral: true });
                }
                break;
            case 'permanent':
                try {
                    await opBanTarget.ban({
                        reason: opBanReason,
                    });
        
                    NewEmbed
                        .setColor(color)
                        .setDescription(`✅ Successfully banned ${opBanTarget.tag} from this server permanently. Reason: ${opBanReason}`);
                    interaction.reply({ embeds : [NewEmbed] });
                } catch (error) {
                    NewEmbed
                        .setColor(color)
                        .setDescription(`❌ Unable to ban the user, Error: ${error}`);
                    interaction.reply({ embeds : [NewEmbed], ephemeral: true });
                }
                break;
            case 'check':
                // Logic untuk melakukan pengecekan ban status user
                if (!opBanUserId) {
                    return interaction.reply("🤖 | Mohon masukkan ID User yang ingin di-check.");
                }

                // Cari user dengan ID yang sesuai
                let bannedUser = interaction.guild.members.cache.get(opBanUserId);
                if (!bannedUser) {
                    return interaction.reply("🤖 | User tidak ditemukan.");
                }

                // Cek apakah user tersebut banned atau tidak
                if (bannedUser.bannable) {
                    interaction.reply("🤖 | User belum ter-ban.");
                } else {
                    interaction.reply("🤖 | User sudah ter-ban.");
                }
                break;
            case 'list':
                // Logic untuk melakukan list ban status user
                let bannedUsers = interaction.guild.fetchBans();
                let bannedUsersArray = bannedUsers.array();
                let bannedUsersList = '';

                if (bannedUsersArray.length == 0) {
                    interaction.reply("🤖 | Tidak ada user yang ter-ban.");
                    return;
                }

                bannedUsersArray.forEach((ban) => {
                    bannedUsersList += `- ${ban.username} (${ban.id})\n`;
                });

                NewEmbed
                .setTitle("🤖 | Daftar User Ter-ban")
                .setColor(color)
                .setDescription(bannedUsersList);

                interaction.reply(NewEmbed);
                break;
        }

        
	},
};