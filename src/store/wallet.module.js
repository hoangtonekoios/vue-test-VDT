import { DISCONNECT_WALLET, SET_WALLET } from "./actions.type";
import {
  SET_WALLET_ACCOUNT,
  SET_WALLET_NAME,
  SET_WALLET_CHAIN_ID
} from "./mutations.type";

const state = {
  account: null,
  wallet: null,
  chainId: null
};

const mutations = {
  [SET_WALLET_ACCOUNT](state, account) {
    state.account = account;
  },
  [SET_WALLET_NAME](state, wallet) {
    state.wallet = wallet;
  },
  [SET_WALLET_CHAIN_ID](state, chainId) {
    state.chainId = chainId;
  }
};

const getters = {
  account(state) {
    return state.account;
  },
  wallet(state) {
    return state.wallet;
  },
  chainId(state) {
    return state.chainId;
  }
};

const actions = {
  [SET_WALLET]({ commit }, params) {
    commit(SET_WALLET_ACCOUNT, params.account);
    commit(SET_WALLET_NAME, params.wallet);
    commit(SET_WALLET_CHAIN_ID, params.chainId);
  },
  [DISCONNECT_WALLET]({ commit }) {
    commit(SET_WALLET_ACCOUNT, null);
    commit(SET_WALLET_NAME, null);
    commit(SET_WALLET_CHAIN_ID, null);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
