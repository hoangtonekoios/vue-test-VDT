<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }">
        conduit
      </router-link>
      <ul v-if="!isAuthenticated" class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'home' }"
          >
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'login' }"
          >
            <i class="ion-compose"></i>Sign in
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'register' }"
          >
            <i class="ion-compose"></i>Sign up
          </router-link>
        </li>
        <li class="nav-item" v-if="!account">
          <button class="btn btn-primary" @click="showModalConnectWallet()">
            Connect Wallet
          </button>
        </li>
        <li v-else class="nav-item">
          <div class="account-address" @click="isShowMenu = !isShowMenu">
            <h5>{{ formatAccount(account) }}</h5>
            <i class="ion-arrow-down-b"></i>
            <div v-if="isShowMenu" class="dropdown-wallet">
              <button class="btn btn-danger" @click="disconnectWallet()">
                Disconnect
              </button>
            </div>
          </div>
        </li>
      </ul>
      <ul v-else class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'home' }"
          >
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            :to="{ name: 'article-edit' }"
          >
            <i class="ion-compose"></i>&nbsp;New Article
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'settings' }"
          >
            <i class="ion-gear-a"></i>&nbsp;Settings
          </router-link>
        </li>
        <li class="nav-item" v-if="currentUser.username">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{
              name: 'profile',
              params: { username: currentUser.username }
            }"
          >
            {{ currentUser.username }}
          </router-link>
        </li>
      </ul>
    </div>
    <v-modal
      :visible="isShowModalConnectWallet"
      title="Connect wallet"
      @close="isShowModalConnectWallet = false"
    >
      <div v-if="!isInstalledMetamask" class="install-wallet">
        <img src="/public/img/icons/metamask-logo.png" alt="" />
        Please install Metamask
        <button class="btn btn-primary" @click="handleClickInstallMetamask()">
          Install Metamask
        </button>
      </div>
      <div v-else-if="!isLoading" class="wallet-list">
        <div
          v-for="(item, index) in walletList"
          :key="index"
          class="wallet-item"
          @click="connectWallet(item.name)"
        >
          <img :src="item.logo" alt="" />
          <span class="wallet-item-name">{{ item.name }}</span>
        </div>
      </div>
      <div v-else class="wallet-loading">
        <i class="ion-refresh"></i>
        Connecting to Metamask
      </div>
    </v-modal>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VModal from "./VModal.vue";
import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MetamaskLogo from "/public/img/icons/metamask-logo.png";
import WalletConnectLogo from "/public/img/icons/wallet-connect-logo.png";
import { DISCONNECT_WALLET, SET_WALLET } from "../store/actions.type";

const WALLET_LIST = {
  METAMASK: "Metamask",
  WALLET_CONNECT: "Wallet Connect"
};

export default {
  name: "RwvHeader",
  components: { VModal },
  data() {
    return {
      isShowMenu: false,
      isShowModalConnectWallet: false,
      walletList: [
        {
          name: WALLET_LIST.METAMASK,
          logo: MetamaskLogo
        },
        {
          name: WALLET_LIST.WALLET_CONNECT,
          logo: WalletConnectLogo
        }
      ],
      isInstalledMetamask: true,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser",
      isAuthenticated: "isAuthenticated",
      account: "account",
      wallet: "wallet"
    })
  },
  mounted() {
    if (
      Object.values(WALLET_LIST).includes(
        localStorage.getItem("connectedWallet")
      )
    ) {
      this.connectWallet(localStorage.getItem("connectedWallet"));
    }
  },
  methods: {
    ...mapActions({
      setWallet: SET_WALLET,
      disconnect: DISCONNECT_WALLET
    }),
    formatAccount(account) {
      return account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";
    },
    showModalConnectWallet() {
      this.isShowModalConnectWallet = true;
    },
    handleClickInstallMetamask() {
      window.open("https://metamask.io/download/", "_blank");
    },
    async connectWallet(name) {
      switch (name) {
        case WALLET_LIST.METAMASK:
          if (this.isShowModalConnectWallet) this.isLoading = true;
          this.connectMetaMask();
          break;
        case WALLET_LIST.WALLET_CONNECT:
          this.connectWalletConnect();
          break;
        default:
          break;
      }
    },
    async connectMetaMask() {
      const provider = await detectEthereumProvider();
      if (!provider) {
        this.isInstalledMetamask = false;
        this.isLoading = false;
      } else {
        provider
          .request({ method: "eth_requestAccounts" })
          .then((accounts) =>
            this.handleAccountChange(accounts, WALLET_LIST.METAMASK, provider)
          )
          .catch((err) => this.handleErrorConnect(err, WALLET_LIST.METAMASK));
      }
    },
    async connectWalletConnect() {
      const provider = new WalletConnectProvider({
        rpc: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1"
        }
      });
      await provider
        .enable()
        .then((accounts) =>
          this.handleAccountChange(
            accounts,
            WALLET_LIST.WALLET_CONNECT,
            provider
          )
        )
        .catch((err) =>
          this.handleErrorConnect(err, WALLET_LIST.WALLET_CONNECT)
        );
    },
    handleAccountChange(accounts, walletName, provider) {
      this.listenToEvent(provider);
      if (accounts.length === 0) {
        console.log("Please connect to wallet.");
      } else if (accounts[0] !== this.account) {
        this.setUpWallet(accounts[0], walletName, provider);
      }
    },
    async setUpWallet(account, wallet, provider) {
      try {
        const chainId = await provider.request({ method: "eth_chainId" });
        localStorage.setItem("connectedWallet", wallet);
        window.myProvider = provider;
        this.setWallet({ account, wallet, chainId });
        this.isLoading = false;
        this.isShowModalConnectWallet = false;
      } catch (error) {
        console.log(error);
        this.disconnectWallet();
      }
    },
    disconnectWallet() {
      console.log("disconnect");
      if (this.wallet === WALLET_LIST.WALLET_CONNECT) {
        window.myProvider.disconnect();
      }
      localStorage.setItem("connectedWallet", "");
      this.removeListener(window.myProvider);
      this.disconnect();
    },
    handleErrorConnect(err, name) {
      if (err.code === 4001) {
        console.log(`Please connect to ${name}`);
      } else {
        console.error(err);
      }
    },
    listenToAccountChange(account) {
      console.log(`accountsChanged: ${account}`);
      this.disconnectWallet();
    },
    listenToChainChanged(chainId) {
      console.log(`chainChanged: ${chainId}`);
    },
    listenToDisconnect(code, reason) {
      console.log({ code, reason });
    },
    removeListener(provider) {
      provider.removeListener("accountsChanged", this.listenToAccountChange);
      provider.removeListener("chainChanged", this.listenToChainChanged);
      provider.removeListener("disconnect", this.listenToDisconnect);
    },
    listenToEvent(provider) {
      provider.on("accountsChanged", this.listenToAccountChange);
      provider.on("chainChanged", this.listenToChainChanged);
      provider.on("disconnect", this.listenToDisconnect);
    }
  }
};
</script>
<style>
.wallet-list {
  display: flex;
  flex-flow: column nowrap;
  padding: 20px;
}
.wallet-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 30px;
  cursor: pointer;
  height: 60px;
  border-radius: 12px;
  padding: 10px;
}
.wallet-item-name {
  font-weight: 700;
}
.wallet-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wallet-loading .ion-refresh {
  font-size: 50px;
  animation: rotating 1.2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.install-wallet {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px 0px 20px 0px;
}
.dropdown-wallet {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 12px;
  padding: 20px;
}
.account-address {
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  gap: 10px;
}
</style>
