// Hardhat supplies only the local development chain here.
// scripts/compile.mjs compiles with the pinned solc npm package.
export default {
  solidity: "0.8.30",
  networks: {
    default: {
      type: "edr-simulated",
      chainId: 31337,
      // Inspect raw revert bytes and mined failure receipts without source traces.
      throwOnCallFailures: false,
      throwOnTransactionFailures: false,
    },
  },
};
