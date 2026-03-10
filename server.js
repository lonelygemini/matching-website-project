// ===============================
// Load environment variables
// ===============================
require('dotenv').config()

// ===============================
// Dependencies
// ===============================
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

// ===============================
// Express setup
// ===============================
const app = express()
const port = 1500

app.use(express.static('static'))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', 'views')

// ===============================
// MongoDB setup
// ===============================
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
console.log(uri)
// Voeg deze variabele bovenin toe (bij de andere variabelen)
let collection;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

// Pas de connectie aan zodat de 'collection' variabele gevuld wordt
client.connect()
  .then(() => {
    console.log('Database connection established');
    // Hier selecteer je de juiste database en collectie uit je .env
    const db = client.db(process.env.DB_NAME);
    collection = db.collection(process.env.DB_COLLECTION);
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`);
  })


// ===============================
// Data
// ===============================


app.get('/kaartje', async (req, res) => {

      const db = client.db(process.env.DB_NAME);
      const collection = db.collection(process.env.DB_COLLECTION);

      const data = await collection.find().toArray();
      
      res.render('partials/kaartje', { data: data }); 
});



// ===============================
// Route
// ===============================


// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/filter', (req, res) => {
  res.render('pages/filter'); 
});

app.get('/detail/:jobID', (req, res) => {

  //in de db  zoeken
  console.log(req.params.jobID)
  res.send("job id = " +req.params.jobID); 
});

// ===============================
// Route functions
// ===============================


// ===============================
// 404 handler
// ===============================
app.use((req, res) => {
  res.status(404).send(`
    Sorry, 404 not found">
  `)
})
// ===============================
// Start server (MOET ONDERAAN)
// ===============================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
