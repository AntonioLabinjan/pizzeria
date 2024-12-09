import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
config(); // učitava osjetljive podatke iz .env datoteke

console.log(process.env.MONGO_URI);
console.log(process.env.MONGO_DB_NAME);


let mongoURI = process.env.MONGO_URI;
let db_name = process.env.MONGO_DB_NAME;

//const mongoURI = 'mongodb+srv://alabinjan:vLstLzvLPfxFxcb8@cluster0.3srnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//const db_name = 'sample_mflix'; // naziv predefinirane baze podataka


async function connectToDatabase() {
    try {
    const client = new MongoClient(mongoURI); // stvaramo novi klijent
    await client.connect(); // spajamo se na klijent
    console.log('Uspješno spajanje na bazu podataka');
    let db = client.db(db_name); // odabiremo bazu podataka
    return db;
    } catch (error) {
    console.error('Greška prilikom spajanja na bazu podataka', error);
    throw error;
    }
    }
    export { connectToDatabase };

    