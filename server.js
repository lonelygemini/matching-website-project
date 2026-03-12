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
    // Hier selecteer je de juiste database en collectie uit je .env
    const db = client.db(process.env.DB_NAME_USERS);
    collection = db.collection(process.env.DB_COLLECTION_USERS);
    const Users = await collection.find({}).toArray();
    //Print ze in je console
    console.log(Users);
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

//================================
// index page
//================================

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

//================================
// inlog 
//================================
app.get('/inlog', (req, res) => {
  res.render('pages/inlog', {error:""})
})
app.get('/inlog', showForm)
app.post('/verwerkform', verwerkForm)

function showForm(req, res) {
  res.render('pages/inlog')
}
async function verwerkForm(req, res) {
  // We halen nu 'email' uit het formulier (zorg dat name="email" in je EJS staat)
  const emailInput = req.body.email;
  const wachtwoordInput = req.body.wachtwoord;

  try {
    const gebruikerGevonden = await collection.findOne({
      // Verander 'username' naar 'email' zodat het matcht met je database!
      email: emailInput, 
      wachtwoord: wachtwoordInput
    });

    if (!gebruikerGevonden) {
      return res.render('pages/inlog', { error: 'E-mail of wachtwoord onjuist' });
    }

    // Als hij hier komt, is de login gelukt
    console.log('Login succesvol voor:', gebruikerGevonden.email);
    return res.render('pages/overzicht', { search: "" });

  } catch (error) {
    console.error('Database fout:', error);
    return res.render('pages/inlog', { error: 'Database fout' });
  }
}// ===============================
// Registratie
// ===============================
app.get('/registratie', (req, res) => {
  res.render('pages/registratie', {error:""})
})

app.get('/registratie', (req, res) => {
  res.render('pages/registratie');
});// Route om de ingevulde data te verwerken

app.post('/nieuweregistratie', async (req, res) => {
  const nieuwUser = {
    name: req.body.name,
    datum: req.body.datum,
    email: req.body.email,
    leeftijd: req.body.leeftijd,
    woonplaats: req.body.woonplaats,
    wachtwoord: req.body.wachtwoord, // Tip: In de toekomst hier bcrypt gebruiken!
  };
  try {
    await collection.insertOne(nieuwUser);
    // We sturen de naam mee naar de bevestigingspagina
    res.render('pages/overzicht', { 
      Naam: nieuwUser.name, 
      search: "" 
  });
  } catch (err) {
    res.send("Er ging iets mis met opslaan.");
  }
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
