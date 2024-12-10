<template>
  <div>
    <h1>PIZZA APP</h1>
    <button @click="goHome">HOME</button>
    <button @click="goDodajPizzu">DODAJ PIZZU</button>
 <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goHome() {
      this.$router.push('/');
    },
    goDodajPizzu() {
      this.$router.push('/dodajPizzu');
    }
  }
};
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
