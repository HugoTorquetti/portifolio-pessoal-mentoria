const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '..', '..', 'src', 'data', 'database.json');
const snapshot = fs.readFileSync(databasePath, 'utf-8');

function restoreDatabase() {
  fs.writeFileSync(databasePath, snapshot);
}

module.exports = {
  restoreDatabase
};
