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
  .then(async () => {
    console.log('Database connection established');
    const db = client.db(process.env.DB_NAME);
    collection = db.collection(process.env.DB_COLLECTION);
    //Haal alle documenten op
    const jobs = await collection.find({}).toArray();
    //Print ze in je console
    //console.log(jobs);
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`);
  });


// ===============================
// Data
// ===============================


app.get('/kaartje', async (req, res) => {

      const db = client.db(process.env.DB_NAME);
      const collection = db.collection(process.env.DB_COLLECTION);

      const data = await collection.find().toArray();
      
      res.render('partials/kaartje', { data: data }); 
});

app.get('/overzicht', async (req, res) => {

  const search = req.query.search || "";

  const jobs = await collection.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { locations: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } }
    ]
  }).toArray();

  res.render('pages/overzicht', {
    jobs: jobs,
    search: search
  });

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
