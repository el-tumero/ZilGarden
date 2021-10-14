require('dotenv').config()
const options = require('./options')
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);
const path = require('path');
const fs = require('fs')


// pinata.testAuthentication().then((result) => {
//     //handle successful authentication here
//     console.log(result);
// }).catch((err) => {
//     //handle error here
//     console.log(err);
// });

const readableStreamForFile = fs.createReadStream(path.resolve(__dirname + '/images/kwiatek2.png'));

pinata.pinFileToIPFS(readableStreamForFile, options.plant).then((result) => {
    const gatewayUrl = "https://gateway.pinata.cloud/ipfs/"
    const json = {
        "name": "Blue flower",
        "image": gatewayUrl + result.IpfsHash
    }

    pinata.pinJSONToIPFS(json, options.plantJSON).then((result2) => {
        console.log(result2);
       // _collectible.methods.createCollectible(gatewayUrl+ result2.IpfsHash).send({from: '0x60790ABBD7dd61a745Ae937E5ed4812AC3aE737D', gas: 5000000});    
    }).catch((err) => {
        console.log(err);
    });

}).catch((err) => {
    console.log(err);
});