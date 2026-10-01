import {formatUnits,parseUnits} from 'ethers';
import {localProvider,deploy} from './local.mjs';
const provider=await localProvider();
try {
  const alice=await provider.getSigner(0),bob=await provider.getSigner(1),spender=await provider.getSigner(2);
  const a=await alice.getAddress(),b=await bob.getAddress(),s=await spender.getAddress();
  const board=await deploy('MessageBoard',alice,['Hello, local EVM']);
  await (await board.setMessage('Solidity stores state')).wait();
  const token=await deploy('StudyToken',alice,[a]);
  const decimals=await token.decimals();
  await (await token.transfer(b,parseUnits('25',decimals))).wait();
  await (await token.approve(s,parseUnits('10',decimals))).wait();
  await (await token.connect(spender).transferFrom(a,b,parseUnits('4',decimals))).wait();
  console.log('Local chain ID:',String((await provider.getNetwork()).chainId));
  console.log('MessageBoard:',await board.getAddress(),'message:',await board.message());
  console.log('StudyToken:',await token.getAddress());
  console.log('Supply:',formatUnits(await token.totalSupply(),decimals),'STUDY');
  console.log('Bob balance:',formatUnits(await token.balanceOf(b),decimals),'STUDY');
  console.log('Remaining allowance:',formatUnits(await token.allowance(a,s),decimals),'STUDY');
  console.log('No listing, price, backing or real value is created by this demo.');
} finally {provider.destroy();}
