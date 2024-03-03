// pages页面下所有页面会自动创建网络路由

import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Link from 'next/link';
import { useState } from 'react';

import { useGlobalContext } from '../context';



export default function Home({ }) {

  const { contract, chainId } = useGlobalContext();
  const [count, setCount] = useState(0);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="flex flex-col items-center">
        <div className='shadow-lg rounded-lg p-4 max-w-lg sm:w-3/4 my-4'>
          The contract deployed on Sepolia testnet,and the chainId is 11155111.<br />
          <Link href={"https://sepolia.etherscan.io/address/0x5bD89d1E744072882489cf0E5f66a377c6b77b53"}>
            <p className='text-blue-600'>Click here to go to the smart contract address.</p>
          </Link>
          Your current chainId is {chainId}
        </div>
        <div className='p-4 flex items-center font-semibold shadow-lg rounded-lg max-w-lg sm:w-3/4 my-4'>
          <div className='w-48 h-6 mx-2 rounded-full flex justify-items-center align-middle'>
            Your number is {count}
          </div>
          <button className='bg-blue-100 rounded-full w-40 h-12 text-blue-600 shadow p-2'
            onClick={async () => {
              const bigNumber = await contract.getNumber();
              setCount(parseInt(bigNumber._hex, 16));
            }}>getNumber</button>
        </div>
        <div className='p-4 shadow-lg rounded-lg max-w-lg sm:w-3/4 my-4 flex flex-row'>
          <input className='w-48 h-12 mx-2 rounded-full flex justify-items-center'
            type="number" id="numberInput" placeholder="Please enter a number" />
          <button className='bg-blue-100 rounded-full w-40 h-12 text-blue-600 shadow p-2'
            onClick={async () => {
              const inputNumber = document.getElementById('numberInput').value;
              console.log(await contract.setNumber(inputNumber))
            }}>setNumber</button>
        </div>
      </div>
    </Layout >
  );
}