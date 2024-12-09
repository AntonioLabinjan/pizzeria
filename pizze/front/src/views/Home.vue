<template>
  <div id="app">
    <div>
      <label for="filterNaziv">Filtriraj po imenu:</label>
      <input v-model="filter.naziv" type="text" id="filterNaziv" placeholder="Pretraži po imenu" />

      <label for="filterSastojak">Filtriraj po sastojku:</label>
      <input v-model="filter.sastojak" type="text" id="filterSastojak" placeholder="Pretraži po sastojku" />

      <label for="filterCijenaMin">Filtriraj po cijeni (min):</label>
      <input v-model.number="filter.cijenaMin" type="number" id="filterCijenaMin" placeholder="Min" />

      <label for="filterCijenaMax">Filtriraj po cijeni (max):</label>
      <input v-model.number="filter.cijenaMax" type="number" id="filterCijenaMax" placeholder="Max" />
    </div>

    <div class="pizza-grid">
      <div v-if="filteredPizze.length > 0">
        <div v-for="pizza in filteredPizze" :key="pizza._id" class="pizza-card">
          <strong>{{ pizza.naziv }}</strong>
          <p>{{ pizza.cijena }} HRK</p>
          <button @click="dodajUNarudzbu(pizza)">Naruči</button>
        </div>
      </div>
      <p v-else>Nema dostupnih pizza.</p>
    </div>

    <h2>Vaša Narudžba</h2>
    <ul v-if="narudzba.length > 0">
      <li v-for="(item, index) in narudzba" :key="index">
        {{ item.naziv }} ({{ item.cijena }} HRK) x 
        <input 
          v-model.number="item.kolicina" 
          type="number" 
          min="1" 
          @change="azurirajUkupnuCijenu"
        />
        = {{ item.kolicina * item.cijena }} HRK
        <button @click="ukloniIzNarudzbe(index)">Ukloni</button>
      </li>
      <p><strong>Ukupna cijena: {{ ukupnaCijena }} HRK</strong></p>
    </ul>
    <p v-else>Vaša košarica je prazna.</p>

    <h2>Unesite Podatke za Narudžbu</h2>
    <form @submit.prevent="posaljiNarudzbu">
      <div>
        <label for="imeKupca">Ime Kupca:</label>
        <input v-model="kupac.ime" type="text" id="imeKupca" required />
      </div>
      <div>
        <label for="adresa">Adresa:</label>
        <input v-model="kupac.adresa" type="text" id="adresa" required />
      </div>
      <div>
        <label for="broj_telefona">Broj Telefona:</label>
        <input v-model="kupac.broj_telefona" type="text" id="broj_telefona" required />
      </div>
      <button type="submit" :disabled="narudzba.length === 0">Potvrdi Narudžbu</button>
    </form>

    
    <!-- Prikaz poruka -->
    <div v-if="errorMessage" style="color: red; margin-top: 10px;">{{ errorMessage }}</div>
    <div v-if="successMessage" style="color: green; margin-top: 10px;">{{ successMessage }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      pizze: [], // Array za spremanje dohvaćenih pizza
      filter: {
        naziv: "",
        sastojak: "",
        cijenaMin: 0,
        cijenaMax: Infinity,
      },
      novaPizza: {
        naziv: "",
        cijena: null,
        sastojci: [], // Dodano za sastojke
      }, // Objekt za novu pizzu
      noviSastojak: "", // Za unos novog sastojka
      narudzba: [], // Narudžbe
      ukupnaCijena: 0, // Ukupna cijena narudžbe
      errorMessage: "", // Poruka o grešci
      successMessage: "", // Poruka o uspjehu
      kupac: {
        ime: "",
        adresa: "",
        broj_telefona: "",
      },
    };
  },
  computed: {
  // Filterirana lista pizza
  filteredPizze() {
    return this.pizze.filter((pizza) => {
      const matchesNaziv = pizza.naziv.toLowerCase().includes(this.filter.naziv.toLowerCase());
      
      // Provjera sastojaka, ako sastojci nisu definirani, postavi prazan niz
      const matchesSastojak = this.filter.sastojak === "" || 
        (pizza.sastojci && Array.isArray(pizza.sastojci) && pizza.sastojci.some(sastojak => sastojak.toLowerCase().includes(this.filter.sastojak.toLowerCase())));

      const matchesCijena = pizza.cijena >= this.filter.cijenaMin && pizza.cijena <= this.filter.cijenaMax;

      return matchesNaziv && matchesSastojak && matchesCijena;
    });
  },
},

  methods: {
    async fetchPizze() {
      try {
        const response = await axios.get("http://localhost:3010/pizze"); // Dohvaćanje pizza s backenda
        this.pizze = response.data;
      } catch (error) {
        console.error("Greška prilikom dohvaćanja pizza:", error);
        alert("Nije moguće dohvatiti pizze. Provjeri server!");
      }
    },

    // Dodavanje sastojka u pizzu
    

    async dodajPizzu() {
  // Logiraj podatke prije provjere
  console.log("Podaci prije provjere:", this.novaPizza); // Logiraj trenutnu vrijednost this.novaPizza

  // Provjera svih potrebnih podataka
  if (!this.novaPizza.naziv || this.novaPizza.cijena <= 0 || !this.novaPizza.sastojciText || this.novaPizza.sastojciText.trim() === "") {
    this.errorMessage = "Morate unijeti naziv, cijenu i sastojke!";
    this.successMessage = ""; // Resetiraj uspješne poruke
    console.log("Greška: Nedostaju obavezni podaci.");
    return;
  }

  // Pretvaranje teksta u niz sastojaka
  const sastojci = this.novaPizza.sastojciText.split(",").map(sastojak => sastojak.trim()).filter(sastojak => sastojak !== "");

  if (sastojci.length === 0) {
    this.errorMessage = "Morate unijeti barem jedan sastojak!";
    this.successMessage = ""; // Resetiraj uspješne poruke
    return;
  }

  // Dodajemo sastojke u novaPizza objekt
  this.novaPizza.sastojci = sastojci;

  // Logiraj podatke koje šaljemo na backend
  console.log("Podaci koji se šalju na backend:", {
    naziv: this.novaPizza.naziv,
    cijena: this.novaPizza.cijena,
    sastojci: this.novaPizza.sastojci
  });

  // Slanje podataka na backend
  try {
    const response = await axios.post("http://localhost:3010/pizze", {
      naziv: this.novaPizza.naziv,
      cijena: this.novaPizza.cijena,
      sastojci: this.novaPizza.sastojci
    });

    // Logiraj odgovor od backenda
    console.log("Odgovor od backenda:", response.data);

    this.successMessage = "Pizza uspješno dodana!";
    this.errorMessage = ""; // Resetiraj greške
    this.pizze.push(response.data); // Dodaj novu pizzu u lokalnu listu
    this.novaPizza = { naziv: "", cijena: null, sastojciText: "" }; // Resetiraj obrazac

  } catch (error) {
    // Ako dođe do greške, prikazujemo odgovarajuću poruku
    if (error.response) {
      console.log("Greška u odgovoru:", error.response.data); // Pomoć za debugiranje
      this.errorMessage = error.response.data.error || "Došlo je do greške prilikom dodavanja pizze!";
    } else {
      console.log("Greška u samom zahtjevu:", error.message); // Pomoć za debugiranje
      this.errorMessage = "Došlo je do greške prilikom dodavanja pizze!";
    }
    this.successMessage = ""; // Resetiraj uspješne poruke
  }
},





    dodajUNarudzbu(pizza) {
        if (!pizza || !pizza.naziv) {
            this.errorMessage = "Odabrana pizza ne postoji!";
            this.successMessage = "";
            return;
        }

        const item = this.narudzba.find((p) => p.naziv === pizza.naziv);
        if (item) {
            item.kolicina += 1;
        } else {
            this.narudzba.push({ ...pizza, kolicina: 1 });
        }

        this.azurirajUkupnuCijenu();  // Ažuriraj cijenu odmah
    },

    ukloniIzNarudzbe(index) {
        this.narudzba.splice(index, 1);
        this.azurirajUkupnuCijenu();
    },

    azurirajUkupnuCijenu() {
        this.ukupnaCijena = this.narudzba.reduce((total, item) => total + item.cijena * item.kolicina, 0);
    },

    async posaljiNarudzbu() {
        if (!this.kupac.ime || !this.kupac.adresa || !this.kupac.broj_telefona) {
            this.errorMessage = "Sva polja za kupca moraju biti popunjena!";
            return;
        }

        const narudzbaData = {
            kupac: this.kupac,
            narucene_pizze: this.narudzba,
        };

        try {
            const response = await axios.post("http://localhost:3010/narudzbe", narudzbaData);
            this.successMessage = "Narudžba uspješno poslana!";
            this.errorMessage = "";
            this.narudzba = [];  // Očisti narudžbu nakon uspjeha
            this.azurirajUkupnuCijenu();  // Osvježi ukupnu cijenu
        } catch (error) {
            this.errorMessage = "Greška pri slanju narudžbe.";
            this.successMessage = "";
        }
    },

    
  },
  watch: {
    successMessage() {
      if (this.successMessage) {
        setTimeout(() => {
          this.successMessage = "";
        }, 3000); // Sakrij poruku nakon 3 sekunde
      }
    },
    errorMessage() {
      if (this.errorMessage) {
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000); // Sakrij poruku nakon 3 sekunde
      }
    },
  },
  created() {
    this.fetchPizze(); // Automatski poziv metode kod mountanja komponente
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

#app {
  padding: 20px;
  text-align: center;
}

h1,
h2 {
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #fff;
  margin: 10px auto;
  padding: 10px;
  max-width: 300px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

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

.pizza-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* Creates 3 equal columns */
  grid-gap: 20px;  /* Space between the cards */
  max-width: 800px;  /* Add a max width for the grid */
  margin: 0 auto;  /* Center the grid */
}

.pizza-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px; /* Ensure the card width is fixed */
  text-align: center;
  transition: transform 0.3s ease;
}

.pizza-card:hover {
  transform: scale(1.05);
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
</style>