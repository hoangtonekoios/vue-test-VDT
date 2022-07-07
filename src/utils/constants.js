export const WALLET_LIST = {
  METAMASK: "Metamask",
  WALLET_CONNECT: "Wallet Connect"
};

export const DEFAULT_CHAIN_ID =
  process.env.NODE_ENV === "development"
    ? process.env.VUE_APP_ETHEREUM_TESTNET_RINKEBY_ID
    : process.env.VUE_APP_ETHEREUM_MAINNET_ID;

export const DEFAULT_CHAIN_NAME =
  process.env.NODE_ENV === "development"
    ? process.env.VUE_APP_ETHEREUM_TESTNET_RINKEBY_NAME
    : process.env.VUE_APP_ETHEREUM_MAINNET_NAME;
