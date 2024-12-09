<template>
  <div>
    <h1>PIZZA APP</h1>
    <!-- Dugmadi za navigaciju -->
    <button @click="goHome">HOME</button>
    <button @click="goDodajPizzu">DODAJ PIZZU</button>

    <!-- Ovdje će se prikazivati trenutni sadržaj iz routera -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    // Funkcija za navigaciju na Home
    goHome() {
      this.$router.push('/');
    },
    // Funkcija za navigaciju na Dodaj Pizzu
    goDodajPizzu() {
      this.$router.push('/dodajPizzu');
    }
  }
};
</script>

<style scoped>
/* Ovdje možeš dodati stilove prema potrebi */
button {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
