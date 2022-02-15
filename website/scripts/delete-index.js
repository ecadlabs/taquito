require('dotenv').config();

const algoliasearch = require('algoliasearch');

const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID, 
  process.env.ALGOLIA_UPDATE_API_KEY
); 
const index = client.initIndex('taquito');

try {
  index.delete();
  console.log('Successfully deleted index: taquito');
} catch(e) {
  console.log(`Failed to delete Algolia index: ${e}`);
}
