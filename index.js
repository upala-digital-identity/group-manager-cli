#!/usr/bin/env node
// https://medium.com/jspoint/making-cli-app-with-ease-using-commander-js-and-inquirer-js-f3bbd52977ac


const { Command } = require('commander');
const program = new Command();
const { 
    getConfig,
    initHandler,
    deployPoolHandler,
    publishHandler,
    appendHandler,
    processHandler,
    listBundlesHandler } = require('./utils.js')

const config = getConfig()

program.version('0.0.1');

/*********
INITIALIZE
**********/

program
    .command('init')
    .description('Creates config file and generates wallet')
    .action(function () {
        initHandler(config);
});

program
    .command('deploy')
    .description('Deploy new group (pool)')
    .action(function () {
        deployPoolHandler(config);
    });

/**************
 MANAGE BUNDLES
***************/
     
program
    .command('publish')
    .description('Publish score bundle on-chain')
    .action(function () {
        publishHandler(config)
    });

program
    .command('append')
    .description('Append scores to existing bundle (Signed scores pool only)')
    .requiredOption('-b, --bundleId <bundleId>', 'specify a bundle ID to append to')
    .action(function () {
        if (options.bundleId) console.log(`- ${options.bundle}`);
        appendHandler(config, options.bundleId)
    });

program
    .command('process')
    .description('Finish bundle processing (if left unprocessed')
    .action(function () {
        processHandler(config)
    });

program
    .command('list')
    .description('List active bundles')
    .action(function () {
        listBundlesHandler(config)
    });

/************
 MANAGE OTHER
*************/

// setBaseScore(newScore)

// deleteScoreBundleId(scoreBundleId)
// getBaseScore()

// withdrawFromPool(recipient, amount)
// updateMetadata(newMetadata)

program.parse(process.argv);
