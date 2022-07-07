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
          <div class="account-address">
            <h5>{{ formatAccount(account) }}</h5>
            <i @click="isShowMenu = !isShowMenu" class="ion-arrow-down-b"></i>
            <div v-if="isShowMenu" class="dropdown-wallet">
              <button
                class="btn btn-danger"
                @click.prevent="disconnectWallet()"
              >
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
    <modal-connect-wallet
      v-if="isShowModalConnectWallet"
      :visible="isShowModalConnectWallet"
      @close="isShowModalConnectWallet = false"
    />
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import ModalConnectWallet from "./ModalConnectWallet.vue";
import ConnectWalletMixin from "../mixins/connectWallet";
import { WALLET_LIST } from "../utils/constants";

export default {
  name: "RwvHeader",
  components: { ModalConnectWallet },
  mixins: [ConnectWalletMixin],
  data() {
    return {
      isShowMenu: false,
      isShowModalConnectWallet: false
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser",
      isAuthenticated: "isAuthenticated"
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
    async connectWallet(name) {
      switch (name) {
        case WALLET_LIST.METAMASK:
          this.connectMetaMask(this.handleFinishConnectWallet);
          break;
        case WALLET_LIST.WALLET_CONNECT:
          this.connectWalletConnect(this.handleFinishConnectWallet);
          break;
        default:
          break;
      }
    },
    handleFinishConnectWallet() {
      this.isShowMenu = false;
    },
    showModalConnectWallet() {
      this.isShowModalConnectWallet = true;
    },
    formatAccount(account) {
      return account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";
    }
  }
};
</script>
<style>
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
  gap: 10px;
}
.ion-arrow-down-b {
  cursor: pointer;
}
</style>
