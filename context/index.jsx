import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ABI, ADDRESS } from '../contract';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(0);

  //* 获取地址
  const updateCurrentWalletAddress = async () => {
    const accounts = await window?.ethereum?.request({ method: 'eth_requestAccounts' });
    if (accounts) setWalletAddress(accounts[0]);
  };

  // 更换chain
  const switchChain = async () => {
    const currentChainId = await window?.ethereum?.request({ method: 'eth_chainId' });
    console.log(`当前chainId:${currentChainId}`);
    if (currentChainId !== "0xaa36a7") {
      await window?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        // params: [{ chainId: '0xaa36a7' }]
        params: [{ chainId: '0xaa36a7' }]
      })
    }
  };

  const setSmartContractAndProvider = async () => {
    updateCurrentWalletAddress();
    switchChain();
    const newChainId = await window?.ethereum?.request({ method: 'eth_chainId' });
    if (newChainId) setChainId(parseInt(newChainId, 16));
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      // 请求用户授权连接到其钱包
      try {
        const signer = newProvider.getSigner();
        // 在这里可以执行与用户钱包交互的操作
        const newContract = new ethers.Contract(ADDRESS, ABI, signer);
        setContract(newContract);
        console.log('授权成功');
      } catch (e) {
        console.error('授权失败:', e);
      };
    } else {
      console.error('未检测到区块链钱包');
    }
  }

  // 每次打开页面更新钱包
  useEffect(() => {
    setSmartContractAndProvider();

    window?.ethereum?.on('chainChanged', setSmartContractAndProvider);
    window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        provider,
        chainId,
        walletAddress,
        setSmartContractAndProvider,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
