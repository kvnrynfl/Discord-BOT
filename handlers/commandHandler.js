function loadCommands(client) {
    const { REST, Routes } = require('discord.js');
    const config = require('../config.json');
    const fs = require('node:fs');    
    const ascii = require("ascii-table");

    const table = new ascii().setHeading("Status", "Path", "File", "Commands").setAlignCenter(0);

    const commandsArray = [];
    // Grab all the command files from the commands directory you created earlier
    const commandsFolder = fs.readdirSync("./Commands");
    
    for (const folder of commandsFolder){
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`);
            
            const properties = { folder, ...commandFile };

            if ('data' in properties && 'execute' in properties) {
                client.commands.set(commandFile.data.name, properties);
            } else {
                console.log(`[WARNING] The command at ${properties} is missing a required "data" or "execute" property.`);
            }

            commandsArray.push(commandFile.data.toJSON());
            table.addRow('✔', folder, file, `/${properties.data.name}`);
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(config.client.token);

    (async () => {
        try {
            const data = await rest.put(
                Routes.applicationCommands(config.client.clientId),
                { body: commandsArray },
            );
            table.setTitle(`Reloaded ${data.length}/${commandsArray.length} commands`)
            console.log(table.toString());
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}

module.exports = { loadCommands };