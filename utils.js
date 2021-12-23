const fs = require('fs')
const { ethers } = require('ethers')
const { deployPool, attachToPool, PoolManager } = require('@upala/group-manager')

// SETUP AND INITIALIZATION 

function getConfig() {
    try {
        return JSON.parse(fs.readFileSync('config.json'))
    } catch {
        return null
    }
}

function createConfig(config) {
    if (config != null) { throw new Error("Config already exists")}
    const initialConfig = {
        chainId: 31337, // todo put rinkeby here (change to local for dev)
        mnemonic: 'test test test test test test test test test test test junk',
        ethNodeUrl: 'http://localhost:8545',  // use infura or alchemy here
        poolAddress: '',
        poolType: 'SignedScoresPool',
        workdir: './workdir',
        csvDir: './input' 
    }
    fs.writeFileSync('config.json', JSON.stringify(initialConfig, null, 2))

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
    poolContract = await attachToPool(config.poolType, poolManagerWallet, config.poolAddress)
    return new PoolManager(poolContract, config.workdir, config.workdir)
}

// HELPERS

// get users from input folder
function loadUsers(config) {
    return [
        { address: '0x2819c144d5946404c0516b6f817a960db37d4929', score: '4' },
        { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', score: '5' }
        ]
}

// HANDLERS

function deployPoolHandler(config) {
    if (config == null) { throw new Error('No config run \"init\" first.') }
    const poolContract = await deployPool(
        poolType = config.poolType, 
        wallet = getWallet(config)
    )
    config.poolAddress = poolContract.address
    saveNewConfig(config)
}

// BUNDLES MANAGEMENT HANDLERS

async function publishHandler(config) {
    const poolManager = getPoolManager(config)
    const users = loadUsers(config)

    // production
    // check if we are lowering down scores
    // check if there are dublicates
    // same should be for append 
    await poolManager.publishNew(users)
    // await poolManager.process()
}

// this is not testing for dublicates and for scores being decresed
// (decreased scores take no effect on chain)
async function appendHandler(config, bundleId){
    const poolManager = getPoolManager(config)
    const users = loadUsers(config.csvDir)
    await poolManager.append(users, bundleId)
}

async function processHandler(config){
    const poolManager = getPoolManager(config)
    await poolManager.process()
}

function listBundlesHandler(config) {
    return (await getPoolManager(config)).getActiveBundlesList()
}

async function processHandler(config) {
    const poolManager = await getPoolManager(config)
    await poolManager.process()
}

module.exports = {
    getConfig,
    initialize,
    publish,
    deployPoolWiz
}