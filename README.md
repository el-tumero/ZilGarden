# ZilGarden NFT Dapp 

## Authors
Project made by "el_tumero" - Łukasz Tumiński (mail: tumerpl@gmail.com, telegram: @el_tumero)
Graphics made by Zofia Dzik <3

## Working version
Now hosted on gh-pages: https://el-tumero.github.io/ZilGarden/ .
In near futhure dedicaded domain will be bought.

## About
### General & Plans
ZilGarden is NFT Dapp platform. For now it only allows you to collect beautiful pixel art flowers, but that's just begining.(We we will be resuplling soon our flower magazine so everybody could get their flower NFT).

In our roadmap we plan to make breeding mechanism to allow you to create randomly generated flowers and make you professional digital flower grower. We also will improve UI to be even more user friendly and eye-catching. Whole project is totally open source. I invite everybody to join to discoussion about everything which is connected with project. So i wish you all happy gardening! 

### Specs
ZilGarden is based on frontend React App which is connected to Zilliqa Blockchain via Zilpay Wallet. On blockchain we store two main smart contracts write in Scilla. Here are addresses: 0x8a2c2dd026f8b89572a36f1f2a75faf2f1253c1d(nft), 0xd54f9ba20259c3ba145dca49a79ac711ab241ef7(minter). When user click CLAIM button, he connects to Minter contract, which allows him to mint new NFT with pixel art flower. All the graphics and metadata of NFTs are stored safely on ipfs. In Minter contract we stored future tokens URIs and we will be resuplling it with new tokenURIs soon. 

Here is route:
User -> Minter contract -> NFT Contract -> User

For more info please write to me on Telegram: @el_tumero
