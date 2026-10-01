import fs from 'node:fs';
import path from 'node:path';
import solc from 'solc';
import {fileURLToPath} from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sources = Object.fromEntries(['MessageBoard.sol', 'StudyToken.sol'].map(name => [name, {content:fs.readFileSync(path.join(root,'contracts',name),'utf8')}]));
const input = {
  language:'Solidity', sources,
  settings:{optimizer:{enabled:true,runs:200},evmVersion:'shanghai',outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}
};
const output = JSON.parse(solc.compile(JSON.stringify(input), {import: name => {
  if (!name.startsWith('@openzeppelin/contracts/') || name.includes('..')) return {error:'Unsupported import'};
  try {return {contents:fs.readFileSync(path.join(root,'node_modules',name),'utf8')};}
  catch {return {error:'Import not found: '+name};}
}}));
for (const diagnostic of output.errors ?? []) console.error(diagnostic.formattedMessage);
if ((output.errors ?? []).some(x=>x.severity==='error')) process.exit(1);
fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
for (const name of ['MessageBoard','StudyToken']) {
  const artifact=output.contracts[name+'.sol'][name];
  fs.writeFileSync(path.join(root,'artifacts',name+'.json'),JSON.stringify({contractName:name,compiler:solc.version(),evmVersion:'shanghai',abi:artifact.abi,bytecode:'0x'+artifact.evm.bytecode.object},null,2));
  console.log(`Compiled ${name} with ${solc.version()} · EVM target shanghai`);
}
