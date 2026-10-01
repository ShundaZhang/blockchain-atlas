import fs from 'node:fs';
import {ContractFactory,JsonRpcProvider} from 'ethers';

export async function localProvider() {
  // Deliberately no configurable public RPC, private key or browser wallet.
  const provider=new JsonRpcProvider('http://127.0.0.1:8545');
  const network=await provider.getNetwork();
  if (network.chainId!==31337n) throw new Error('Expected local development chain 31337');
  return provider;
}
export function artifact(name) {
  return JSON.parse(fs.readFileSync(new URL(`../artifacts/${name}.json`,import.meta.url),'utf8'));
}
export async function deploy(name,signer,args=[]) {
  const a=artifact(name);
  const contract=await new ContractFactory(a.abi,a.bytecode,signer).deploy(...args);
  await contract.waitForDeployment();
  return contract;
}
