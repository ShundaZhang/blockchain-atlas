# -*- coding: utf-8 -*-
from diagram_core import node,arrow,flow,frame
from catalog import SOURCES

def diagram(ident,lang):
    if ident in ('scaling','scale-proofs','ln-channel','ln-htlc','scale-updates'):
        from scaling_diagrams import diagram as scaling_diagram
        return scaling_diagram(ident,lang)
    t=lambda en,zh:zh if lang=='zh' else en
    data={
    'state':('An ordered transition is replayed by many nodes','多个节点重放有序状态转换','eth-blocks',[
        ('Signed request','签名请求','Who authorizes what?','谁授权什么？'),('Block order','区块排序','Which requests execute first?','请求按什么顺序执行？'),('Validation + execution','验证 + 执行','Each node applies the rules','各节点应用规则'),('New state','新状态','Same valid input → same result','相同有效输入 → 相同结果')]),
    'history':('Capabilities accumulate across different designs','能力在不同设计中积累','eth-history',[
        ('1990s','1990 年代','Timestamping + digital cash research','时间戳 + 数字现金研究'),('2008 / 2009','2008 / 2009','Bitcoin proposal + network','Bitcoin 提案 + 网络'),('2015','2015','Ethereum programmable state','Ethereum 可编程状态'),('2022 onward','2022 年后','PoS Ethereum + evolving rollups','PoS Ethereum + 持续发展 Rollup')]),
    'ideas':('Authority exists at more than one layer','权力存在于不止一个层次','web3',[
        ('Issuance rules','发行规则','Who creates the asset?','谁创建资产？'),('Validation','验证','Who accepts the history?','谁接受历史？'),('Custody','托管','Who can authorize transfers?','谁能授权转移？'),('Governance','治理','Who can change the system?','谁能改变系统？')]),
    'cryptography':('Commitments need an accepted root','承诺需要被接受的根','bitcoin-guide',[
        ('Transactions','交易','Encoded bytes, not human labels','编码字节，不是人类标签'),('Merkle commitment','Merkle 承诺','Compact proof relative to a root','相对根的紧凑证明'),('Block header','区块头','Links to prior history','链接到此前历史'),('Accepted history','被接受历史','Consensus / validation / finality','共识 / 验证 / 最终性')]),
    'consensus':('Three checks for one proposed block','一个提议区块的三项检查','consensus',[
        ('Valid?','有效？','Execution rules and signatures','执行规则及签名'),('Chosen?','被选择？','Fork choice among valid histories','在有效历史中进行分叉选择'),('Final?','最终确认？','Protocol-specific settlement condition','协议特定结算条件')]),
    'bitcoin':('A UTXO transaction creates recipient and change outputs','UTXO 交易创建接收及找零输出','bitcoin-tx',[
        ('Input','输入','0.5000 BTC unspent output','0.5000 BTC 未花费输出'),('Recipient','接收方','0.2000 BTC new output','0.2000 BTC 新输出'),('Change + fee','找零 + 费用','0.2999 BTC change / 0.0001 BTC fee','0.2999 BTC 找零 / 0.0001 BTC 费用')]),
    'ethereum':('Different state domains share one execution context','不同状态域共享执行上下文','evm',[
        ('User account','用户账户','ETH + nonce + authorization','ETH + Nonce + 授权'),('EVM call','EVM 调用','Code + calldata + gas','代码 + Calldata + Gas'),('Contract storage','合约存储','Message / balances / allowances','消息 / 余额 / 授权额度'),('Receipt','回执','Status + gas used + logs','状态 + Gas 使用 + 日志')]),
    'transactions':('From intent to settlement','从意图到结算','eth-tx',[
        ('Construct + sign','构建 + 签名','Chain, nonce, destination, limits','链、Nonce、目的地、限制'),('Broadcast','广播','RPC + peer propagation','RPC + 对等传播'),('Include + execute','包含 + 执行','Receipt can report a revert','回执可报告回滚'),('Confirm / finalize','确认 / 最终确认','Consensus property, not just a hash','共识属性，不只是哈希')]),
    'contracts':('A contract has an input boundary','合约具有输入边界','oracles',[
        ('On-chain state','链上状态','Available to deterministic code','确定性代码可读取'),('Contract execution','合约执行','Rules transform inputs into state','规则将输入转换为状态'),('Off-chain oracle','链下预言机','Must explicitly submit data','必须明确提交数据')]),
    'solidity':('Deployment fixes the initial authority','部署确定初始权限','solidity',[
        ('Constructor','构造函数','owner = deployer / initial message','owner = 部署者 / 初始消息'),('Caller check','调用者检查','Only owner may setMessage','只有 owner 能 setMessage'),('State + event','状态 + 事件','Write text and emit MessageChanged','写文字并发出 MessageChanged'),('Other caller','其他调用者','NotOwner → state unchanged','NotOwner → 状态不变')]),
    'token':('Fixed supply and allowance are different state','固定供应与授权是不同状态','erc20',[
        ('Deploy','部署','Mint 1,000,000 STUDY once','一次铸造 1,000,000 STUDY'),('Balance','余额','Ownership recorded in contract','持有量记录在合约'),('Approve','授权','Spender may spend up to 10','花费方最多花费 10'),('transferFrom','授权转移','Spend 4 → ordinary allowance 6','花费 4 → 普通额度剩 6')]),
    'stablecoins':('A reserve-backed stablecoin spans two systems','储备担保稳定币跨越两个系统','tether-reserves',[
        ('On-chain token','链上代币','Balances, transfers and issuer powers','余额、转移及发行方权限'),('Issuer boundary','发行方边界','Issue / redeem under terms','按条款发行 / 赎回'),('Off-chain reserves','链下储备','Assets, custody and disclosures','资产、托管及披露')]),
    'defi':('A DeFi application is a dependency graph','DeFi 应用是一张依赖图','aave',[
        ('Wallet + approvals','钱包 + 授权','User’s authorization surface','用户授权面'),('Protocol / vault','协议 / 金库','Strategy and accounting code','策略及账务代码'),('Dependencies','依赖','Token + oracle + lending / DEX','代币 + 预言机 + 借贷 / DEX'),('Control + exit','控制 + 退出','Upgrade keys and withdrawal path','升级密钥及提现路径')]),
    'scaling':('Rollup execution needs a settlement and data path','Rollup 执行需要结算及数据路径','scaling',[
        ('L2 execution','L2 执行','Sequencer orders user requests','排序器安排用户请求'),('Data + commitment','数据 + 承诺','Required inputs become available','所需输入变得可用'),('L1 verification','L1 验证','Fault / validity proof mechanism','故障 / 有效性证明机制'),('Withdrawal','提现','Check enforcement during failure','检查故障时执行保障')]),
    'applications':('A real-world claim crosses a trust boundary','现实主张跨越信任边界','oracles',[
        ('World','现实世界','Invoice / object / sensor event','发票 / 物品 / 传感器事件'),('Input authority','输入权威','Who signs or checks the statement?','谁签名或检查陈述？'),('Chain record','链记录','Commits to submitted data','承诺提交数据'),('Reader','读者','Still evaluates source truth','仍须评估来源真实性')]),
    'security':('Review each authority and dependency','检查每项权限及依赖','security',[
        ('User signature','用户签名','Exact request, not just valid bytes','精确请求，不只是有效字节'),('Contract rules','合约规则','Access control and call graph','访问控制及调用图'),('External inputs','外部输入','Oracle, token and bridge behavior','预言机、代币及桥行为'),('Upgrade control','升级控制','Who can replace the rules?','谁能替换规则？')]),
    'practice':('Run locally before a public-testnet workflow','公开测试网流程前先本地运行','local-node',[
        ('Source + pins','源码 + 固定版本','Solidity / library / compiler target','Solidity / 库 / 编译目标'),('Compile','编译','ABI + bytecode','ABI + 字节码'),('Local chain','本地链','31337 / loopback / demo accounts','31337 / 本机 / 演示账户'),('Check behavior','检查行为','Success + rejection + state','成功 + 拒绝 + 状态')])}
    en,zh,ref,items=data[ident]
    if ident in ('ideas','consensus','bitcoin','contracts','stablecoins'):
        body='<div class="viz-three">'+''.join(node(t(a,b),t(c,d),'neutral') for a,b,c,d in items)+'</div>'
    else:
        parts=[]
        for i,(a,b,c,d) in enumerate(items):
            if i:parts.append(arrow())
            parts.append(node(t(a,b),t(c,d),'protected' if i==len(items)-1 else 'neutral'))
        body=flow(parts)
    captions={
    'bitcoin':t('Hypothetical accounting example. Outputs plus fee equal the input; the fee is not another recipient output.','假设账务例子。输出加费用等于输入，费用不是另一个接收输出。'),
    'solidity':t('The owner path and rejected-caller path are alternatives, not one sequential successful call.','所有者路径与拒绝路径是分支，并非同一次成功调用的顺序步骤。'),
    'contracts':t('Parallel boxes show an input boundary. Off-chain data requires an explicit mechanism; the contract does not browse the web.','并列框显示输入边界。链下数据需要明确机制，合约不会浏览网页。')}
    caption=captions.get(ident,t('Original teaching diagram. Details vary by protocol and deployment; arrows illustrate responsibility or data flow, not a universal implementation.','原创教学图。细节随协议及部署变化，箭头表示职责或数据流，并非通用实现。'))
    return frame(lang,'viz-'+ident,t(en,zh),body,caption,SOURCES[ref][2],SOURCES[ref][0])
