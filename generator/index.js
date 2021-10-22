require('dotenv').config()
const options = require('./options')
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);
const path = require('path');
const fs = require('fs')
const gatewayUrl = "https://ipfs.io/ipfs/"


// DELETE ALL PINS
// const filter = {
//     status: 'pinned',
//     pageLimit: 50,
//     pageOffset: 0,
// }

// const pinArr = [];

// pinata.pinList(filter).then(result => {
//     result.rows.forEach(element => {
//         pinArr.push(element.ipfs_pin_hash)
//     });
//     console.log(pinArr)
//     var counter = 0

//     setInterval(function(){
//         if(counter < pinArr.length){
//             pinata.unpin(pinArr[counter]).then((result) => { 
//             console.log(pinArr[counter])
//             }).catch((err) => {
//             console.log(err);
//             })
//         }
//         counter++
//     }, 5000) 
// });



// pinata.unpin(element.ipfs_pin_hash).then((result) => { 
//     console.log(element.ipfs_pin_hash)
// ;}).catch((err) => {
//  console.log(err);
// })

// pinata.userPinnedDataTotal().then((result) => {
//     console.log(result)
// }).catch((err) => {  
//     console.log(err)
// });


const metadataFilter = {
    name: 'plantMetadata'
}

const filter = {
    status: 'pinned',
    pageLimit: 50,
    pageOffset: 0,
    metadata: metadataFilter
}

pinata.pinList(filter).then(result => {
    //console.log(result)
    result.rows.forEach((element, index) => console.log(index+1, element.ipfs_pin_hash))
})


pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});


//const dataGlobal = []
//const data0 = require('./images/type0/data.json')
//const data1 = require('./images/type1/data.json')
// const data2 = require('./images/type2/data.json')
// dataGlobal.push(data2)

// dataGlobal[0].colors.forEach(color => {
//     //console.log(color)
//     pinFlower(2, color)
// })


//pinFlower(2, '63DDC6')

// function pinFlower(type, color){
//     const readableStreamForFile = fs.createReadStream(path.resolve(__dirname + `/images/type${type}/${color}.png`));
   
//     pinata.pinFileToIPFS(readableStreamForFile, options.plant).then((result) => {
//     const json = {
//         "name": dataGlobal[0].name,
//         "color": color,
//         "stalk_color": dataGlobal[0].stalk_color,
//         "image": gatewayUrl + result.IpfsHash,
//         "image_cid": result.IpfsHash
//     }
//     //console.log(json);

//     pinata.pinJSONToIPFS(json, options.plantJSON).then((result2) => {
//     console.log(result2);
//     }).catch((err) => {
//         console.log(err);
//     });



//     }).catch(err => {
//         console.log(err)
//     })

// }


