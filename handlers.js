const fs = require('fs')
const path = require('path')
const { ethers, utils } = require('ethers')
const { deployPool, attachToPool, PoolManager } = require('@upala/group-manager')

// TODO 
// check transaction mining for transaction commands (withdraw, setBaseScore)

// SETUP AND INITIALIZATION 

function getConfig() {
    try {
        return JSON.parse(fs.readFileSync('config.json'))
    } catch {
        return null
    }
}

function saveNewConfig(newConfig) {
    fs.writeFileSync('config.json', JSON.stringify(newConfig, null, 2))
}

function getWallet(config) {
    const provider = new ethers.providers.JsonRpcProvider(config.ethNodeUrl)
    return ethers.Wallet.fromMnemonic(config.mnemonic).connect(provider)
}

async function getPoolManager(config) {
    if (config == null) { throw new Error('No config run \"init\" first.') }
    if (config.poolAddress == '') { throw new Error('No pool address. Deploy pool first.') }

    const poolManagerWallet = getWallet(config)
    const poolContract = await attachToPool(config.poolType, poolManagerWallet, config.poolAddress)
    return new PoolManager(poolContract, config.workdir, config.workdir)
}

// HELPERS

// get users from input folder
function loadUsers(config) {
    const inputs = fs.readdirSync(config.inputDir)
    if (inputs[0]) {
        return JSON.parse(fs.readFileSync(path.join(config.inputDir, inputs[0])))
    } else {
        throw new Error('No users in input folder. Please provie a JSON file')
    }
}

// HANDLERS
// INIT

function initHandler(config, network) {
    if (config != null) { throw new Error("Config already exists")}

    let networkID
    if (network == '4' || network == "Rinkeby" || network == "Rinkeby") networkID = 4
    if (network == '31337' || network == 'local') networkID = 31337

    const initialConfig = {
        chainId: networkID, // todo put rinkeby here (change to local for dev)
        mnemonic: 'test test test test test test test test test test test junk',
        ethNodeUrl: 'http://localhost:8545',  // use infura or alchemy here
        poolAddress: '',
        poolType: 'SignedScoresPool',
        workdir: 'workdir',
        inputDir: './input'
    }
    fs.writeFileSync('config.json', JSON.stringify(initialConfig, null, 2))
}

// POOL

async function deployPoolHandler(config) {
    if (config == null) { throw new Error('No config run \"init\" first.') }
    // TODO check if already deployed
    const poolContract = await deployPool(
        poolType = config.poolType, 
        wallet = getWallet(config)
    )
    config.poolAddress = poolContract.address
    saveNewConfig(config)
    console.log("deployed new pool to %s", poolContract.address)
}

async function withdrawHandler(config, recipient, amount) {
    const wei = utils.parseUnits(amount, 'ether')
    ;(await getPoolManager(config)).withdrawFromPool(recipient, wei)
    console.log('Withdrawn \$%s to %s', utils.formatEther(wei), recipient)
}

async function updateMetadataHandler(config, newMetadata) {
    ;(await getPoolManager(config)).updateMetadata(newMetadata)
    console.log('Updated pool metadata')
}


// BUNDLES MANAGEMENT HANDLERS

async function publishHandler(config) {
    const poolManager = await getPoolManager(config)
    const users = loadUsers(config)

    // production
    // check if we are lowering down scores
    // check if there are dublicates
    // same should be for append 
    await poolManager.publishNew(users)
}

// this is not testing for dublicates and for scores being decresed
// (decreased scores take no effect on chain)
async function appendHandler(config, bundleId){
    const poolManager = await getPoolManager(config)
    const users = loadUsers(config)
    await poolManager.append(users, bundleId)
}

async function processHandler(config){
    ;(await getPoolManager(config)).process()
}

async function listBundlesHandler(config) {
    console.log("Active bundles:")
    console.log ((await getPoolManager(config)).getActiveBundlesList())
}

async function deleteBundlesHandler(config, bundleId) {
    const poolManager = await getPoolManager(config)
    await poolManager.deleteScoreBundleId(bundleId)
    console.log('Deleted bundle id \$%s', bundleId)
}

// BASE SCORE

async function setBaseScoreHandler(config, score) {
    const wei = utils.parseUnits(score, 'ether')
    await (await getPoolManager(config)).setBaseScore(wei)
    console.log('Pool base score is set to \$%s', utils.formatEther(wei))
}

async function getBaseScoreHandler(config) {
    const wei = await (await getPoolManager(config)).getBaseScore()
    console.log('Pool base score is \$%s', utils.formatEther(wei))
}

module.exports = {
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
    updateMetadataHandler
}