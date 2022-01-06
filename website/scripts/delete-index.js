require('dotenv').config();

const algoliasearch = require('algoliasearch');

const client = algoliasearch(
  process.env.APPLICATION_ID, 
  process.env.API_KEY
); 
const index = client.initIndex('taquito');

try {
  index.delete();
  console.log('Successfully deleted index: taquito');
} catch(e) {
  console.log(`Failed to delete Algolia index: ${e}`);
}
