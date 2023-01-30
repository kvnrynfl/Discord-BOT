const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const randomColor = require('randomcolor');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('🤖 | Dapatkan informasi dari pengguna yang dipilih, atau anda sendiri.')
        .addSubcommand(subcommand => subcommand
            .setName('bot')
            .setDescription('🤖 | Info tentang bot')
        )
        .addSubcommand(subcommand => subcommand
            .setName('server')
            .setDescription('🤖 | Info tentang server')
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('🤖 | Info tentang pengguna')
            .addUserOption(option => option
                .setName('target')
                .setDescription('🤖 | Tag pengguna yang ingin Anda tampilkan')
            )
        ),
	async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["bot", "server", "user"]);
		const target = interaction.options.getUser('target');
        let color = randomColor();
        let NewEmbed = new EmbedBuilder();

        const guildMembers = await interaction.guild.members.fetch({ withPresences: true });

        switch (subcmd) {
            case "bot":
                // Informasi mengenai uptime discord bot
                let totaluptime = (interaction.client.uptime / 1000);
                let updays = Math.floor(totaluptime / 86400);
                let uphours = Math.floor( (totaluptime %= 86400) / 3600);
                let upminutes = Math.floor( (totaluptime%= 3600) / 60);
                let upseconds = Math.floor(totaluptime % 60);

                NewEmbed
                    .setColor(color)
                    .setThumbnail(`${interaction.client.user.displayAvatarURL({ format: "png", size: 1024 })}`)
                    .addFields(
                        { name: 'Bot Name', value: `\`\`\`${interaction.client.user.username }\`\`\``, inline: true },
                        { name: 'Version', value: `\`\`\`${config.client.botversion}\`\`\``, inline: true },
                        { name: `[Website](https://${config.client.botwebsite})`, value: `\`\`\`https://${config.client.botwebsite}\`\`\`` },
                        { name: 'Created At', value: `\`\`\`${moment(interaction.client.user.createdAt).format("DD/MM/YYYY - LT")}\`\`\`` },
                        { name: 'Uptime', value: `\`\`\`${updays} days ${uphours} hours ${upminutes} minutes ${upseconds} seconds\`\`\`` },
                        { name: `[Developer](https://kevinreynaufal.my.id)`, value: `\`\`\`Kvnrynfl_#3572\nhttps://kevinreynaufal.my.id\`\`\`` },
                    )
                interaction.reply({ embeds : [NewEmbed] });
                break;
            case "server":
                const owner = await interaction.guild.fetchOwner(); 
                
                let GuildMemberHumanSize = await guildMembers.filter(member => !member.user.bot).size;
                let GuildMemberBotSize = await guildMembers.filter(member => member.user.bot).size;

                let GuildMemberOnlineSize = await guildMembers.filter(member => member.presence?.status == 'online', 'idle', 'dnd').size;
                let GuildMemberOfflineSize = await guildMembers.filter(member => member.presence?.status !== `online`, `idle`, `dnd`).size;

                let GuildChannelSize = interaction.guild.channels.cache.size;
                let GuildChannelTextSize = interaction.guild.channels.cache.filter(c => c.type === 0).size;
                // let GuildChannelDMSize = interaction.guild.channels.cache.filter(c => c.type === 1).size;
                let GuildChannelVoiceSize = interaction.guild.channels.cache.filter(c => c.type === 2).size;
                // let GuildChannelGroupDMSize = interaction.guild.channels.cache.filter(c => c.type === 3).size;
                let GuildChannelCategorySize = interaction.guild.channels.cache.filter(c => c.type === 4).size;
                let GuildChannelAnnouncementSize = interaction.guild.channels.cache.filter(c => c.type === 5).size;
                let GuildChannelAnnouncementThreadSize = interaction.guild.channels.cache.filter(c => c.type === 10).size;
                let GuildChannelPublicThreadSize = interaction.guild.channels.cache.filter(c => c.type === 11).size;
                let GuildChannelPrivateThreadSize = interaction.guild.channels.cache.filter(c => c.type === 12).size;
                let GuildChannelVoiceStageSize = interaction.guild.channels.cache.filter(c => c.type === 13).size;
                let GuildChannelDirectorySize = interaction.guild.channels.cache.filter(c => c.type === 14).size;
                let GuildChannelForumSize = interaction.guild.channels.cache.filter(c => c.type === 15).size;

                let GuildRolesSort = interaction.guild.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition);
                let GuildRolesFilterMember = GuildRolesSort.filter(role => !role.tags.botId);
                let GuildRolesFilterBot = GuildRolesSort.filter(role => role.tags.botId);
                let GuildRolesMap = GuildRolesSort.map(role => `${role.name}`).slice(0, 30).join(', ');

                NewEmbed
                    .setColor(color)
                    .setThumbnail(`${interaction.guild.iconURL({ format: "png", size: 1024 })}`)
                    .addFields(
                        { name: 'Server Name', value: `\`\`\`${interaction.guild.name}\`\`\``, inline: true },
                        { name: 'Server ID', value: `\`\`\`${interaction.guild.id}\`\`\``, inline: true },
                        { name: `Server Member`, value: `\`\`\`Total Member : ${interaction.guild.memberCount}\nHumans : ${GuildMemberHumanSize} | Bots : ${GuildMemberBotSize}\nOnline : ${GuildMemberOnlineSize} | Offline : ${GuildMemberOfflineSize}\`\`\`` },
                        { name: 'Owner Name', value: `\`\`\`${owner.user.tag}\`\`\``, inline: true },
                        { name: 'Owner ID', value: `\`\`\`${owner.user.id}\`\`\``, inline: true },
                        { name: 'Server Channels', value: `\`\`\`Total Channels : ${GuildChannelSize}\nCategory : ${GuildChannelCategorySize} | Text : ${GuildChannelTextSize} | Voice : ${GuildChannelVoiceSize}\`\`\`\`\`\`Announcement : ${GuildChannelAnnouncementSize} | Announcement Thread : ${GuildChannelAnnouncementThreadSize}\nPrivate Thread : ${GuildChannelPrivateThreadSize} | Public Thread : ${GuildChannelPublicThreadSize}\nVoice Stage : ${GuildChannelVoiceStageSize} | Directory : ${GuildChannelDirectorySize} | Forum : ${GuildChannelForumSize}\`\`\`` },
                        { name: 'Server Region', value: `\`\`\`${interaction.guild.preferredLocale}\`\`\``, inline: true },
                        { name: 'Server Verification', value: `\`\`\`Level : ${interaction.guild.verificationLevel}\`\`\``, inline: true },
                        { name: `Server Roles (Shows up to 30 roles)`, value: `\`\`\`Total Roles : ${interaction.guild.roles.cache.size}\nRoles Human : ${GuildRolesFilterMember.size} | Roles Bot : ${GuildRolesFilterBot.size}\`\`\`\`\`\`${GuildRolesMap}\`\`\`` },
                        { name: 'Boost Level', value: `\`\`\`${interaction.guild.premiumTier}\`\`\``, inline: true },
                        { name: 'Boost Amount', value: `\`\`\`${interaction.guild.premiumSubscriptionCount}\`\`\``, inline: true },
                        { name: 'Created At', value: `\`\`\`${moment(interaction.guild.createdAt).format("DD MMMM YYYY - LT")}\`\`\`` },
                    )
                interaction.reply({ embeds : [NewEmbed] });
                break;
            case "user":
                const UserTarget = (target ?? interaction.user);
                
                const GuildUserCache = guildMembers.get(`${UserTarget.id}`);
                const GuildUserPresenceStatus = (GuildUserCache.presence?.status ?? 'offline').charAt(0).toUpperCase() + (GuildUserCache.presence?.status ?? 'offline').slice(1);

                const nickname = (interaction.guild.members.cache.get(`${UserTarget.id}`).nickname) ? `${interaction.guild.members.cache.get(`${UserTarget.id}`).nickname}` : `${UserTarget.username}`;
                const humanorbot = (UserTarget.bot ? "BOT" : "Human");
                
                NewEmbed
                    .setColor(color)
                    .setThumbnail(`${UserTarget.displayAvatarURL({ format: "png", size: 1024 })}`)
                    .addFields(
                        { name: 'Mention', value: `<@${UserTarget.id}>` },
                        { name: 'Name', value: `${UserTarget.username}`, inline: true },
                        { name: 'Discriminator', value: `#${UserTarget.discriminator}`, inline: true },
                        { name: 'Nickname', value: `${nickname}` },
                        { name: 'User ID', value: `${UserTarget.id}` },
                        { name: 'Status', value: `${humanorbot}, ${GuildUserPresenceStatus}` },
                        { name: 'Boost', value: `${UserTarget.premium_type}` },
                        { name: 'Roles', value: `${interaction.guild.members.cache.get(`${UserTarget.id}`).roles.cache.map(role => `<@&${role.id}>`).join(', ')}` },
                        { name: 'Joined At', value: `\`\`\`${moment(UserTarget.joinedAt).format("DD MMMM YYYY - LT")}\`\`\`` },
                        { name: 'Created At', value: `\`\`\`${moment(UserTarget.createdAt).format("DD MMMM YYYY - LT")}\`\`\`` },
                    )
                interaction.reply({ embeds : [NewEmbed] });
                break;
        }
	},
};