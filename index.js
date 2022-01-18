#!/usr/bin/env node

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
    getBaseScoreHandler,
    deleteBundlesHandler,
    withdrawHandler,
    updateMetadataHandler } = require('./handlers.js')

const config = getConfig()

program.version('0.0.1');

// INITIALIZE
program
    .command('init')
    .description('Creates config file and generates wallet')
    .argument('<network>', 'Network by name (e.g. rinkeby)') // TODO
    .action(function (network) {
        initHandler(config, network);
});

// DEPLOY
program
    .command('deploy')
    .description('Deploy new group (pool)')
    .action(function () {
        deployPoolHandler(config);
    });

// MANAGE BASE SCORE
program
    .command('base')
    .description('Base score. DAI denominated in dollars (e.g. 0.1 = $0.1)')
    .option('-s, --set <score>', 'set base score')
    .option('-g, --get', 'get base score')
    .action(async function (options) {
        if (options.set) await setBaseScoreHandler(config, options.set)
        if (options.get) await getBaseScoreHandler(config)
    })

// MANAGE BUNDLES
program
    .command('bundle')
    .description('Manage score bundles')
    .option('-pub, --publish', 'Publish score bundle on-chain from input folder')
    .option('-a, --append <bundleId>', 'Append scores to existing bundle (Signed scores pool only)')
    .option('-pp, --process', 'Finish bundle processing \(if left unprocessed\)')
    .option('-l, --list', 'List active bundles')
    .option('-del, --delete <bundleId>', 'Delete bundle id on-chain')
    .action(async function (options) {
        // TODO allow only one option at a time
        if (options.publish) await publishHandler(config)
        if (options.append) await appendHandler(config, options.append)
        if (options.process) await processHandler(config)
        if (options.list) listBundlesHandler(config)
        if (options.delete) deleteBundlesHandler(config, options.delete)
    })

// MANAGE OTHER

program
    .command('metadata')
    .description('Update metadata')
    .argument('<metadata>', 'New metadata in JSON format') // TODO
    .action(async function (metadata) {
        await updateMetadataHandler(config, metadata);
    });

program
    .command('withdraw')
    .description('Withdraw funds (may require a commit')
    .argument('<recipient>', 'integer argument')
    .argument('<amount>', 'DAI denominated in dollars (e.g. 0.1 = $0.1)')
    .action(async (recipient, amount) => {
        await withdrawHandler(config, recipient, amount)
    })

program.parse(process.argv);
