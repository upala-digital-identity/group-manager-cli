const { setupWallet, readConfig, addToConfig } = require("./utils.js")
const { PoolManager } = require('@upala/group-manager')

module.exports = function () {
    
    console.log("creating bundle")
    const poolContract = await loadPoolContract()
    const poolManager = new PoolManager(poolContract, "./workdir", "./workdir")
    
    // get users from input folder
    const users = [
        { address: '0x2819c144d5946404c0516b6f817a960db37d4929', score: "4" },
        { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', score: "5" }
        ]

    // await poolManager.publishNew(users)
    // await poolManager.append(users, "0x000000000000000000000000000000007f3e126d15c10f83dfd0fd257e7030e1")

    await poolManager.process()
}