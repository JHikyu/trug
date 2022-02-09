#!/usr/bin/env node

const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');
const colors = require('colors');

const PROJECT_PATH = argv.path || '.';

(async () => {

    const response = await prompts([
    {
        type: 'toggle',
        name: 'basicFolders',
        message: 'Create basic folders?',
        initial: true,
        active: 'yes',
        inactive: 'no'
    },
    {
        type: 'toggle',
        name: 'starterProject',
        message: 'Generate starter project?',
        initial: true,
        active: 'yes',
        inactive: 'no'
    }
    ]);
  
    if(response.basicFolders) {
        // Create basic folders
        fs.mkdirSync(`${PROJECT_PATH}/views`);
        fs.mkdirSync(`${PROJECT_PATH}/public`);
        fs.mkdirSync(`${PROJECT_PATH}/src`);
    }
    if(response.starterProject) {
        // Create starter project
        // create file
        fs.mkdirSync(`${PROJECT_PATH}/views/api`);
        fs.writeFileSync(`${PROJECT_PATH}/views/api/index.html`, `localhost/api`);
        fs.writeFileSync(`${PROJECT_PATH}/views/api/endpoint.html`, `localhost/api/endpoint`);
        fs.writeFileSync(`${PROJECT_PATH}/views/index.html`, ``);
        fs.writeFileSync(`${PROJECT_PATH}/views/index.js`,
        `
        module.exports = async () => {
            //* Run once on page load [index.html]
            
            // Data to render in a template like ejs or pug
            // return {
            //     data: {
            //         title: '$$TEST TITLE VARIABLE$$',
            //         logs: logLength
            //     }
            // };
        };
        `
        );
    }


    console.log(`Enjoy your new project!`.green);
    console.log('Run ' + '`trug`'.yellow + ' to start your server');

  })();