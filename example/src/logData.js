// Requirements
const fs = require('fs');
const path = require("path");

module.exports = (object) => {

    // Read database [data.json]
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

    // Add log to database
    data.logs.push(object);

    // Write database [data.json]
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data));

    return data.logs.length;

};


