function loadEvents(client) {
    const ascii = require('ascii-table');
    const fs = require('node:fs');
    const table = new ascii().setHeading('Events', 'Status').setAlign(2, ascii.RIGHT).setAlign(1, ascii.CENTER);

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
        table.addRow(file, "✔");
        continue;
    }
    return console.log(table.toString());
}

module.exports = {loadEvents};