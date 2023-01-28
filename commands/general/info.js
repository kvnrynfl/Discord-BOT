const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Dapatkan informasi dari pengguna yang dipilih, atau anda sendiri.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Info tentang bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info tentang server')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info tentang pengguna')
                .addUserOption(option => option.setName('target').setDescription('Tag pengguna yang ingin Anda tampilkan'))
        ),
	async execute(interaction) {
        const botuser = interaction.client.user;
        const guild = interaction.guild;
        const user = interaction.user;
        const guildMembers = await guild.members.fetch({ withPresences: true });
        const subcmd = interaction.options.getSubcommand(["bot", "server", "user"]);
		const target = interaction.options.getUser('target');

        // Mengubah warna pesan embed menjadi warna random yang cerah
        const r = Math.floor(Math.random() * 200) + 50;
        const g = Math.floor(Math.random() * 200) + 50;
        const b = Math.floor(Math.random() * 200) + 50;
        const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

        // Informasi mengenai uptime discord bot
        let totaluptime = (interaction.client.uptime / 1000);
		let updays = Math.floor(totaluptime / 86400);
		let uphours = Math.floor( (totaluptime %= 86400) / 3600);
		let upminutes = Math.floor( (totaluptime%= 3600) / 60);
		let upseconds = Math.floor(totaluptime % 60);

        try {
            switch (subcmd) {
                case "bot":
                    const infoBotEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setThumbnail(`${botuser.displayAvatarURL()}`)
                        .addFields(
                            { name: 'Bot Name', value: `${botuser.username }` },
                            { name: 'Version', value: `${config.client.botversion}` },
                            { name: 'Website', value: `[${config.client.botwebsite}](https://${config.client.botwebsite})` },
                            { name: 'Created At', value: `${moment(botuser.createdAt).format("DD/MM/YYYY")}` },
                            { name: 'Uptime', value: `${updays} days ${uphours} hours ${upminutes} minutes ${upseconds} seconds` },
                            { name: 'Developer', value: `Kvnrynfl_#3572\n[kevinreynaufal.my.id](https://kevinreynaufal.my.id)` },
                        )
                        .setTimestamp()
                        .setFooter({ text: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` });
                    interaction.reply({ embeds : [infoBotEmbed] });
                    break;
                case "server":
                    const owner = await guild.fetchOwner(); 
                    
                    let GuildMemberHumanSize = await guildMembers.filter(member => !member.user.bot).size;
                    let GuildMemberBotSize = await guildMembers.filter(member => member.user.bot).size;

                    let GuildMemberOnlineSize = await guildMembers.filter(member => member.presence?.status == 'online', 'idle', 'dnd').size;
                    let GuildMemberOfflineSize = await guildMembers.filter(member => member.presence?.status !== `online`, `idle`, `dnd`).size;

                    let GuildChannelSize = guild.channels.cache.size;
                    let GuildChannelTextSize = guild.channels.cache.filter(c => c.type === 0).size;
                    // let GuildChannelDMSize = guild.channels.cache.filter(c => c.type === 1).size;
                    let GuildChannelVoiceSize = guild.channels.cache.filter(c => c.type === 2).size;
                    // let GuildChannelGroupDMSize = guild.channels.cache.filter(c => c.type === 3).size;
                    let GuildChannelCategorySize = guild.channels.cache.filter(c => c.type === 4).size;
                    let GuildChannelAnnouncementSize = guild.channels.cache.filter(c => c.type === 5).size;
                    let GuildChannelAnnouncementThreadSize = guild.channels.cache.filter(c => c.type === 10).size;
                    let GuildChannelPublicThreadSize = guild.channels.cache.filter(c => c.type === 11).size;
                    let GuildChannelPrivateThreadSize = guild.channels.cache.filter(c => c.type === 12).size;
                    let GuildChannelVoiceStageSize = guild.channels.cache.filter(c => c.type === 13).size;
                    let GuildChannelDirectorySize = guild.channels.cache.filter(c => c.type === 14).size;
                    let GuildChannelForumSize = guild.channels.cache.filter(c => c.type === 15).size;

                    let GuildRolesSort = guild.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition);
                    let GuildRolesFilterMember = GuildRolesSort.filter(role => !role.tags.botId);
                    let GuildRolesFilterBot = GuildRolesSort.filter(role => role.tags.botId);
                    let GuildRolesMap = GuildRolesSort.map(role => `${role.name}`).slice(0, 30).join(', ');

                    const infoServerEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setThumbnail(`${guild.iconURL()}`)
                        .addFields(
                            { name: 'Server Name', value: `\`\`\`${guild.name}\`\`\``, inline: true },
                            { name: 'Server ID', value: `\`\`\`${guild.id}\`\`\``, inline: true },
                            { name: `Server Member`, value: `\`\`\`Total Member : ${guild.memberCount}\nHumans : ${GuildMemberHumanSize} | Bots : ${GuildMemberBotSize}\nOnline : ${GuildMemberOnlineSize} | Offline : ${GuildMemberOfflineSize}\`\`\`` },
                            { name: 'Owner Name', value: `\`\`\`${owner.user.tag}\`\`\``, inline: true },
                            { name: 'Owner ID', value: `\`\`\`${owner.user.id}\`\`\``, inline: true },
                            { name: 'Server Channels', value: `\`\`\`Total Channels : ${GuildChannelSize}\nCategory : ${GuildChannelCategorySize} | Text : ${GuildChannelTextSize} | Voice : ${GuildChannelVoiceSize}\`\`\`\`\`\`Announcement : ${GuildChannelAnnouncementSize} | Announcement Thread : ${GuildChannelAnnouncementThreadSize}\nPrivate Thread : ${GuildChannelPrivateThreadSize} | Public Thread : ${GuildChannelPublicThreadSize}\nVoice Stage : ${GuildChannelVoiceStageSize} | Directory : ${GuildChannelDirectorySize} | Forum : ${GuildChannelForumSize}\`\`\`` },
                            { name: 'Server Region', value: `\`\`\`${guild.preferredLocale}\`\`\``, inline: true },
                            { name: 'Server Verification', value: `\`\`\`Level : ${guild.verificationLevel}\`\`\``, inline: true },
                            // { name: 'Rules Channel', value: `<#${guild.rulesChannelId}>`, inline: true },
                            // { name: 'AFK Channel', value: `<#${guild.afkChannelId}>`, inline: true },
                            { name: `Server Roles (Shows up to 30 roles)`, value: `\`\`\`Total Roles : ${guild.roles.cache.size}\nRoles Human : ${GuildRolesFilterMember.size} | Roles Bot : ${GuildRolesFilterBot.size}\`\`\`\`\`\`${GuildRolesMap}\`\`\`` },
                            { name: 'Boost Level', value: `\`\`\`${guild.premiumTier}\`\`\``, inline: true },
                            { name: 'Boost Amount', value: `\`\`\`${guild.premiumSubscriptionCount}\`\`\``, inline: true },
                            { name: 'Created At', value: `\`\`\`${moment(guild.createdAt).format("DD MMMM YYYY - LT")}\`\`\`` },
                        )
                    interaction.reply({ embeds : [infoServerEmbed] });
                    console.log(guild.roles.cache);
                    break;
                case "user":
                    const UserTarget = (target ?? interaction.user);
                    
                    const GuildUserCache = guildMembers.get(`${UserTarget.id}`);
                    const GuildUserPresenceStatus = (GuildUserCache.presence?.status ?? 'offline').charAt(0).toUpperCase() + (GuildUserCache.presence?.status ?? 'offline').slice(1);

                    const nickname = (guild.members.cache.get(`${UserTarget.id}`).nickname) ? `${guild.members.cache.get(`${UserTarget.id}`).nickname}` : `${UserTarget.username}`;
                    const humanorbot = (UserTarget.bot ? "BOT" : "Human");
                    const UserTargetEmbed = new EmbedBuilder()
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
                            { name: 'Roles', value: `${guild.members.cache.get(`${UserTarget.id}`).roles.cache.map(role => `<@&${role.id}>`).join(', ')}` },
                            { name: 'Joined At', value: `\`\`\`${moment(UserTarget.joinedAt).format("DD MMMM YYYY - LT")}\`\`\`` },
                            { name: 'Created At', value: `\`\`\`${moment(UserTarget.createdAt).format("DD MMMM YYYY - LT")}\`\`\`` },
                        )
                        .setTimestamp()
                        .setFooter({ text: `${user.tag}`, iconURL: `${user.displayAvatarURL({ format: "png", size: 1024 })}` });
                    interaction.reply({ embeds : [UserTargetEmbed] });
                    break;

            }
        } catch (err) {
            console.log(err);
        }
	},
};