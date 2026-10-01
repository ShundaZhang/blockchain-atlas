# Blockchain & Crypto Atlas

**Live:** https://shundazhang.github.io/blockchain-atlas/

Independent bilingual learning website, default English, with an EN / 中文 switch linked to the equivalent chapter. Shared language preference across the personal-home atlases.

## Coverage

- Blockchain state machines, history, cryptography and consensus
- Bitcoin, Ethereum, transactions, wallets and gas
- Decentralized money, monetary authority, censorship resistance, Web3, ownership and DAO governance
- Solidity, smart contracts and a complete fixed-supply ERC-20 issuance example
- Stablecoins including USD₮ / USDT, reserves, issuer powers and cross-chain identity
- DeFi AMMs/lending, oracles, rollups, bridges, applications and security
- 17 original bilingual diagrams, 3 local browser labs and 2 runnable contract examples
- Source-linked lessons and a searchable primary-resource directory

No live prices, wallet connection, token sale or real-fund transaction is included. Browser labs do not upload or persist exercise inputs; only the selected language is stored locally. The hash lab is a SHA-256 teaching model, not Bitcoin/Ethereum consensus. The AMM lab is a floating-point v2-style illustration.

## Build and verify

Python standard library:

```sh
python3 -B build.py
python3 -B audit.py
node check-labs.cjs
python3 -m http.server 8771
```

`build.py` generates both languages and a deterministic `examples.zip` from the pinned source/lockfile. Generated documents and downloads are committed; GitHub Pages publishes `main` at `/` without a server-side build.

The [runnable project](examples/README.md) compiles using solc 0.8.30 and executes on a loopback Hardhat chain 31337. Read its instructions for actual EVM tests, demo output and the separate Remix VM path. Development dependencies are ignored in Git and excluded from the downloadable ZIP.

## Source review

Reviewed **1 October 2026**. Protocol rules, product interfaces, issuer support and testnets can change. Compiler/library versions are pinned for reproducibility and are not claimed to be the latest. A working link does not guarantee access from all networks or accounts.

Content, diagrams, browser models and example contracts are original. OpenZeppelin is imported as an upstream MIT-licensed dependency; its source is not mirrored into the atlas. Educational examples are not a financial product, audited production protocol or recommendation to buy an asset.
