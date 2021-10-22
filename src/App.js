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
  const [availableTokens, setAvailableTokens] = useState();


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
        setAvailableTokens(state.urisCount - state.mintCount);
        if(state.mintCount === state.urisCount){
          setClaimAvailable(0)
        }
        else{
          const arr = await Object.entries(state.tokensClaimed);
          const found = arr.find(element => element[0] === account.base16.toLowerCase())
          if(found === undefined) setClaimAvailable(1)
          else{
            if(found[1] == "2") setClaimAvailable(0)
            if(found[1] !== "2") setClaimAvailable(1)
          }
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

          <div className="titleDiv">
          <div className="title"><a className="text" href="./">ZilGarden</a></div>
          </div>
          
          {init=== 1 &&
          <div className="address">{account.bech32}&nbsp;&nbsp;&nbsp;&nbsp;<u>Tokens available: {availableTokens}</u></div>
          }

          {init===0 &&
          <div></div>
          }

          {init === 0 &&
            <div className="connectBtnDiv">
            <button onClick={() => activate()} className="connectBtn"></button>
            </div>
          }
          {(init === 1 && claimAvailable === 1) &&
            <div className="connectBtnDiv">
            <button onClick={() => claim()}className="claimBtn"></button>
            </div>
          }
          {(init === 1 && claimAvailable === 0) &&
            <div className="connectBtnDiv">
            <button title="Claiming is not available now :(" className="claimBtnBlocked"></button>
            </div>
          }
          
        </div>
  
      {microLoading === 1 &&
      <div>
        <img alt="Loading..." className="loadingGif" src={loadingGif}></img>
        <p className="info">If loading too long, it means that you haven't got any plants :(</p>
        <p className="info">You can claim them by clicking button in right top corner ;)</p>
      </div>
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
          <p className="para">We invite you to collect beautiful pixel art flowers NFTs. If tokens are available, all you have to do is to connect your wallet and click CLAIM button. Every address is allowed to claim maximum 2 flowers. Happy gardening!</p>
          <img className="flower" src={flower}></img>
          <br />
          <p>Links:</p>
          <a className="link" href="https://github.com/el-tumero/ZilGarden">Github</a>
          <a className="link" href="https://t.me/el_tumero">Telegram</a>
          <a className="link" href="https://www.youtube.com/watch?v=e3Rmk7viv_Q&ab_channel=tumer">Demo</a>
          <p>made by el-tumero</p>
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
