const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
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
            .setName('commands')
            .setDescription('🤖 | Informasi commands yang tersedia pada bot')
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
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
	async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["bot", "commands", "server", "user"]);
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
            case "commands":
                function infoCommands(dirname) {
                    let commands = interaction.guild.commands.client.commands.filter(dir => dir.folder === dirname && dir.folder !== 'owner');
                    let dataArray = [];
                
                    commands.forEach((cmd) => {
                        if (cmd.data.options && cmd.data.options.length){
                            cmd.data.options.forEach((grp) => {
                                if (grp.options && grp.options.length) {
                                    grp.options.forEach((sub) => {
                                        if (sub.options && sub.options.length) {
                                            sub.options.forEach((opt) => {
                                                if (opt.type) {
                                                    dataArray.push(`\`/${cmd.data.name} ${grp.name} ${sub.name} ${opt.name}\``);
                                                }
                                            });
                                        } else if (!sub.type){
                                            dataArray.push(`\`/${cmd.data.name} ${grp.name} ${sub.name}\``);
                                        }
                                    });
                                } else if (!grp.type){
                                    dataArray.push(`\`/${cmd.data.name} ${grp.name}\``);
                                }
                            });
                        } else if (!cmd.type) {
                            dataArray.push(`\`/${cmd.data.name}\``);
                        } 
                    });
                    return dataArray;
                }

                function optGeneralInfo(dirname) {
                    let dirCommands = interaction.guild.commands.client.commands.filter(dir => dir.folder !== 'owner');
                    let values = Array.from(dirCommands.values());
                    let commands = [
                        {
                            label: 'Main Menu',
                            value: 'default',
                            default: (dirname ? false : true)
                        },
                    ];

                    values.forEach((value) => {
                        if (!commands.some(folder => folder.value === `dir_${value.folder}`)) {
                            commands.push({
                                label: `${value.folder.charAt(0).toUpperCase()}${value.folder.slice(1)} [${dirCommands.filter(dir => dir.folder === value.folder).size}]`,
                                description: dirCommands.filter(dir => dir.folder === value.folder).map((cmd) => cmd.data.name).join(', ').substring(0, 80),
                                value: `dir_${value.folder}`,
                                default: (value.folder === dirname ? true : false)
                            });
                        }
                    });
                    return commands;
                }

                function optListCommands(dirname, cmdname) {
                    let dirCommands = interaction.guild.commands.client.commands.filter(dir => dir.folder === dirname);
                    let commands = [
                        {
                            label: 'Main Menu',
                            value: 'default',
                            default: (cmdname ? false : true)
                        },
                    ];

                    dirCommands.forEach((cmd) => {
                        commands.push({
                            label: `/${cmd.data.name}`,
                            description: cmd.data.description,
                            value: `cmd_${cmd.folder}_${cmd.data.name}`,
                            default: (cmd.data.name === cmdname ? true : false)
                        });
                    });
                    return commands;
                }

                function listCommands(dirname) {
                    let dirCommands = interaction.guild.commands.client.commands.filter(dir => dir.folder === dirname);
                    let commands = [];

                    dirCommands.forEach((cmd) => {
                        commands.push(`\`/${cmd.data.name}\` = ${cmd.data.description.slice(5)}`);
                    });
                    return commands;
                }

                function detailCommands(cmdname) {
                    let commands = interaction.guild.commands.client.commands.filter(dir => dir.data.name === cmdname);
                    let dataArray = [];
                
                    commands.forEach((cmd) => {
                        if(!dataArray.some(data => data === `> Permission: ${cmd.data.default_member_permissions ?? ''}\n> DM Permission: ${cmd.data.dm_permission ?? ''}\n> Command = \`/${cmd.data.name}\`\n> Description = ${cmd.data.description.slice(5)}`)) {
                            dataArray.push(`> Permission: ${cmd.data.default_member_permissions ?? ''}\n> DM Permission: ${cmd.data.dm_permission ?? ''}\n> Command = \`/${cmd.data.name}\`\n> Description = ${cmd.data.description.slice(5)}`);
                        }
                        if (cmd.data.options && cmd.data.options.length){
                            cmd.data.options.forEach((grp) => {
                                if (grp.type) {
                                    if(!dataArray.some(data => data === `\n> Command = \`/${cmd.data.name}\`\n> Description = ${cmd.data.description.slice(5)}`)){
                                        dataArray.push(`\n> Command = \`/${cmd.data.name}\`\n> Description = ${cmd.data.description.slice(5)}`)
                                    }
                                    dataArray.push(`\n> Option Name: [${grp.name}]\n> Option Type: ${grp.type}\n> Option Required: ${grp.required}\n> Option Description: ${grp.description.slice(5)}`);
                                } else if (grp.options && grp.options.length) {
                                    grp.options.forEach((sub) => {
                                        if (sub.type) {
                                            if(!dataArray.some(data => data === `\n> Command = \`/${cmd.data.name} ${grp.name}\`\n> Description = ${grp.description.slice(5)}`)){
                                                dataArray.push(`\n> Command = \`/${cmd.data.name} ${grp.name}\`\n> Description = ${grp.description.slice(5)}`)
                                            }
                                            dataArray.push(`\n> Option Name: [${sub.name}]\n> Option Type: ${sub.type}\n> Option Required: ${sub.required}\n> Option Description: ${sub.description.slice(5)}`);
                                        } else if (sub.options && sub.options.length) {
                                            sub.options.forEach((opt) => {
                                                if (opt.type) {
                                                    if(!dataArray.some(data => data === `\n> Command = \`/${cmd.data.name} ${grp.name} ${sub.name}\`\n> Description = ${sub.description.slice(5)}`)){
                                                        dataArray.push(`\n> Command = \`/${cmd.data.name} ${grp.name} ${sub.name}\`\n> Description = ${sub.description.slice(5)}`)
                                                    }
                                                    dataArray.push(`\n> Option Name: [${opt.name}]\n> Option Type: ${opt.type}\n> Option Required: ${opt.required}\n> Option Description: ${opt.description.slice(5)}`);
                                                } else {
                                                    dataArray.push(`\n> Command = \`/${cmd.data.name} ${grp.name} ${sub.name} ${opt.name}\`\n> Description = ${opt.description.slice(5)}`);
                                                }
                                            });
                                        } else {
                                            dataArray.push(`\n> Command = \`/${cmd.data.name} ${grp.name} ${sub.name}\`\n> Description = ${sub.description.slice(5)}`);
                                        }
                                    });
                                } else {
                                    dataArray.push(`\n> Command = \`/${cmd.data.name} ${grp.name}\`\n> Description = ${grp.description.slice(5)}`);
                                }
                            });
                        } else {
                            dataArray.push(`\n> Command = \`/${cmd.data.name}\`\n> Description = ${cmd.data.description.slice(5)}`)
                        }
                    });
                    return dataArray;
                }
                
                NewEmbed
                    .setColor(color)
                    .addFields(
                        { name: 'Admin', value: `${infoCommands('admin')}` },
                        { name: 'General', value: `${infoCommands('general').join(', ')}` },
                        { name: 'Music', value: `${infoCommands('music').join(', ')}` },
                    )
                    .setFooter({ text: 'You can check the details of permissions, options, and description using the selection feature below.' })

                const ARBinfoCommands1 = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('GeneralInfo')
                        .setPlaceholder('Nothing selected')
                        .addOptions(optGeneralInfo()),
                );

                const message = await interaction.reply({ embeds : [NewEmbed], components : [ARBinfoCommands1], fetchReply : true });

                const filter = i => {
                    i.deferUpdate();
                    return i.user.id === interaction.user.id;
                };

                const collector = await message.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 150000 });

                let CollectorEmbed = new EmbedBuilder();

                collector.on('collect', async i => {
                    // i.reply(`User : <@${i.user.id}>\nClicked : ${i.customId}\nValue : ${i.values}`);
                    console.log(`CollectorGeneralInfo: <@${i.user.id}> using \`/Info Commands\` command, and clicked the \`${i.customId}\` menu button with a value of \`${i.values}\``);
                    var collectorValue = i.values.toString().split("_");

                    var type = collectorValue[0];
                    var dirname = collectorValue[1];
                    var cmdname = collectorValue[2];
                    if (type === 'default') {
                        interaction.editReply({ embeds : [NewEmbed], components : [ARBinfoCommands1] });
                    } else if (type === 'dir') {
                        let ARBinfoCommands2 = new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('GeneralInfo')
                                .setPlaceholder('Nothing selected')
                                .addOptions(optGeneralInfo(`${dirname}`)),
                        );
                        let ARBinfoCommands3 = new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('GeneralInfoCommands')
                                .setPlaceholder('Nothing selected')
                                .addOptions(optListCommands(`${dirname}`)),
                        );
                        CollectorEmbed
                            .setColor(randomColor())
                            .setTitle(`**${dirname.charAt(0).toUpperCase() + dirname.slice(1)} Commands [${interaction.guild.commands.client.commands.filter(dir => dir.folder === `${dirname}`).size}]**`)
                            .setDescription(`${listCommands(`${dirname}`).join('\n')}`)
                        await interaction.editReply({ embeds : [CollectorEmbed], components : [ARBinfoCommands2, ARBinfoCommands3] });
                    } else if (type === 'cmd') {
                        let ARBinfoCommands2 = new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('GeneralInfo')
                                .setPlaceholder('Nothing selected')
                                .addOptions(optGeneralInfo(`${dirname}`)),
                        );
                        let ARBinfoCommands3 = new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('GeneralInfoCommands')
                                .setPlaceholder('Nothing selected')
                                .addOptions(optListCommands(`${dirname}`, `${cmdname}`)),
                        );
                        CollectorEmbed
                            .setColor(randomColor())
                            .setTitle(`**Command /${cmdname}**`)
                            .setDescription(`${detailCommands(`${cmdname}`).join('\n')}`)
                        await interaction.editReply({ embeds : [CollectorEmbed], components : [ARBinfoCommands2, ARBinfoCommands3] });
                    }
                });
                collector.on('end', async (collected) => {
                    if (!collected.size){
                        interaction.deleteReply();
                        CollectorEmbed
                            .setColor(color)
                            .setDescription(`**❌ | Timeout, Use the command \`/info commands\` again**`)
                        interaction.followUp({ embeds : [CollectorEmbed], ephemeral : true });
                    }
                    interaction.editReply({ components: [] });
                }); 
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