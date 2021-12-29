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
    listBundlesHandler,
    setBaseScoreHandler,
    getBaseScoreHandler } = require('./handlers.js')

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
    .command('bundle')
    .description('Manage score bundles')
    .option('-p, --publish', 'Publish score bundle on-chain from input folder')
    .option('-a, --append <bundleId>', 'Append scores to existing bundle (Signed scores pool only)')
    .option('-pp, --process', 'Finish bundle processing \(if left unprocessed\)')
    .option('-l, --list', 'List active bundles')
    .action(async function (options) {
        if (options.publish) await publishHandler(config)
        if (options.append) await appendHandler(config, options.append)
        if (options.process) await processHandler(config)
        if (options.list) listBundlesHandler(config)
    })

program
  .command('base')
  .description('Base score. DAI denominated in dollars (e.g. 0.1 = $0.1)')
  .option('-s, --set <score>', 'set base score')
  .option('-g, --get', 'get base score')
  .action(async function (options) {
    if (options.set) await setBaseScoreHandler(config, options.set)
    if (options.get) await getBaseScoreHandler(config)
  })

/************
 MANAGE OTHER
*************/


// deleteScoreBundleId(scoreBundleId)

// withdrawFromPool(recipient, amount)
// updateMetadata(newMetadata)

program.parse(process.argv);
