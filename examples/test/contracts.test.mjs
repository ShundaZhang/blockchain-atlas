import test from 'node:test';
import assert from 'node:assert/strict';
import {parseUnits,ZeroAddress} from 'ethers';
import {localProvider,deploy,artifact} from '../scripts/local.mjs';

async function rejectedCall(contract,signer,method,args,errorName) {
  const request={to:await contract.getAddress(),from:await signer.getAddress(),data:contract.interface.encodeFunctionData(method,args)};
  // With the teaching node's throwOnCallFailures=false, eth_call returns revert bytes.
  const bytes=await signer.provider.send('eth_call',[request,'latest']);
  assert.equal(contract.interface.parseError(bytes)?.name,errorName);
  const tx=await signer.sendTransaction({...request,gasLimit:200000n});
  await assert.rejects(tx.wait(),error=>error.receipt?.status===0);
}

test('MessageBoard access control, state, event and rejected mutation',async()=>{
  const provider=await localProvider();
  try {
    const owner=await provider.getSigner(0),other=await provider.getSigner(1);
    const address=await owner.getAddress();
    const board=await deploy('MessageBoard',owner,['Initial']);
    assert.equal(await board.owner(),address);
    assert.equal(await board.message(),'Initial');
    const receipt=await (await board.setMessage('Updated')).wait();
    assert.equal(await board.message(),'Updated');
    const event=receipt.logs.map(log=>{try{return board.interface.parseLog(log);}catch{return null;}}).find(x=>x?.name==='MessageChanged');
    assert.ok(event);assert.equal(event.args.author,address);assert.equal(event.args.newMessage,'Updated');
    await rejectedCall(board,other,'setMessage',['Unauthorized'],'NotOwner');
    assert.equal(await board.message(),'Updated');
  } finally {provider.destroy();}
});

test('StudyToken supply, units, transfers, allowance and failure paths',async()=>{
  const provider=await localProvider();
  try {
    const alice=await provider.getSigner(0),bob=await provider.getSigner(1),spender=await provider.getSigner(2);
    const a=await alice.getAddress(),b=await bob.getAddress(),s=await spender.getAddress();
    const token=await deploy('StudyToken',alice,[a]);
    assert.equal(await token.name(),'Study Token');assert.equal(await token.symbol(),'STUDY');assert.equal(await token.decimals(),18n);
    const supply=parseUnits('1000000',18);
    assert.equal(await token.totalSupply(),supply);assert.equal(await token.balanceOf(a),supply);
    await (await token.transfer(b,parseUnits('25',18))).wait();
    assert.equal(await token.balanceOf(b),parseUnits('25',18));
    await (await token.approve(s,parseUnits('10',18))).wait();
    await (await token.connect(spender).transferFrom(a,b,parseUnits('4',18))).wait();
    assert.equal(await token.allowance(a,s),parseUnits('6',18));
    assert.equal(await token.balanceOf(b),parseUnits('29',18));
    assert.equal((await token.balanceOf(a))+(await token.balanceOf(b)),supply);
    assert.equal(await token.totalSupply(),supply);
    await rejectedCall(token,spender,'transferFrom',[a,b,parseUnits('7',18)],'ERC20InsufficientAllowance');
    await rejectedCall(token,bob,'transfer',[a,parseUnits('30',18)],'ERC20InsufficientBalance');
    await rejectedCall(token,alice,'transfer',[ZeroAddress,1n],'ERC20InvalidReceiver');
    await assert.rejects(deploy('StudyToken',alice,[ZeroAddress]));
    assert.ok(!artifact('StudyToken').abi.some(x=>x.type==='function'&&['mint','upgradeTo','setFee'].includes(x.name)));
    assert.equal(await token.allowance(a,s),parseUnits('6',18));
    assert.equal(await token.balanceOf(b),parseUnits('29',18));
  } finally {provider.destroy();}
});
