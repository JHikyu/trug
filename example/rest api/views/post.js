module.exports = async (trug) => {
    const initData = require(trug.src('initData.js'));
    
    if(trug.method != 'POST') return;

    initData.init(trug);

    initData.postUser(trug, trug.postBody);


    return {
        method: "POST",
        data: {
            message: "User created"
        }
    };
};