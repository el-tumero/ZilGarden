import { useEffect, useState } from 'react';
import './App.css';
import config from './config.json'
import axios from 'axios';
import loadingGif from './loading.gif'
//import connectBtn from './connectbtn.png'
import Hill from './Hill';

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


  useEffect(() => {
    window.onload = () => {
      if (typeof window.zilPay !== 'undefined') {
        setZilWallet(window.zilPay)
        setLoading(0);
      }
      else{
        alert('ZilPay Wallet is not installed!')
      }
    }
  }, [])


  useEffect(() => {
    if(contract !== undefined){
      (async() => {
      const { token_uris} = await contract.getSubState('token_uris');
      const { token_owners } = await contract.getSubState('token_owners')

      const arr = []

        const keys = Object.keys(token_owners)
    
        for(var i=3; i<keys.length+3; i++){
          if(token_owners[i] === account.base16.toLowerCase()) axios.get(token_uris[i]).then(res => arr.push(res.data))
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

      
          <div className="title">ZilGarden</div>
          
          {init=== 1 &&
          <div className="address">{account.bech32}</div>
          }

          {init === 0 &&
            <button onClick={() => activate()} className="connectBtn"></button>
          }
          {init === 1 &&
            <button onClick={() => claim()}className="claimBtn"></button>
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

      

        

      </div>
    )
  }
  if(loading === 1){
    return (
      <div>
        <h1 className="pageLoadingTitle">Loading...</h1>
      </div>
    )
  }
}

export default App;
