const fs = require('fs');
let data = {};

async function init(trug) {
    // Test if the file exists
    if (!fs.existsSync(trug.src('data.json'))) {
        fs.writeFileSync(trug.src('data.json'), '{}');
    }

    // Set data to the file
    data = JSON.parse(fs.readFileSync(trug.src('data.json')));
}

async function postUser(trug, userObject) {
    if(data.users) {
        data.users.push(userObject);
    } else {
        data.users = [userObject];
    }

    fs.writeFileSync(trug.src('data.json'), JSON.stringify(data));
}

async function getUsers(trug) {
    return data?.users;
}

async function deleteUser(trug, userObject) {
    const userIndex = data.users.findIndex(user => user.name == userObject.name && user.age == userObject.age);

    if(userIndex > -1) {
        data.users.splice(userIndex, 1);
    }

    fs.writeFileSync(trug.src('data.json'), JSON.stringify(data));
}

module.exports = {
    init,
    postUser,
    getUsers,
    deleteUser
};