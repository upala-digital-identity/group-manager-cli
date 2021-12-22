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

function createConfig() {
    if (getConfig() == null) {
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
    } else {
        console.log('Config already exists')
    }
}

function saveNewConfig(newConfig) {
    fs.writeFileSync('config.json', JSON.stringify(newConfig, null, 2))
}

function getWallet(mnemonic, ethNodeUrl) {
    const provider = new ethers.providers.JsonRpcProvider(ethNodeUrl)
    return ethers.Wallet.fromMnemonic(mnemonic).connect(provider)
}

function deployPoolHandler() {
    const config = getConfig()
    if (config) {
        const poolContract = await deployPool(
            poolType = config.poolType, 
            wallet = getWallet(config.mnemonic, config.ethNodeUrl)
        )
        config.poolAddress = poolContract.address
        saveNewConfig(config)
        }
    else {
        console.log('No config run \"init\" first.')
    }
}

async function getPoolManager() {
    const config = getConfig()
    if (config == null) {
        console.log('No config run \"init\" first.')
        return null
    }

    const poolManagerWallet = getWallet(config.mnemonic, config.ethNodeUrl)
    if (config.poolAddress) {
        poolContract = await attachToPool(config.poolType, poolManagerWallet, config.poolAddress)
        return new PoolManager(poolContract, config.workdir, config.workdir)
    } else {
        console.log('No pool address. Deploy pool first.')
        return null
    }
}


// HANDLERS

// get users from input folder
function loadUsers(dir) {
    return [
        { address: '0x2819c144d5946404c0516b6f817a960db37d4929', score: '4' },
        { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', score: '5' }
        ]
}

// BUNDLES MANAGEMENT HANDLERS

async function publishHandler() {

    const poolManager = getPoolManager()
    const users = loadUsers()

    // production
    // check if we are lowering down scores
    // check if there are dublicates
    // same should be for append 

    await poolManager.publishNew(users)
    // await poolManager.process()
}

// this is not testing for dublicates and for scores being decresed
// (decreased scores take no effect on chain)
async function appendHandler(bundleId){
    const poolManager = getPoolManager()
    const users = loadUsers()
    await poolManager.append(users, bundleId)
    // await poolManager.process()
}

async function processHandler(bundleId){
    const poolManager = getPoolManager()
    await poolManager.process()
}

function listBundlesHandler() {
    return (await getPoolManager()).getActiveBundlesList()
}

async function processHandler() {
    const poolManager = await getPoolManager()
    await poolManager.process()
}

module.exports = {
    initialize,
    publish,
    deployPoolWiz
}