#!/usr/bin/env node
// https://medium.com/jspoint/making-cli-app-with-ease-using-commander-js-and-inquirer-js-f3bbd52977ac


const { Command } = require('commander');
const program = new Command();
const deployPoolWiz = require('./create-group-wiz.js');

program.version('0.0.1');

program
    .command('init')
    .description('Creates config file and generates wallet')
    .action(function () {
        console.log("Setting up config...");
        console.log("Generating wallet...");
});

program
    .command('deploy')
    .description('Deploy new group (pool)')
    .action(function () {
        deployPoolWiz();
    });

// Bundles
// Moves csv file throuhg the following folders (or similar)
// csvs -> signed -> db -> live
// if any file is under this procedure, do nothing
// score bundles are named using date and user 
// proposed name 2021-08-22-meta-game-friends
program
    .command('publish')
    .description('Publish score bundle on-chain and to db')
    // .option("Bundle name")
    // path to csv (default csv)
    .action(function () {
        console.log("Creating score bundle...")
        console.log("Publishing on-chain...")
        console.log("Publishing to db...")
    });

program
    .command('append')
    .description('Append scores to existing bundle (Signed scores pool only)')
    .action(function () {
        // switch to bundle selector (propose to select or type manually)
        console.log("Publishing to db...")
        console.log("Creating score bundle...")
    });

program
    .command('delete')
    .description('Deactivate bundle (requires commit)')
    .action(function () {
        // switch to bundle selector (propose to select or type manually)
        console.log("Publishing to db...")
        console.log("Creating score bundle...")
    });

program.parse(process.argv);
