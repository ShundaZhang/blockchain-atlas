const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
function runtime(lang){
  const nodes=new Map();let click;
  const el=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',dataset:{}});return nodes.get(id);};
  const document={documentElement:{lang},getElementById:el,addEventListener:(_,fn)=>{click=fn;}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/labs.js','utf8'),{document,crypto:webcrypto,TextEncoder,Uint8Array,JSON,Object,Number,Math,BigInt});
  const run=action=>click({target:{closest:()=>({dataset:{action}})}});
  return {el,run};
}
(async()=>{
  let checks=0;
  for(const lang of ['en','zh-CN']){
    const {el,run}=runtime(lang),set=(id,value)=>{el(id).value=value;};
    set('chain-message','Alice pays Bob 5');set('chain-mode','keep');await run('chain');assert.equal(el('chain-state').dataset.pass,'info');checks++;
    set('chain-message','Alice pays Bob 50');await run('chain');assert.equal(el('chain-state').dataset.pass,'false');checks++;
    set('chain-mode','rebuild');await run('chain');assert.equal(el('chain-state').dataset.pass,'info');assert.ok(el('chain-output').textContent.includes('Alice pays Bob 50'));checks++;
    set('allowance-balance','20');set('allowance-limit','10');set('allowance-spend','4');await run('allowance');assert.equal(el('allowance-state').dataset.pass,'true');assert.ok(el('allowance-output').textContent.includes('16'));assert.ok(el('allowance-output').textContent.includes('6'));checks++;
    set('allowance-spend','11');await run('allowance');assert.equal(el('allowance-state').dataset.pass,'false');assert.ok(el('allowance-output').textContent.includes('20'));checks++;
    set('allowance-balance','3');set('allowance-spend','4');await run('allowance');assert.equal(el('allowance-state').dataset.pass,'false');checks++;
    set('allowance-spend','0');await run('allowance');assert.equal(el('allowance-state').dataset.pass,'true');checks++;
    for(const invalid of ['','-1','1.5','1e2']){set('allowance-spend',invalid);await run('allowance');assert.equal(el('allowance-state').dataset.pass,'false');checks++;}
    set('allowance-spend','4');set('allowance-limit',String((1n<<256n)-1n));await run('allowance');assert.equal(el('allowance-state').dataset.pass,'false');checks++;
    set('amm-x','100');set('amm-y','10000');set('amm-input','10');set('amm-min','900');set('amm-fee','0.003');await run('amm');assert.equal(el('amm-state').dataset.pass,'true');assert.ok(el('amm-output').textContent.includes('906.610894'));assert.ok(el('amm-output').textContent.includes('110.000000'));checks++;
    set('amm-fee','0');await run('amm');assert.ok(el('amm-output').textContent.includes('909.090909'));checks++;
    set('amm-min','950');await run('amm');assert.equal(el('amm-state').dataset.pass,'false');assert.ok(el('amm-output').textContent.includes('100.000000'));assert.ok(el('amm-output').textContent.includes('10000.000000'));checks++;
    set('amm-x','0');await run('amm');assert.equal(el('amm-state').dataset.pass,'false');checks++;
    set('amm-x','');await run('amm');assert.equal(el('amm-state').dataset.pass,'false');checks++;
  }
  console.log(`PASS: ${checks} browser-model acceptance cases in English and Chinese`);
})().catch(error=>{console.error(error);process.exitCode=1;});
