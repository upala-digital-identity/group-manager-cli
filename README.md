# Upala group manager

Tools for Upala group managers. Create and manage groups via command line or integrate with your software. The lib behind this CLI is [here](https://github.com/upala-digital-identity/group-manager)

## Quickstart

Steps in this section will let you deploy and setup your own pool and assign scores to users. After that users will be able to verify their scores and liquidate their ID and get their liquidation reward (which is equal to score)

#### - initialize group manager directory

Specify the network you want to work with.

    node index.js init gnosis

The command will create **config.json** file in the project root.


#### - modify config.json file

    {
      "chainId": 100,
      "mnemonic": "test test test test test test test test test test test junk",
      "ethNodeUrl": "https://rpc.gnosischain.com",
      "poolType": "SignedScoresPool",
      "workdir": "workdir",
      "inputDir": "./input"
    }

- **chainId** - should be already set to the network you specified
- **mnemonic** - use your mnemonic for the group manager wallet
- **ethNodeUrl** - specify RPC endpoint for the network
- **poolType** - already set (the only poolType available at the moment is SignedScoresPool)
- **workdir** - the directory where score bundles data will be stored (default: "workdir")
- **inputDir** - the directory where group-manager will pool user score jsons (default: "./input") 

#### - deploy group smart contract

    node index.js deploy

will deploy group smart contract (group pool) and write **poolAddress** to **config.json**.


#### - set base score

Base score is a necessary parameter of a group pool. Every user score is calculated as [total user score] = [userScore] * [group base score]. Base score is denominated in dollars

    node index.js base -s 0.5

Calling 
    
    node index.js base -g

will return:
    
    Pool base score is $0,5

#### - fund your pool

Per protocol a user can verify his or her score to a dapp if pool balance is higher than the score. In other words the pool must provide an ability for the user to liquidate. The example input file (in the next step) contains two users with scores of $1 and $2. Our base score is $0.5 which gives $1 max score across the group. So we need at least $1 in the pool so that both users could verify their scores (if one of them liquidates the other loses the ability to prove scores or liquidate until pool is funded again).

Send 1 DAI to your contract (per this example). On real networks (e.g. Gnosis) send DAI from your real wallet. On test-nets (e.g. Rinkeby) use free-dai-to-the-world function TODO

| Chain  | DAI contract |
| ------------- | ------------- |
| Rinkeby  | [0xbC0dFaA78fe7bc8248b9F857292f680a1630b0C5](https://rinkeby.etherscan.io/address/0xbC0dFaA78fe7bc8248b9F857292f680a1630b0C5#code)  |
| Gnosis  | [0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d](https://blockscout.com/xdai/mainnet/address/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d/transactions)  |

#### - assign scores to users

Modify **/input/example_users.json** file:

    [
        { "address": "0x8128729DacD29a7A00EFBc701F125631B6Bf37e0", "score": "1" },
        { "address": "0x81293901281f9F7294DB21119504C6df6B0ce765", "score": "2" }
    ]

You can use addresses or existing UpalaID's in the **address** field.

If you are playing around with the protocol a good idea would be to use [bot-manager "list" command](https://github.com/upala-digital-identity/bot-manager-cli) and copy accounts from there.

#### - publish user scores on-chain

The Signed scores type of pool stores score bundle hash on-chain. Group manager signs scores for each user along with the score bundle hash. This signature is then used by a user to confirm their score on-chain (or liquidate). This type of pool allows score modification and adding new users to a bundle without any on-chain transactions (see append feature below).


    node index.js bundle -pub

If successful the command will create score bundle, push it on chain and save the result to **/workdir/live** folder.

#### - publish proofs somewhere open

Now users (and bots) need to find their scores and proofs for these scores. Make sure to publish it somewhere accessible and well-known (a score explorer will be shipped soon to save you the bother of doing this).

You're all set. Now wait for bot liquidations. If there are too much liquidations, you've probably set If nothing happens try increasing your base score or individual scores. 

## Manage other

#### Set or update group metadata

Not fully implemented. Will publish JSON string to pool metadata. 

    node index.js metadata <New metadata in JSON format>

#### Withdraw DAI from the pool

    node index.js withdraw <recipient address> <DAI denominated in dollars (e.g. 0.1 = $0.1)>

Sends DIA from pool to recipient address

#### Bundles management

    node index.js bundle -a <bundleId>

Appends scores to existing bundle (Signed scores pool only)

    node index.js bundle -pp

Finishes bundle processing (if left unprocessed)

    node index.js bundle -l

Lists active bundles

    node index.js bundle -del

Deletes bundle id on-chain
