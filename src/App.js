import { useEffect, useState } from 'react';
import './App.css';
import config from './config.json'
import axios from 'axios';
import loadingGif from './assets/loadingPixels.gif'
import Hill from './Hill';
import flower from './assets/introflower128.png'

function App() {

  const [loading, setLoading] = useState(1);
  const [microLoading, setmicroLoading] = useState(0);
  const [init, setInit] = useState(0);
  const [contract, setContract] = useState();
  const [minter, setMinter] = useState();
  const [account, setAccount] = useState();
  const [zilWallet, setZilWallet] = useState();
  const [btnLabel, setBtnLabel] = useState('Connect Wallet');
  const [metaArr, setMetaArray] = useState([]);
  const [dataLoaded, setDataLoaded] = useState();
  const [claimAvailable, setClaimAvailable] = useState();


  useEffect(() => {
    window.onload = () => {
      if (typeof window.zilPay !== 'undefined') {
        setZilWallet(window.zilPay)
        setLoading(0);
      }
      else{
        //alert('')
        if (window.confirm('ZilPay wallet, which is required to use this dapp, is not installed! Download it from Chrome Web Store. Clicking "Ok" will redirect you to download page.')) {
          window.location.href='https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd';
        };
      }
    }
  }, [])


  useEffect(() => {
    if(contract !== undefined){
      (async() => {
      const { token_uris} = await contract.getSubState('token_uris');
      const { token_owners } = await contract.getSubState('token_owners')

      const arr = []

        const owners = Object.entries(token_owners)
        const uris = Object.entries(token_uris);

        for(var i=0; i<owners.length; i++){
          if(owners[i][1] === account.base16.toLowerCase()) axios.get(uris[i][1]).then(res => arr.push(res.data))
        }
        setMetaArray(arr)
      })()
    }
  }, [contract])

  useEffect(() => {
    var interval;
    function loadArr(){
      if(typeof metaArr[0] !== 'undefined'){
        //console.log(metaArr)
        setDataLoaded(1)
        setmicroLoading(0)
        clearInterval(interval)
      }
    }
    interval = setInterval(loadArr, 1000) 
  }, [metaArr])

  useEffect(() => {
    if(minter !== undefined){
      (async() => {
        const state = await minter.getState()
        if(state.mintCount === state.urisCount){
          setClaimAvailable(0)
        } 
        else{
          const arr = Object.entries(state.tokensClaimed);
          const found = arr.find(element => element[0] === account.base16.toLowerCase())
          if(found[1] == "2") setClaimAvailable(0)
          if(found[1] !== "2") setClaimAvailable(1)
        }
      })()
    }
  })

  async function claim(){
    if(minter !== undefined){
      const gasPrice = zilWallet.utils.units.toQa('1000', zilWallet.utils.units.Units.Li)
      const amount = zilWallet.utils.units.toQa(1, zilWallet.utils.units.Units.Zil);
      const tx = await minter.call(
        'Mint',
        [],
        {
          amount,
          gasPrice,
          gasLimit: zilWallet.utils.Long.fromNumber(9000)
        },
        true
      )
      console.log(tx);
    }
  }


  async function activate(){
    
      if(init === 0){
      setmicroLoading(1)
      await zilWallet.wallet.connect()
      if(zilWallet.wallet.net === config.network){
        const _account = zilWallet.wallet.defaultAccount;
        const _accountBech32 = _account.bech32;
        const _contract = await zilWallet.contracts.at(config.contract_address)
        const _minter = await zilWallet.contracts.at(config.minter_address)
        setAccount(_account);
        setBtnLabel(_accountBech32);
        setInit(1);
        setContract(_contract);
        setMinter(_minter)
      }
      else{
        alert(`You are connected to wrong network. Use ${config.network} instead!`)
      }
    }

  }

  if(loading === 0){
    return (
      <div className="App">
        <div className="top-bar">

      
          <div className="title"><a className="text" href="./">ZilGarden</a></div>
          
          {init=== 1 &&
          <div className="address">{account.bech32}</div>
          }

          {init === 0 &&
            <button onClick={() => activate()} className="connectBtn"></button>
          }
          {(init === 1 && claimAvailable === 1) &&
            <button onClick={() => claim()}className="claimBtn"></button>
          }
          {(init === 1 && claimAvailable === 0) &&
            <button title="Claiming is not available now :(" className="claimBtnBlocked"></button>
          }
          
        </div>
  
      {microLoading === 1 &&
      <div><img alt="Loading..." className="loadingGif" src={loadingGif}></img></div>
      }
     
     
      {/* <RenderImages></RenderImages> */}
      {dataLoaded === 1 &&
        <div className="canvasDiv">
        <Hill data={metaArr}/>
        </div>
      }
      {init === 0 &&
        <div className="welcome">
          <h1 className="mainmsg">Hello gardener!</h1>
          <p className="para">We invite you to collect beautiful pixel art flowers represented by NFT. All you need to do is to connect your wallet and claim them, as long as they are available. Every address can claim maximum 2 flowers. Happy gardening!</p>
          <img className="flower" src={flower}></img>
        </div>
      }

      

        

      </div>
    )
  }
  if(loading === 1){
    return (
      <div className="loadingDiv">
        <h1 className="pageLoadingTitle">Loading...</h1>
      </div>
    )
  }
}

export default App;
