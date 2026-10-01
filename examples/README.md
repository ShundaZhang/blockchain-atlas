# Runnable Solidity examples · 可运行 Solidity 示例

Two original teaching contracts: **MessageBoard** and **StudyToken**. The project has no wallet connection, production RPC, private-key input, sale or liquidity pool.
两个原创教学合约。项目不连接钱包、生产 RPC 或私钥输入，不包含销售及流动性池。

## Reproduce · 复现

Use a supported Node.js release (tested: **24.10.0**). Pinned dependencies: Solidity compiler **0.8.30**, OpenZeppelin Contracts **5.4.0**, Hardhat **3.0.6**, ethers **6.15.0**. These versions are reproducible teaching choices, not a latest-version claim.
使用支持的 Node.js 版本（验证版本 24.10.0）。依赖版本固定以便复现，并非最新版声明。

```sh
npm ci
npm run compile
```

Terminal A / 终端 A:

```sh
npm run node
```

Terminal B / 终端 B:

```sh
npm test
npm run demo
```

The scripts connect only to `http://127.0.0.1:8545` and check chain ID `31337`. Hardhat supplies unlocked **publicly known demo accounts**; these identities are for local development only. No seed phrase is needed. Starting or restarting the node creates a disposable development environment.
脚本仅连接本机 8545 端口并检查链 31337。Hardhat 提供公开已知的解锁演示账户，仅供本地开发，无需助记词。节点为可丢弃开发环境。

`compile.mjs` invokes the pinned local solc with optimizer **200 runs** and EVM target **Shanghai**. It produces ABI and bytecode under `artifacts/`. Hardhat's node is used for execution, not for downloading a compiler.
编译脚本调用固定本地 solc，优化器 200 次，EVM 目标 Shanghai。ABI 与字节码输出到 artifacts；Hardhat 负责执行，不负责下载编译器。

The node configuration returns raw revert bytes for failed calls and mines failed transactions into status-0 receipts. Tests decode the exact custom error, send the rejected request with an explicit gas limit, and verify that state remains unchanged. This avoids source-trace assumptions because compilation uses standalone solc.
节点配置让失败调用返回原始回滚字节，并让失败交易产生状态 0 回执。测试检查具体错误、发送明确 Gas 上限的失败请求并确认状态不变；独立 solc 编译无需依赖节点源码跟踪。

## Expected behavior · 预期行为

- MessageBoard stores its initial message. Only the deployer may call `setMessage`; an unauthorized call reverts with `NotOwner`. Successful updates emit `MessageChanged`.
- StudyToken issues **1,000,000 STUDY**, with **18 decimals**, once in its constructor. It exposes ordinary ERC-20 transfers/approvals, with no added owner, public mint, proxy or sale function.
- Demo: Bob receives 25 STUDY directly and 4 via an approved spender, ending with **29 STUDY**; the ordinary allowance decreases from 10 to **6 STUDY**. Total supply stays **1,000,000 STUDY**.
- Tests check state, events, authority rejection, unit scale, supply conservation, allowance reduction and insufficient-balance/allowance failures.

消息合约检查初始状态、更新事件及拒绝其他调用者。代币固定发行一次，演示中 Bob 最终持有 29，授权剩余 6，供应保持 1,000,000；测试包含成功及失败路径。

Deployment addresses and transaction hashes depend on the local chain run. Deployment creates no backing, price, exchange listing or liquidity. Contract source verification and a security audit are different activities.
部署地址及交易哈希依运行而异。部署不创建担保、价格、上架或流动性。源码验证与安全审计是不同活动。

## Remix variant · Remix 版本

Use the same Solidity source, compiler **0.8.30**, target **Shanghai**, and a **Remix VM** environment. For StudyToken, replace the npm import with:

```solidity
import {ERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/ERC20.sol";
```

Provide a Remix VM account as the recipient. Browser VM workflows and local project scripts are two alternatives; they do not share state.
将 Remix VM 账户作为接收方。浏览器 VM 与本地项目是两个独立流程，不共享状态。

## Public testnets · 公开测试网

The website explains a separate manual testnet flow. These scripts intentionally do not accept public RPCs or production keys. Check current network support and use a separate test wallet. No public-chain deployment is performed by this repository.
网站介绍独立手动测试网流程；脚本不接收公开 RPC 或生产密钥。核对当前网络支持并使用独立测试钱包。本仓库不执行公开链部署。
