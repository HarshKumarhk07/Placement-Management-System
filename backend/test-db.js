require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

console.log('--- MongoDB Connection Diagnostic Script ---');
console.log(`Node Environment: ${process.env.NODE_ENV}`);
console.log(`URI defined: ${!!uri}`);
if (uri) {
    console.log(`URI starts with: ${uri.substring(0, 15)}...`);
}

async function run() {
    try {
        console.log('Attempting to connect...');
        const start = Date.now();
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        const elapsed = Date.now() - start;
        console.log(`SUCCESS: Connected in ${elapsed}ms`);
        console.log(`Database Name: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);
        console.log('Connection State:', mongoose.connection.readyState);
        process.exit(0);
    } catch (error) {
        console.error('FAILURE: Connection failed!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.reason) console.error('Reason:', error.reason);
        console.error('Full Error:', error);
        process.exit(1);
    }
}

run();
