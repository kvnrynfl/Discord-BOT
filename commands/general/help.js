const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with help embed!'),
	async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x33CCFF)
            .setTitle('INFORMATION ')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: `${interaction.client.user.tag}`, iconURL: `${interaction.client.user.displayAvatarURL()}`, url: 'https://rey-bot.kevinreynaufal.my.id' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		return interaction.editreply({ embeds : [helpEmbed] }).then(async msg => {
            // Loop selama 10 detik
            for (let i = 0; i < 10; i++) {
                // Menunggu 1 detik
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mengubah warna pesan embed menjadi warna random yang cerah
                const r = Math.floor(Math.random() * 200) + 50; // Warna merah acak antara 50 dan 250
                const g = Math.floor(Math.random() * 200) + 50; // Warna hijau acak antara 50 dan 250
                const b = Math.floor(Math.random() * 200) + 50; // Warna biru acak antara 50 dan 250
                const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
                helpEmbed.setColor(color);

                // Mengirim pesan embed yang sudah diubah warnya ke channel text
                interaction.editReply({embeds : [helpEmbed]});
            }
        });



        
	},
};