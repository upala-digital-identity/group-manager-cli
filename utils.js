const fs = require('fs')
const { ethers } = require('ethers')

function setupWallet() {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    const mnemonic = 'test test test test test test test test test test test junk'
    return ethers.Wallet.fromMnemonic(mnemonic).connect(provider)
}

async function safeAttach() {
    poolContract = await attachToPool('SignedScoresPool', poolManagerWallet, "0x524F04724632eED237cbA3c37272e018b3A7967e")
}

function readConfig() {

}

function addToConfig(newConfig) {
    fs.writeFileSync("config.json", JSON.stringify(newConfig, null, 2))
}

module.exports = {
    setupWallet,
    readConfig,
    addToConfig
}