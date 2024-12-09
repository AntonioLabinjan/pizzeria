// OVO SVE DELA NA alabinjan@student.unipu.hr accounutu; ako me sad ni trefija fucking infarkt neće nikad...nevermind, ajmo na sastojke :)

// DODAT SLIKE...TO MI NE USPIJEVA NIKAKO
//I PRIKAZE ERRORA NA FRONTENDU!!!!!!!!!!!!!!!!!!!!!!
//<!-- ovo sve dela za sad, samo pita malo refresheva haha-->
import express from 'express';

import cors from 'cors';

import { connectToDatabase } from './db.js';
import { config } from 'dotenv';
config(); // učitava osjetljive podatke iz .env datoteke





console.log(process.env.MONGO_URI);
console.log(process.env.MONGO_DB_NAME);

const app = express();
app.use(express.json());




// Omogući CORS za sve zahtjeve
app.use(cors());
let db = await connectToDatabase();



app.post('/pizze', async (req, res) => {
    console.log("Primljeni podaci:", req.body);

    const pizze_collection = db.collection('pizze');
    const novaPizza = {
        naziv: req.body.naziv,
        cijena: parseFloat(req.body.cijena),
        sastojci: req.body.sastojci || [],
    };

    // Provjera cijene
    if (novaPizza.cijena <= 0) {
        return res.status(400).json({ error: 'Cijena mora biti veća od nule' });
    }

    // Provjera sastojaka
    if (!novaPizza.sastojci || novaPizza.sastojci.length === 0) {
        return res.status(400).json({ error: 'Morate unijeti barem jedan sastojak!' });
    }

    // Provjera jedinstvenosti naziva pizze
    try {
        const existingPizza = await pizze_collection.findOne({ naziv: novaPizza.naziv });
        if (existingPizza) {
            return res.status(400).json({ error: 'Pizza s tim nazivom već postoji!' });
        }

        
        // Spremi pizzu u bazu
        const result = await pizze_collection.insertOne(novaPizza);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
        console.log("Greška prilikom unosa:", error);
        res.status(400).json({ error: error.message });
    }
});


app.get('/users', async (req, res) => {
    let users_collection = db.collection('users'); // pohranjujemo referencu na kolekciju
    let allUsers = await users_collection.find().toArray(); // dohvaćamo sve korisnike ikolekcije i pretvaramo Cursor objekt u Array
    res.status(200).json(allUsers);
    });


        app.get('/pizze', async (req, res) => {
            let pizze_collection = db.collection('pizze');
            let cijena_query = req.query.cijena;
            if (!cijena_query) {
            let pizze = await pizze_collection.find().toArray(); // dohvaćamo sve pizze
            return res.status(200).json(pizze);
            }
            try {
            let pizze = await pizze_collection.find({ cijena: Number(cijena_query) }).toArray();
            // provjerava se točno podudaranje cijene
            res.status(200).json(pizze);
            } catch (error) {
                console.log(error.errorResponse);
                res.status(400).json({ error: error.errorResponse });
                }
                });
app.get('/pizze/:naziv', async (req, res) => {
            let pizze_collection = db.collection('pizze');
            let naziv_param = req.params.naziv;
            let pizza = await pizze_collection.findOne({ naziv: naziv_param }); // samo 1 rezultat,
            res.status(200).json(pizza);
            });


            
            
            
            
                
                /*
            app.post('/narudzbe', async (req, res) => {
                console.log('Primljeno tijelo zahtjeva:', req.body); // Log za cijeli zahtjev
                const narudzbe_collection = db.collection('narudzbe');
                const pizze_collection = db.collection('pizze');
                const novaNarudzba = req.body;
                
                // Obavezni ključevi za narudžbu
                const obavezniKljucevi = ['kupac', 'narucene_pizze'];
                const obavezniKljuceviStavke = ['naziv', 'kolicina',  'cijena'];
                
                // Validacija glavne narudžbe
                const missingKeys = obavezniKljucevi.filter(kljuc => !(kljuc in novaNarudzba));
                if (missingKeys.length > 0) {
                    console.log('Nedostaju obavezni ključevi u narudžbi:', missingKeys); // Log koji ključevi nedostaju
                    return res.status(400).json({ error: `Nedostaju obavezni ključevi u narudžbi: ${missingKeys.join(', ')}` });
                }
            
                // Validacija naručenih pizza
                try {
                    const dostupne_pizze = await pizze_collection.find().toArray();
                    const dostupniNazivi = dostupne_pizze.map(pizza => pizza.naziv);
            
                    for (const stavka of novaNarudzba.narucene_pizze) {
                        // Provjera da svaka stavka ima potrebne ključeve
                        const missingItemKeys = obavezniKljuceviStavke.filter(kljuc => !(kljuc in stavka));
                        if (missingItemKeys.length > 0) {
                            console.log('Nedostaju obavezni ključevi u stavci narudžbe:', missingItemKeys, stavka); // Log koji ključevi nedostaju u stavci
                            return res.status(400).json({
                                error: `Nedostaju obavezni ključevi u stavci narudžbe: ${missingItemKeys.join(', ')}`
                            });
                        }
            
                        // Provjera valjanosti naziva pizze
                        if (!dostupniNazivi.includes(stavka.naziv)) {
                            return res.status(400).json({ error: `Pizza "${stavka.naziv}" nije u ponudi.` });
                        }
            
                        
                                    
                        // Provjera količine
                        if (!Number.isInteger(stavka.kolicina) || stavka.kolicina <= 0) {
                            return res.status(400).json({
                                error: `Količina mora biti pozitivan cijeli broj za stavku: ${JSON.stringify(stavka)}`
                            });
                        }
                    }
            
                    // Ako validacija uspije, spremi narudžbu u bazu
                    const result = await narudzbe_collection.insertOne({
                        ...novaNarudzba,
                        datum: new Date() // Dodavanje datuma narudžbe
                    });
                    console.log('Narudžba spremljena:', result);
            
                    res.status(201).json({
                        message: 'Narudžba uspješno spremljena',
                        insertedId: result.insertedId
                    });
                } catch (error) {
                    console.error('Greška pri obradi narudžbe:', error);
                    res.status(500).json({ error: 'Greška na serveru prilikom obrade narudžbe' });
                }
            });
            
            */
            app.post('/narudzbe', async (req, res) => {
                console.log('Primljeno tijelo zahtjeva:', req.body); // Log za cijeli zahtjev
                const narudzbe_collection = db.collection('narudzbe');
                const pizze_collection = db.collection('pizze');
                const novaNarudzba = req.body;
            
                // Obavezni ključevi za narudžbu
                const obavezniKljucevi = ['kupac', 'narucene_pizze'];
                const obavezniKljuceviStavke = ['naziv', 'kolicina', 'cijena'];
            
                // Obavezni ključevi za kupca
                const obavezniKljuceviKupca = ['ime', 'adresa', 'broj_telefona'];
            
                // Validacija glavne narudžbe
                const missingKeys = obavezniKljucevi.filter(kljuc => !(kljuc in novaNarudzba));
                if (missingKeys.length > 0) {
                    console.log('Nedostaju obavezni ključevi u narudžbi:', missingKeys);
                    return res.status(400).json({ error: `Nedostaju obavezni ključevi u narudžbi: ${missingKeys.join(', ')}` });
                }
            
                // Validacija podataka o kupcu (synchronous)
                const missingKupacKeys = obavezniKljuceviKupca.filter(kljuc => !(kljuc in novaNarudzba.kupac));
                if (missingKupacKeys.length > 0) {
                    console.log('Nedostaju obavezni podaci o kupcu:', missingKupacKeys);
                    return res.status(400).json({ error: `Nedostaju obavezni podaci o kupcu: ${missingKupacKeys.join(', ')}` });
                }
            
                // Provjera broja telefona (mogu biti broj ili string sa 10 znamenki)
                const telefon = novaNarudzba.kupac.broj_telefona;
            
                
                // ovo tu uopće ni bilo fora...
                if (!/^\d{10}$/.test(telefon)) {
                    return res.status(400).json({ error: 'Broj telefona mora biti točno 10 znamenki (broj ili string).' });
                }
            
                // Validacija naručenih pizza
                try {
                    const dostupne_pizze = await pizze_collection.find().toArray();
                    const dostupniNazivi = dostupne_pizze.map(pizza => pizza.naziv);
            
                    for (const stavka of novaNarudzba.narucene_pizze) {
                        // Provjera da svaka stavka ima potrebne ključeve
                        const missingItemKeys = obavezniKljuceviStavke.filter(kljuc => !(kljuc in stavka));
                        if (missingItemKeys.length > 0) {
                            console.log('Nedostaju obavezni ključevi u stavci narudžbe:', missingItemKeys, stavka);
                            return res.status(400).json({
                                error: `Nedostaju obavezni ključevi u stavci narudžbe: ${missingItemKeys.join(', ')}`
                            });
                        }
            
                        // Provjera valjanosti naziva pizze
                        if (!dostupniNazivi.includes(stavka.naziv)) {
                            return res.status(400).json({ error: `Pizza "${stavka.naziv}" nije u ponudi.` });
                        }
            
                        // Provjera količine
                        if (isNaN(stavka.kolicina) || stavka.kolicina <= 0) {
                            return res.status(400).json({
                                error: `Količina mora biti pozitivan broj za stavku: ${JSON.stringify(stavka)}`
                            });
                        }
                        
                    }
            
                    // Ako validacija uspije, spremi narudžbu u bazu
                    const result = await narudzbe_collection.insertOne({
                        ...novaNarudzba,
                        datum: new Date() // Dodavanje datuma narudžbe
                    });
                    console.log('Narudžba spremljena:', result);
            
                    res.status(201).json({
                        message: 'Narudžba uspješno spremljena',
                        insertedId: result.insertedId
                    });
                } catch (error) {
                    console.error('Greška pri obradi narudžbe:', error);
                    res.status(500).json({ error: 'Greška na serveru prilikom obrade narudžbe' });
                }
            });
             
              

                        app.patch('/pizze/:naziv', async (req, res) => {
                            let pizze_collection = db.collection('pizze');
                            let naziv_param = req.params.naziv;
                            let novaCijena = req.body.cijena;
                        
                            if (novaCijena <= 0) {
                                return res.status(400).json({ error: 'Cijena mora biti veća od nule' });
                            }
                        
                            try {
                                let result = await pizze_collection.updateOne({ naziv: naziv_param }, { $set: { cijena: novaCijena } });
                                if (result.modifiedCount === 0) {
                                    return res.status(404).json({ error: 'Pizza nije pronađena' });
                                }
                                res.status(200).json({ modifiedCount: result.modifiedCount });
                            } catch (error) {
                                console.log(error.errorResponse);
                                res.status(400).json({ error: error.errorResponse });
                            }
                        });
                        


                        app.patch('/narudzbe/:id', async (req, res) => {
                            let narudzbe_collection = db.collection('narudzbe');
                            let id_param = req.params.id;
                            let azuriraneStavke = req.body.stavke;
                        
                            if (!azuriraneStavke.every(stavka => Number.isInteger(stavka.količina) && stavka.količina > 0)) {
                                return res.status(400).json({ error: 'Količina mora biti pozitivan broj' });
                            }
                        
                            try {
                                let result = await narudzbe_collection.updateOne(
                                    { _id: new ObjectId(id_param) },
                                    { $set: { narucene_pizze: azuriraneStavke } }
                                );
                                if (result.modifiedCount === 0) {
                                    return res.status(404).json({ error: 'Narudžba nije pronađena' });
                                }
                                res.status(200).json({ modifiedCount: result.modifiedCount });
                            } catch (error) {
                                console.log(error.errorResponse);
                                res.status(400).json({ error: error.errorResponse });
                            }
                        });
                        

                                app.put('/pizze', async (req, res) => {
                                    let pizze_collection = db.collection('pizze');
                                    let noviMeni = req.body;
                                    try {
                                    await pizze_collection.deleteMany({}); // brišemo sve pizze iz kolekcije
                                    let result = await pizze_collection.insertMany(noviMeni);
                                    res.status(200).json({ insertedCount: result.insertedCount });
                                    } catch (error) {
                                    console.log(error.errorResponse);
                                    res.status(400).json({ error: error.errorResponse });
                                    }
                                    });

                                    app.delete('/pizze/:naziv', async (req, res) => {
                                        let pizze_collection = db.collection('pizze');
                                        let naziv_param = req.params.naziv;
                                        try {
                                        let result = await pizze_collection.deleteOne({ naziv: naziv_param }); // brišemo pizzu prema nazivu
                                        res.status(200).json({ deletedCount: result.deletedCount });
                                        } catch (error) {
                                        console.log(error.errorResponse);
                                        res.status(400).json({ error: error.errorResponse });
                                        }
                                        });

                                        app.get('/narudzbe', async (req, res) => {
                                            let narudzbe_collection = db.collection('narudzbe');
                                            try {
                                                let narudzbe = await narudzbe_collection.find().toArray(); // Dohvaćanje svih narudžbi
                                                res.status(200).json(narudzbe);
                                            } catch (error) {
                                                console.log(error.errorResponse);
                                                res.status(400).json({ error: error.errorResponse });
                                            }
                                        });
                                        
                                        app.patch('/narudzbe/:id', async (req, res) => {
                                            let narudzbe_collection = db.collection('narudzbe');
                                            let id_param = req.params.id;
                                            let azuriraneStavke = req.body.stavke; // Polje s novim stavkama narudžbe
                                        
                                            try {
                                                let result = await narudzbe_collection.updateOne(
                                                    { _id: new ObjectId(id_param) },
                                                    { $set: { narucene_pizze: azuriraneStavke } }
                                                );
                                                if (result.modifiedCount === 0) {
                                                    return res.status(404).json({ error: 'Narudžba nije pronađena' });
                                                }
                                                res.status(200).json({ modifiedCount: result.modifiedCount });
                                            } catch (error) {
                                                console.log(error.errorResponse);
                                                res.status(400).json({ error: error.errorResponse });
                                            }
                                        });
                                        
app.get('/', (req, res) => {
    res.send('Pizza app');
    });
    const PORT = 3010;
    app.listen(PORT, error => {
    if (error) {
    console.log('Greška prilikom pokretanja servera', error);
    }
    console.log(`Pizza poslužitelj dela na http://localhost:${PORT}`);
    });