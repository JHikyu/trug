module.exports = async (trug) => {
    const initData = require(trug.src('initData.js'));
    initData.init(trug);

    let users = await initData.getUsers(trug);

    if(trug?.query?.name) {
        users = users.filter(user => user.name.toLowerCase().includes(trug.query.name.toLowerCase()));
    }
    if(trug?.query?.age && users.length > 1) {
        users = users.filter(user => user.age == trug.query.age);
    }

    return {
        method: "GET",
        data: {
            users: users
        }
    };
};