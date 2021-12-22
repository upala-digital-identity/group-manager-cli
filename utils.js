const fs = require('fs')
const { ethers } = require('ethers')
const { deployPool, attachToPool, PoolManager } = require('@upala/group-manager')

// INITIALIZATION 

function initialize() {
    return setupWallet()
}

function getConfig() {
    // chain id
    // mnemonic (or different wallet unlocker for the future)
    // poolAddress
    // workdir?
    // wallet
}

function addToConfig(newConfig) {
    fs.writeFileSync("config.json", JSON.stringify(newConfig, null, 2))
}

function setupWallet() {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    const mnemonic = 'test test test test test test test test test test test junk'
    return ethers.Wallet.fromMnemonic(mnemonic).connect(provider)
}

async function safeAttach() {
    poolContract = await attachToPool('SignedScoresPool', poolManagerWallet, "0x524F04724632eED237cbA3c37272e018b3A7967e")
}

async function loadPoolManager() {
    const poolContract = await loadPoolContract()
    return new PoolManager(poolContract, "./workdir", "./workdir")
}

// get users from input folder
function loadUsers() {
    return [
        { address: '0x2819c144d5946404c0516b6f817a960db37d4929', score: "4" },
        { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', score: "5" }
        ]
}

function deployPoolHandler() { 
    const poolContract = await deployPool(
        poolType = 'SignedScoresPool', 
        wallet = setupWallet()
    )
    const newConfig = {
        poolAddress: poolContract.address
    }
    addToConfig(newConfig)
}

// BUNDLES 

async function publishHandler() {

    const poolManager = loadPoolManager()
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
    const poolManager = loadPoolManager()
    const users = loadUsers()
    await poolManager.append(users, bundleId)
    // await poolManager.process()
}

function listBundlesHandler() {
    return (await loadPoolManager()).getActiveBundlesList()
}

async function processHandler() {
    const poolManager = await loadPoolManager()
    await poolManager.process()
}

module.exports = {
    initialize,
    publish,
    deployPoolWiz
}