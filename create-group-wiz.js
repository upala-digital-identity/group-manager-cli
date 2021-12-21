const { setupWallet, readConfig, addToConfig } = require("./utils.js")
const { deployPool } = require('@upala/group-manager')


module.exports = async function () {
    const poolContract = await deployPool(
        poolType = 'SignedScoresPool', 
        wallet = setupWallet()
    )
    const newConfig = {
        poolAddress: poolContract.address
    }
    addToConfig(newConfig)
}