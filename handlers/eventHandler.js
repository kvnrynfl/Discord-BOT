function loadEvents(client) {
    const ascii = require('ascii-table');
    const fs = require('node:fs');
    const table = new ascii().setHeading('Status', 'Path', 'File').setAlignCenter(0);

    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        
        if (event.rest) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        } else {
            if (event.once){
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
        table.addRow("✔", './', file);
        continue;
    }
    
    const eventPlayerFiles = fs.readdirSync('./events/player').filter(file => file.endsWith('.js'));

    for (const file of eventPlayerFiles) {
        const event = require(`../events/player/${file}`);

        if (event.rest) {
            if (event.once) {
                client.player.once(event.name, (...args) => event.execute(...args));
            } else {
                client.player.on(event.name, (...args) => event.execute(...args));
            }
        } else {
            if (event.once){
                client.player.once(event.name, (...args) => event.execute(...args));
            } else {
                client.player.on(event.name, (...args) => event.execute(...args));
            }
        }
        table.addRow("✔", './player/', file)
    }

    return console.log(table.toString());
}

module.exports = {loadEvents};