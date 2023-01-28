function loadEvents(client) {
    const ascii = require('ascii-table');
    const fs = require('node:fs');

    const table = new ascii().setHeading('Status', 'Path', 'File').setAlignCenter(0);

    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        table.addRow("✔", './', file);
        continue;
    }
    
    const eventPlayerFiles = fs.readdirSync('./events/player').filter(file => file.endsWith('.js'));

    for (const file of eventPlayerFiles) {
        const event = require(`../events/player/${file}`);

        if (event.once){
            client.player.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.player.on(event.name, (...args) => event.execute(...args, client));
        }

        table.addRow("✔", './player/', file)
        continue;
    }

    return console.log(table.toString());
}

module.exports = {loadEvents};