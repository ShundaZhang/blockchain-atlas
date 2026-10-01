# -*- coding: utf-8 -*-
"""Original native diagrams for the integrated scaling chapter."""
from diagram_core import node,arrow,flow,frame,sequence
from catalog import SOURCES

def diagram(ident,lang):
    t=lambda en,zh:zh if lang=='zh' else en
    def chain(items):return flow([x for i,(a,b) in enumerate(items) for x in ([arrow()] if i else [])+[node(a,b,'neutral')]])
    if ident=='scaling':
        title=t('Execution and settlement live in different domains','执行与结算位于不同域')
        body='<div class="viz-zone"><span class="viz-zone-label">'+t('L2 · execution domain','L2 · 执行域')+'</span>'+chain([(t('User transaction','用户交易'),t('Authorization + chain ID','授权 + Chain ID')),(t('Sequencer / VM','排序器 / VM'),t('Order and execute','排序及执行')),(t('State + receipt','状态 + 回执'),t('An early L2 view','早期 L2 观察'))])+'</div>'
        body+=arrow(t('Batch data + state commitment / proof','批次数据 + 状态承诺 / 证明'),'down')
        body+='<div class="viz-zone"><span class="viz-zone-label">'+t('Ethereum L1 · availability + verification + settlement','Ethereum L1 · 可用性 + 验证 + 结算')+'</span><div class="viz-three">'+node(t('Blobs / calldata','Blob / Calldata'),t('Reconstruction inputs','重建输入'),'neutral')+node(t('Proof / dispute contracts','证明 / 争议合约'),t('Enforce the accepted transition','约束被接受转换'),'protected')+node(t('Bridge / exit contract','桥 / 退出合约'),t('Check withdrawal conditions','检查提现条件'),'protected')+'</div></div>'
        caption=t('Domains and responsibilities, not one synchronous transaction. The exact data/proof and forced-inclusion path depend on the rollup deployment.','显示域及职责，不是单个同步交易。具体数据 / 证明及强制包含路径依 Rollup 部署而异。');ref='op-derivation'
    elif ident=='scale-proofs':
        title=t('A proposed root has two different acceptance paths','提议状态根有两种不同接受路径')
        body=node(t('Proposed transition','提议转换'),'oldRoot → newRoot','neutral')+'<div class="viz-fork"><div class="viz-branch">'+node('Optimistic',t('Assertion + available data','断言 + 可用数据'),'neutral')+arrow(t('Challenge / dispute resolution','挑战 / 争议解决'),'down')+node(t('Accepted claim + maturity','被接受断言 + 成熟时间'),t('Then check bridge finalization','再检查桥完成提现'),'protected')+'</div><div class="viz-branch">'+node(t('Validity proof','有效性证明'),t('Program + public inputs + proof','程序 + 公开输入 + 证明'),'neutral')+arrow(t('L1 verification','L1 验证'),'down')+node(t('Accepted proof + L1 settlement','被接受证明 + L1 结算'),t('Then check bridge finalization','再检查桥完成提现'),'protected')+'</div></div>'
        caption=t('Alternative designs. Neither path makes missing data available, removes upgrade authority, or guarantees instant withdrawals.','两种替代设计。任一路径都不会让缺失数据可用、取消升级权限或保证即时提现。');ref='validity'
    elif ident=='ln-channel':
        title=t('One funded channel, two successive balance states','一个已注资通道，两个连续余额状态')
        body=node(t('Bitcoin funding output','Bitcoin 注资输出'),'100,000 sat','protected')
        for label,a,b in [(t('State 0 · before payment','状态 0 · 支付前'),80,20),(t('State 1 · after Alice pays Bob 15,000 sat','状态 1 · Alice 支付 Bob 15000 sat 后'),65,35)]:
            body+='<div class="viz-lane"><span class="viz-lane-label">'+label+'</span><div class="channel-balance" role="img" aria-label="'+f'Alice {a*1000} sat; Bob {b*1000} sat'+'"><span style="width:'+str(a)+'%">Alice<br>'+f'{a*1000:,} sat'+'</span><span style="width:'+str(b)+'%">Bob<br>'+f'{b*1000:,} sat'+'</span></div></div>'
        body+='<div class="viz-strip">'+t('New signed commitments + revocation of prior state; no new Bitcoin block for each ordinary channel payment','签署新承诺 + 撤销旧状态；每笔普通通道支付无需新 Bitcoin 区块')+'</div>'
        caption=t('Idealized accounting example, excluding fees, reserves, dust and pending HTLCs. Both balance states have the same 100,000-sat backing.','理想化账务例子，省略费用、储备、粉尘及待决 HTLC。两次余额状态均由相同的 100000 sat 提供资金基础。');ref='bolt3'
    elif ident=='ln-htlc':
        title=t('Two-hop conditional payment and backward fulfillment','两跳条件支付与向后履约')
        actors=[('Alice',t('Payer','付款方'),'neutral'),('Bob',t('Router · hypothetical 2-sat fee','路由器 · 假设费用 2 sat'),'neutral'),('Carol',t('Receiver holds r','接收方持有 r'),'protected')]
        messages=[(2,0,t('Invoice gives H=SHA256(r), not r','发票提供 H=SHA256(r)，不提供 r')),(0,1,'HTLC: H / 10,002 sat / expiry 300'),(1,2,'HTLC: H / 10,000 sat / expiry 280'),(2,1,t('Reveal r to fulfill','揭示 r 履约')),(1,0,t('Use the same r upstream','向上游使用相同 r'))]
        body=sequence(lang,actors,messages)
        caption=t('Synthetic amounts and block-height deadlines, not recommended network parameters. The upstream deadline is later so Bob has time to enforce its claim. Onion packets and commitment exchanges are omitted.','合成金额及区块高度期限，不是网络参数建议。上游期限较晚，为 Bob 执行权利保留时间。省略洋葱包及承诺交换。');ref='bolt4'
    elif ident=='scale-updates':
        title=t('Deployed mechanisms versus the next test milestone','已部署机制与下一测试进展')
        body='<div class="viz-path-list">'
        for box_title,text,tone in [('2024 · Dencun',t('Blob publication path','Blob 发布路径'),'protected'),('2025 · Pectra / Fusaka',t('EOA delegation; PeerDAS availability sampling','EOA 委托；PeerDAS 可用性采样'),'protected'),('2026-06 · Taproot Assets v0.8',t('Asset SDK, recovery and edge-node improvements','资产 SDK、恢复及边缘节点改进'),'protected'),('2026-10-06 · Glamsterdam / Sepolia',t('Scheduled testnet activation · mainnet date undecided','计划测试网激活 · 主网日期未确定'),'outside')]:body+=node(box_title,text,tone)
        body+='</div>';caption=t('Snapshot reviewed 1 Oct 2026. The last box is a future test event, not a deployed mainnet feature. See the dated announcements in the lesson.','2026 年 10 月 1 日复核快照。最后一框是未来测试事件，不是已部署主网功能。注明日期的公告见正文。');ref='glamsterdam'
    else:raise KeyError(ident)
    return frame(lang,'viz-'+ident,title,body,caption,SOURCES[ref][2],SOURCES[ref][0])
