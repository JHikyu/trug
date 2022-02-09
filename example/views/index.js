module.exports = async () => {
    //* Run once on page load [index.pug]

    // Log data
    const logLength = require('../src/logData')({
        date: new Date(),
        message: 'Hello World'
    });


    return {
        data: {
            title: '$$TEST TITLE VARIABLE$$',
            logs: logLength
        }
    };
};
