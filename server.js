// ===============================
// Load environment variables
// ===============================
require('dotenv').config()

// ===============================
// Dependencies
// ===============================
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const fetchFn = global.fetch
  ? global.fetch
  : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
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
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`);
  })


// ===============================
// Data
// ===============================
    //const db = client.db(process.env.DB_NAME);
    //collection = db.collection(process.env.DB_COLLECTION);

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

app.get('/favourites', (req, res) => {
  const jobs = [
    {
      _id: '1',
      title: 'Medior Business Developer Warmte',
      company: 'Alliander',
      date: 'Wed, 04 Mar 2026 03:48:58 GMT',
      description: 'Als Medior Business <b>Developer</b> Warmte versnel je de warmtetransitie...',
      locations: 'Amsterdam, Noord-Holland',
      salary: '€5310 - 9016 per month',
      url: '#'
    },
    {
      _id: '2',
      title: 'Frontend Developer',
      company: 'Booking.com',
      date: 'Tue, 02 Mar 2026 03:48:58 GMT',
      description: 'Work on modern frontend applications and scalable UI systems...',
      locations: 'Amsterdam',
      salary: '€4500 - 6500 per month',
      url: '#'
    },
    {
      _id: '3',
      title: 'Node.js Backend Developer',
      company: 'Adyen',
      date: 'Mon, 01 Mar 2026 03:48:58 GMT',
      description: 'Build backend services for global payment infrastructure...',
      locations: 'Amsterdam',
      salary: '€5200 - 7200 per month',
      url: '#'
    }
  ];

  res.render('pages/favorites', { jobs });
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
