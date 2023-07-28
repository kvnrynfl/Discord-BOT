const AsciiTable = require('ascii-table');
const fs = require('node:fs');

function loadEvents(client, player) {
    const table = new AsciiTable().setHeading('Status', 'Category', 'File').setAlignCenter(0);

    const eventClientFiles = fs.readdirSync('./events/client').filter(file => file.endsWith('.js'));

    for (const file of eventClientFiles) {
        const event = require(`../client/${file}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        table.addRow("✔", 'client', file);
        continue;
    }

    const eventPlayerFiles = fs.readdirSync('./events/player').filter(file => file.endsWith('.js'));

    for (const file of eventPlayerFiles) {
        const event = require(`../events/player/${file}`);

        if (event.once) {
            player.events.once(event.name, (...args) => event.execute(...args, client));
        } else {
            player.events.on(event.name, (...args) => event.execute(...args, client));
        }

        table.addRow("✔", 'player', file)
        continue;
    }

    return console.log(table.toString());
}

module.exports = { loadEvents };