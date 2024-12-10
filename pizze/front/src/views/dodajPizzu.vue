<template>
  <div>
    <h2>Dodaj novu pizzu</h2>
    <form @submit.prevent="dodajPizzu" enctype="multipart/form-data">
      <div>
        <label for="naziv">Naziv:</label>
        <input v-model="novaPizza.naziv" type="text" id="naziv" required />
      </div>
      <div>
        <label for="cijena">Cijena:</label>
        <input v-model="novaPizza.cijena" type="number" id="cijena" required />
      </div>
      <div>
        <label for="sastojci">Sastojci (odvojeni zarezom):</label>
        <input 
          v-model="novaPizza.sastojciText" 
          type="text" 
          id="sastojci" 
          placeholder="Unesite sastojke (npr. sir, šunka, gljive)"
        />
      </div>
      <div>
       
      </div>
      <button type="submit">Dodaj pizzu</button>
    </form>
    <div v-if="errorMessage" style="color: red; margin-top: 10px;">{{ errorMessage }}</div>
    <div v-if="successMessage" style="color: green; margin-top: 10px;">{{ successMessage }}</div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "dodajPizzu",
  data() {
    return {
      novaPizza: {
        naziv: "",
        cijena: null,
        sastojciText: "", 
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    
    async dodajPizzu() {
  if (
    !this.novaPizza.naziv ||
    this.novaPizza.cijena <= 0 ||
    !this.novaPizza.sastojciText ||
    this.novaPizza.sastojciText.trim() === ""
  ) {
    this.errorMessage = "Morate unijeti naziv, cijenu i sastojke!";
    this.successMessage = "";
    return;
  }

  // Pretvaranje teksta u niz sastojaka
  const sastojci = this.novaPizza.sastojciText
    .split(",")
    .map((sastojak) => sastojak.trim())
    .filter((sastojak) => sastojak !== "");

  if (sastojci.length === 0) {
    this.errorMessage = "Morate unijeti barem jedan sastojak!";
    this.successMessage = "";
    return;
  }

  const podaci = {
    naziv: this.novaPizza.naziv,
    cijena: this.novaPizza.cijena,
    sastojci: sastojci,
  };

  console.log("Podaci za slanje:", podaci);

  // Slanje podataka na backend
  try {
    const response = await axios.post("http://localhost:3010/pizze", podaci, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.successMessage = "Pizza uspješno dodana!";
    this.errorMessage = "";
    this.novaPizza = { naziv: "", cijena: null, sastojciText: "" }; 
  } catch (error) {
    this.errorMessage = "Došlo je do greške prilikom dodavanja pizze!";
    this.successMessage = "";
    console.error("Greška:", error.response?.data || error.message);
  }
},

  },
};
</script>


<style scoped>
/* Stilovi specifični za ovu komponentu */
form {
  margin: 20px auto;
  max-width: 300px;
  background: #fff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 3px;
}

button {
  padding: 10px 15px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

div {
  color: red;
  margin-top: 10px;
}
</style>
