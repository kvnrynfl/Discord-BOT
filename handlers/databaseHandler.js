const AsciiTable = require("ascii-table");

function loadDatabase(client) {
    const table = new AsciiTable().setHeading("Status", "Table", "Kolom", "Value").setAlignCenter(0).setAlignCenter(2).setAlignCenter(3);

    var databaseList = [
        'logging',
        'reportbug',
    ];

    client.database.getConnection(function(err, connection) {
        if (err) console.log(err);
        
        let callbackCounter = 0;
        for (let x in databaseList) {
            connection.query(`SELECT * FROM ${databaseList[x]}`, function(error, result, fields) {
                if (result.length) {
                    table.addRow('✔', databaseList[x].replace(/[\x00-\x1F\x7F-\x9F]/g, ''), fields.length, result.length);
                } else {
                    table.addRow('✔', databaseList[x].replace(/[\x00-\x1F\x7F-\x9F]/g, ''), fields.length, 'NULL');
                }

                callbackCounter++;
                if (callbackCounter === databaseList.length) {
                    console.log(table.toString());
                }

                if (error) {
                    console.log(`[WARNING] Database Handler : ${error.message}`);
                };
            });
        }
    });
}

module.exports = { loadDatabase };