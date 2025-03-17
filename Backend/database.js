const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'DbBullshit17',
    database: 'traderoo',
    port: 3308
});

db.connect(err => {
    if (err) {
        console.error('Datenbankverbindung fehlgeschlagen:', err);
        return;
    }
    console.log('Mit MySQL-Datenbank verbunden auf Port 3308');
});

module.exports = db;
