const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { botversion, botwebsite } = require('../../config.json');
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
                            { name: 'Version', value: `${botversion}` },
                            { name: 'Website', value: `[${botwebsite}](https://${botwebsite})` },
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
                    let guildMembers = await guild.members.fetch({ withPresences: true })
                    const onlineMembers = await guildMembers.filter(member => member.presence?.status != "offline").size;
                    // const offlineMembers = interaction.guild.members.cache.filter(member => member.presence?.status == "offline").size;
                    // const awayMembers = message.guild.members.cache.filter(member => member.presence?.status == "idle").size;
                    // const dndMembers = message.guild.members.cache.filter(member => member.presence?.status == "dnd").size;
                    // const m_bot = guild.members.cache.filter(member => member.user.bot).size;
                    // const m_human = guild.members.cache.filter(member => !member.user.bot).size;
                    const channel = guild.channels.cache.size;
                    const c_text = guild.channels.cache.filter(c => c.type === 0).size;
                    // const c_dm = guild.channels.cache.filter(c => c.type === 1).size;
                    const c_voice = guild.channels.cache.filter(c => c.type === 2).size;
                    // const c_gdm = guild.channels.cache.filter(c => c.type === 3).size;
                    const c_category = guild.channels.cache.filter(c => c.type === 4).size;
                    const c_announcement = guild.channels.cache.filter(c => c.type === 5).size;
                    const infoServerEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setThumbnail(`${guild.iconURL()}`)
                        .addFields(
                            { name: 'Name', value: `${guild.name}` },
                            { name: 'ID', value: `${guild.id}` },
                            { name: 'Owner', value: `${owner.user.tag}` },
                            { name: 'Region', value: `${guild.preferredLocale}` },
                            { name: 'Verification Level', value: `${guild.verificationLevel}` },
                            { name: 'Rules', value: `<#${guild.rulesChannelId}>`, inline: true },
                            { name: 'AFK', value: `<#${guild.afkChannelId}>`, inline: true },
                            { name: 'Roles', value: `${guild.roles.cache.map(role => `<@&${role.id}>`).join(',')}` },
                            { name: 'Boost', value: `Level 0\nBoosts 0`, inline: true },
                            { name: 'Channel', value: `Total ${channel}\nCategory ${c_category}\nText ${c_text}\nVoice ${c_voice}\n Announcement ${c_announcement}`, inline: true },
                            { name: 'Members', value: `Total ${guild.memberCount}\nOnline ${onlineMembers}\nBots 0\nHumans 0`, inline: true },
                            { name: 'Created At', value: `${moment(guild.createdAt).format("DD MMMM YYYY - LT")}`},
                        )
                        .setTimestamp()
                        .setFooter({ text: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` });
                    interaction.reply({ embeds : [infoServerEmbed] });
                    // console.log(guild.PremiumTier.getValue());
                    break;
                case "user":
                    if(target) {
                        infoUser = target;
                    } else {
                        infoUser = interaction.user;
                    }
                    const nickname = (guild.members.cache.get(`${infoUser.id}`).nickname) ? `${guild.members.cache.get(`${infoUser.id}`).nickname}` : `${infoUser.username}`;
                    const humanorbot = (infoUser.bot ? "BOT" : "Human");
                    const infoUserEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setThumbnail(`${infoUser.displayAvatarURL({ format: "png", size: 1024 })}`)
                        .addFields(
                            { name: 'Mention', value: `<@${infoUser.id}>`},
                            { name: 'Name', value: `${infoUser.username}`, inline: true},
                            { name: 'Discriminator', value: `#${infoUser.discriminator}`, inline: true},
                            { name: 'Nickname', value: `${nickname}`},
                            { name: 'User ID', value: `${infoUser.id}` },
                            { name: 'Status', value: `${humanorbot}, ${infoUser.presence?.status ? infoUser.presence?.status : "Offline"}`},
                            { name: 'Boost', value: `${infoUser.premium_type}` },
                            { name: 'Roles', value: `${guild.members.cache.get(`${infoUser.id}`).roles.cache.map(role => `<@&${role.id}>`).join(', ')}` },
                            { name: 'Joined At', value: `${moment(infoUser.joinedAt).format("DD MMMM YYYY")}`},
                            { name: 'Created At', value: `${moment(infoUser.createdAt).format("DD MMMM YYYY")}`},
                        )
                        .setTimestamp()
                        .setFooter({ text: `${user.tag}`, iconURL: `${user.displayAvatarURL({ format: "png", size: 1024 })}` });
                    interaction.reply({ embeds : [infoUserEmbed] });
                    // console.log(guild.members.cache.get(`${infoUser.id}`));
                    break;

            }
        } catch (err) {
            console.log(err);
        }
	},
};