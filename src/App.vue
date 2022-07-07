<template>
  <div id="app">
    <RwvHeader />
    <router-view></router-view>
    <RwvFooter />
    <ModalWrongNetwork />
  </div>
</template>

<script>
import RwvHeader from "@/components/TheHeader";
import RwvFooter from "@/components/TheFooter";
import ModalWrongNetwork from "./components/ModalWrongNetwork.vue";

export default {
  name: "App",
  components: {
    RwvHeader,
    RwvFooter,
    ModalWrongNetwork
  }
};
</script>

<style></style>
