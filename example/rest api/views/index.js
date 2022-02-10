let connections = [];

module.exports = async (trug) => {
    const initData = require(trug.src('initData.js'));
    initData.init(trug);

    return {
        method: "GET",
        data: {
            routes: ['get', 'post', 'delete'],
            connections
        }
    };
};