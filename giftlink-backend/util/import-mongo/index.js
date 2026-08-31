require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

let url = "mongodb://127.0.0.1:27017";
let filename = `${__dirname}/gifts.json`;
const dbName = 'giftdb';
const collectionName = 'gifts';

async function loadData() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        let rawData = JSON.parse(fs.readFileSync(filename, 'utf8'));

        // Handle both direct array or nested array objects (e.g. { docs: [...] } or { gifts: [...] })
        let data = Array.isArray(rawData) 
            ? rawData 
            : (rawData.docs || rawData.gifts || Object.values(rawData)[0]);

        await collection.deleteMany({});

        const insertResult = await collection.insertMany(data);
        console.log(`Inserted documents: ${insertResult.insertedCount}`);
    } catch (err) {
        console.error("Error connecting or inserting data:", err);
    } finally {
        await client.close();
    }
}

loadData();