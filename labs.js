(() => {
  'use strict';
  const zh=document.documentElement.lang.startsWith('zh');
  const t=(en,cn)=>zh?cn:en;
  const el=id=>document.getElementById(id);
  const show=(id,status,pass,output)=>{
    el(id+'-state').textContent=status;
    el(id+'-state').dataset.pass=pass;
    el(id+'-output').textContent=output;
  };
  const hash=async block=>{
    const bytes=new TextEncoder().encode(JSON.stringify(block));
    const digest=await crypto.subtle.digest('SHA-256',bytes);
    return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
  };
  const chainFor=async payload=>{
    const blocks=[];let prior='0'.repeat(64);
    for(const [index,text] of [payload,'Bob pays Carol 2','Carol keeps the remainder'].entries()){
      const block={index,payload:text,previous:prior};
      const digest=await hash(block);blocks.push({...block,digest});prior=digest;
    }
    return blocks;
  };
  const actions={
    async chain(){
      const original=await chainFor('Alice pays Bob 5');
      const payload=el('chain-message').value;
      const rebuild=el('chain-mode').value==='rebuild';
      const blocks=rebuild?await chainFor(payload):original.map(x=>({...x}));
      if(!rebuild){blocks[0].payload=payload;blocks[0].digest=await hash({index:0,payload,previous:blocks[0].previous});}
      const valid=blocks.every((b,i)=>i===0||b.previous===blocks[i-1].digest);
      const lines=blocks.map((b,i)=>t(`Block ${i+1}: ${b.payload}`,`区块 ${i+1}：${b.payload}`)+`\nprevious: ${b.previous}\ndigest:   ${b.digest}\n`);
      show('chain',valid?t('Hash references consistent; no consensus checked','哈希引用一致；未检查共识'):t('Broken reference after the changed first block','改变第一区块后引用断裂'),valid?'info':'false',lines.join('\n')+'\n'+t('A rebuilt toy history can be internally consistent. This does not prove authorization, valid balances, proof of work or finality.','重建玩具历史可以内部一致，但不证明授权、有效余额、工作量证明或最终性。'));
    },
    allowance(){
      const texts=['allowance-balance','allowance-limit','allowance-spend'].map(id=>el(id).value.trim());
      if(texts.some(x=>!/^\d+$/.test(x))){show('allowance',t('Use nonnegative integers written as digits','请使用以数字书写的非负整数'),'false','');return;}
      const [balance,limit,spend]=texts.map(BigInt);
      const max=(1n<<256n)-1n;
      if([balance,limit,spend].some(x=>x>max)||limit===max){show('allowance',t('Use uint256 values with an ordinary finite allowance','请使用 uint256 范围及普通有限授权'),'false',t('The model intentionally excludes the special maximum-allowance convention.','模型明确不包含最大额度的特殊约定。'));return;}
      const allowed=spend<=balance&&spend<=limit;
      show('allowance',allowed?t('Transfer permitted by both checks','余额及授权检查均允许转移'):t('Transfer rejected; state unchanged','转移被拒绝；状态不变'),allowed?'true':'false',t(`Owner balance: ${allowed?balance-spend:balance}\nRecipient increase: ${allowed?spend:0n}\nRemaining allowance: ${allowed?limit-spend:limit}`,`所有者余额：${allowed?balance-spend:balance}\n接收方增加：${allowed?spend:0n}\n剩余额度：${allowed?limit-spend:limit}`)+'\n\n'+(spend>limit?t('Requested amount exceeds authorization.','请求数量超过授权。'):'')+(spend>balance?t(' Requested amount exceeds balance.',' 请求数量超过余额。'):''));
    },
    amm(){
      const texts=['amm-x','amm-y','amm-input','amm-min'].map(id=>el(id).value.trim());
      const [x,y,input,min]=texts.map(Number),fee=Number(el('amm-fee').value);
      if(texts.some(x=>!x)||[x,y,input,min].some(x=>!Number.isFinite(x)||x>1e12)||x<=0||y<=0||input<=0||min<0||![0,0.003].includes(fee)){
        show('amm',t('Use positive reserves/input and a nonnegative minimum, all at most 10¹²','请使用正储备 / 输入及非负最小输出，所有数值不超过 10¹²'),'false','');return;
      }
      const effective=input*(1-fee);
      const output=y*(effective/(x+effective));
      const accepted=output>=min;
      const nx=accepted?x+input:x,ny=accepted?y-output:y;
      const spot=y/x,average=output/input;
      const quote=100*(1-average/spot);
      show('amm',accepted?t('Quote meets minimum; model executes','报价满足最小输出；模型执行'):t('Output below minimum; model keeps original reserves','输出低于最小值；模型保留原储备'),accepted?'true':'false',t(`Quoted Y: ${output.toFixed(6)}\nReceived Y: ${accepted?output.toFixed(6):'0'}\nFee retained in X: ${accepted?(input*fee).toFixed(6):'0'}\nNew X: ${nx.toFixed(6)}\nNew Y: ${ny.toFixed(6)}\nInitial spot Y/X: ${spot.toFixed(6)}\nAverage quote Y/X: ${average.toFixed(6)}\nQuote shortfall versus initial spot (includes fee): ${quote.toFixed(4)}%\nInitial k: ${(x*y).toFixed(6)}\nResulting k: ${(nx*ny).toFixed(6)}`,`报价 Y：${output.toFixed(6)}\n收到 Y：${accepted?output.toFixed(6):'0'}\n池保留 X 费用：${accepted?(input*fee).toFixed(6):'0'}\n新 X：${nx.toFixed(6)}\n新 Y：${ny.toFixed(6)}\n初始现价 Y/X：${spot.toFixed(6)}\n平均报价 Y/X：${average.toFixed(6)}\n相对初始现价报价差（含费）：${quote.toFixed(4)}%\n初始 k：${(x*y).toFixed(6)}\n结果 k：${(nx*ny).toFixed(6)}`)+'\n\n'+t('This is an approximate synthetic quote, not a live price or a simulated public transaction.','这是近似合成报价，不是实时价格或公开交易模拟。'));
    }
  };
  document.addEventListener('click',async event=>{
    const button=event.target.closest('[data-action]');
    if(!button||!Object.hasOwn(actions,button.dataset.action))return;
    const id=button.dataset.action;button.disabled=true;
    try{await actions[id]();}
    catch{show(id,t('The local calculation could not complete','本地计算未能完成'),'false',t('The hash lab requires Web Crypto in a modern secure browser context.','哈希练习需要现代安全浏览器环境的 Web Crypto。'));}
    finally{button.disabled=false;}
  });
})();
