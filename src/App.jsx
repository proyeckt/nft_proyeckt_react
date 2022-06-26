
import React from 'react'; 
import { useState, useEffect } from 'react';

import './App.css';

import Web3 from 'web3'; 
import axios from 'axios';

import {NFT_Contract_Address,NFT_ABI} from './NFT_ABI';

// https://docs.openzeppelin.com/contracts/4.x/erc721 

function App() {

  const [ networkID, setnetworkID ] = useState('');
  const [ network, setnetwork ] = useState(''); 
  const [ account, setaccount ] = useState({accountid:'', balanc:''   });

  const [ tokenInput, setTokenInput ] = useState('');
  const [tokenInfo, setTokenInfo] = useState('undefined'); //Json response
  const [imageURL, setImageURL ] = useState('');

  const [ transHash, setTransHash ] = useState('');
  const [ tokenBal, setTokenBal ] = useState(''); 

  // const [ block, setblock ] = useState({});

  let web3 = null;

  const enable = async () => { 
    // window.alert('hello')
    window.location.reload()
    // if (window.ethereum) {
    //   await window.ethereum.send('eth_requestAccounts');
    //   window.web3 = new Web3(window.ethereum);
    //   return true;
    // }
    // await window.ethereum.enable()  

  }

  const loadBlock = async () => {

    try {
      if (window.ethereum != null) {
            web3 = new Web3( window.ethereum );
            console.log('web 3', web3 );
        await window.ethereum.enable();
      } else {
        alert('Please install MetaMask to use this dApp');
        return;
      }

  
  //    const web3 = new Web3 ( Web3.givenProvider || "http://localhost:8545" );
  
      const networktype = await web3.eth.net.getNetworkType(); //Rinkeby
      setnetwork(  networktype ); 
      
      console.log( 'Network is: ', networktype);
  
      const networkID = await web3.eth.net.getId(); 
      setnetworkID( networkID ); 
      
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);

      setaccount({ accountid: accounts[0], bal: balance /1e18 }  );

      const blockinfo = await web3.eth.getBlock('latest');
      console.log('block info: ', blockinfo)

      // setblock( blockinfo ); 

    } catch (error) {
      console.log( error ); 
    }
  
  } 
  
  const getTokenInfo = async () => {

    const { data } = await axios.get( tokenInput )
    console.log('after axios ', data)
    setTokenInfo( data) 
    console.log('data result > ', data.image)
    setImageURL( data.image )
  }

  const handleInput = ( e ) => {
    
    e.preventDefault()
    console.log('event input > ',e.target.value)
    setTokenInput( e.target.value)

  }

  const createNFT = async () => {
    try{
      if(window.ethereum != null){
        web3 = new Web3(window.ethereum);
        console.log('Web3:',web3);
        await window.ethereum.enable();
      }
      else{
        alert('Please install MetaMask to use this dApp');
        return;
      }
      const accounts = await web3.eth.getAccounts();
      console.log('accounts > ',accounts[0]);
      const recipient = accounts[0];

      const tc = new web3.eth.Contract(NFT_ABI,NFT_Contract_Address);
      console.log('token input URI > ',tokenInput);

      const newToken = await tc.methods.createNFT(recipient,tokenInput).send({
        from: accounts[0],
        to: NFT_Contract_Address
        },
        (err,res) => {
          if(err){
            console.log('Create NFT Failed > ',err);
            return;
          }
          else{
            console.log('NFT Created > ',res);
            setTransHash(res);
          }
        }
      );

      const balToken = await tc.methods.balanceOf(recipient).call({
        from:accounts[0],
        to: NFT_Contract_Address
        },
        (err,res) => {
          if(err){
            console.log('Error getting balance: ',err);
            return;
          }
          else{
            console.log('Got bal > ',res);
            setTokenBal(res);
          }
        }
      );
      console.log('New Token > ',newToken);
      console.log('Balance Token > ',balToken);
    }
    catch (err){
      console.log(err);
    }
  }

  useEffect(() => {
    loadBlock(); 
   // eslint-disable-next-line
 }, []);

  if ( typeof tokenInfo  === 'undefined') {
    return 'loading . . .';
  }

  return (
    <div className="App">
      <div className='container'>
        <h2> React / JS / Web3 / MetaMask / BlockChain / Solidity Smart Contracts</h2>
        <p> Net ID: <span style={{color:'orange',fontWeight:'bold'}}>{ networkID }  </span>  </p>
        <p> Net Type: <span style={{color:'orange',fontWeight:'bold'}}>{ network }</span> </p>
        <p> Account: <span className='clearText' > { account.accountid } </span> </p>
        <p> Balance: <span className='clearText'> { account.bal }</span> Ether </p>
        {/* <p> Latest block:  { block } </p> */}
        <div className='btngroup'>
          <button className='btn2' onClick={ () => enable() } > Refresh </button>
          <button className='btn2' onClick={ () => getTokenInfo() } > Get NFT </button>
        </div>

        <input name='meta' onChange={ handleInput } placeholder='Enter NFT metafile IPFS URI ' ></input>

        <div>
          <img  src={imageURL} alt='NFT pic' width='300' height='300' />
        </div>

        <div className='btngroup'>
          <button className='btn2' onClick={() => createNFT()} >Create NFT</button>
        </div>

        {
          transHash === '' ? <p>...</p>
          : ( <div>
                <h2>Success. NFT Token Balance: <span style={{color:'orange',fontWeight:'bold'}}>{tokenBal}</span></h2>
                <h2>Transaction Hash is: {transHash}</h2>
                <p>Please check on Etherscan</p>
              </div>
            )
        }
        
        
      </div>
    </div>
  );
}

export default App;

// https://ethereum.org/en/developers/tutorials/how-to-write-and-deploy-an-nft/

// https://betterprogramming.pub/generate-your-nft-metadata-11a878c082b9

