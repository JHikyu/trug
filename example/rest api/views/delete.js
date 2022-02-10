module.exports = async (trug) => {
    if(trug.method != 'DELETE') return;
    
    const initData = require(trug.src('initData.js'));
    initData.init(trug);

    let users = await initData.getUsers(trug);

    if(trug?.postBody?.name) {
        users = users.filter(user => user.name.toLowerCase().includes(trug.postBody.name.toLowerCase()));
    }
    if(trug?.postBody?.age && users.length > 1) {
        users = users.filter(user => user.age == trug.postBody.age);
    }

    // delete first object, if there is only one object
    if(users.length == 1) {
        await initData.deleteUser(trug, users[0]);
        return {
            method: "DELETE",
            status: 200,
        };
    }

    return {
        method: "DELETE",
        data: {
            message: "User not found",
        }
    };
};