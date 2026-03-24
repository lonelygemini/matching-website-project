// ===============================
// Load environment variables
// ===============================
require('dotenv').config()

// ===============================
// Dependencies
// ===============================
const express = require('express')
const session = require('express-session')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const fetchFn = global.fetch
  ? global.fetch
  : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
// ===============================
// Express setup
// ===============================
const app = express()
const port = 1500

app.use(session({
  secret: 'emergencykey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}))

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

  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`);
  });


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

app.get('/overzicht', async (req, res) => {

  const db = client.db(process.env.DB_NAME);
  const collection = db.collection(process.env.DB_COLLECTION);

  const search = req.query.search || "";

  const jobs = await collection.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { locations: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } }
    ]
  }).toArray();

  // 🔹 5 willekeurige jobs
  const randomJobs = await collection.aggregate([
    { $sample: { size: 5 } }
  ]).toArray();

  res.render('pages/overzicht', {
    jobs: jobs,
    search: search,
    randomJobs: randomJobs
  });

});



app.get("/filter", async (req, res) => {

  const db = client.db(process.env.DB_NAME);

  const location = req.query.location;
  const company = req.query.company;
  const work_schedule = req.query.work_schedule;
  const sort = req.query.sort;

  let query = {};

  if (location && location !== "alles") {
    query.locations = { $regex: location, $options: "i" };
  }

  if (company) {
    if (Array.isArray(company)) {
      query.company = { $in: company };
    } else {
      query.company = company;
    }
  }

  if (work_schedule) {
    query.work_schedule = work_schedule;
  }

  // 👇 HIER komt je pipeline
  const pipeline = [
    { $match: query },
    {
      $addFields: {
        dateObj: { $toDate: "$date" }
      }
    }
  ];

  if (sort === "newest") {
    pipeline.push({ $sort: { dateObj: -1 } });
  } else if (sort === "oldest") {
    pipeline.push({ $sort: { dateObj: 1 } });
  }

  const jobs = await db.collection("jobs")
    .aggregate(pipeline)
    .toArray();

    

  res.render("pages/filter", { 
    jobs,
    filters: req.query 
  });

});


app.get('/detail/:jobID', async (req, res) => {

  const db = client.db(process.env.DB_NAME);
  const collection = db.collection(process.env.DB_COLLECTION);

  const jobID = req.params.jobID;

  const job = await collection.findOne({
    _id: new ObjectId(jobID)
  });

  // 5 willekeurige vacatures
  const randomJobs = await collection.aggregate([
    { $sample: { size: 5 } }
  ]).toArray();

  res.render('pages/detail', {
    job: job,
    randomJobs: randomJobs
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
  const db = client.db(process.env.DB_NAME_USERS);
  const collection = db.collection(process.env.DB_COLLECTION_USERS);
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
    req.session.user = { 
      _id: gebruikerGevonden._id, 
      email: gebruikerGevonden.email 
    };

    // Als hij hier komt, is de login gelukt
    console.log('Login succesvol voor:', gebruikerGevonden.email);
    return res.redirect('/overzicht')

  } catch (error) {
    console.error('Database fout:', error);
    return res.render('pages/inlog', { error: 'Database fout' });
  }
}

// ===============================
// Registratie
// ===============================

app.get('/registratie', (req, res) => {
  res.render('pages/registratie', {error:""})
})

app.get('/registratie', (req, res) => {
  res.render('pages/registratie');
});// Route om de ingevulde data te verwerken

app.post('/nieuweregistratie', async (req, res) => {
  const db = client.db(process.env.DB_NAME_USERS);
  const collection = db.collection(process.env.DB_COLLECTION_USERS);
  const nieuwUser = {
    name: req.body.name,
    datum: req.body.datum,
    email: req.body.email,
    leeftijd: req.body.leeftijd,
    woonplaats: req.body.woonplaats,
    wachtwoord: req.body.wachtwoord, // Tip: In de toekomst hier bcrypt gebruiken!
    favorites: []
  };
  try {
    await collection.insertOne(nieuwUser);
    // We sturen de naam mee naar de bevestigingspagina
    res.render('pages/overzicht', { 
      Naam: nieuwUser.name, 
      search: "" 
  });
  } catch (error) {
    res.send("Er ging iets mis met opslaan.");
  }
});

app.get('/filter', (req, res) => {
  res.render('pages/filter'); 
});

app.get('/detail/:jobID', (req, res) => {
  
  const db = client.db(process.env.DB_NAME);
  collection = db.collection(process.env.DB_COLLECTION);
  
  //in de db  zoeken
  console.log(req.params.jobID)
  res.send("job id = " +req.params.jobID); 
});

// ===============================
// Favourites
// ===============================

app.post('/favorites/add/:jobID', async (req, res) => {
  const db = client.db(process.env.DB_NAME_USERS);
  const collection = db.collection(process.env.DB_COLLECTION_USERS);

  if (!req.session.user) {
    return res.redirect('/inlog');
  }

  const userId = req.session.user._id;
  const jobID = req.params.jobID;

  try {
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: jobID } }
    );

    res.redirect('/favorites');
  } catch (error) {
    console.error(error);
    res.send('Fout bij toevoegen aan favorieten');
  }
});

app.post('/favorites/remove/:jobID', async (req, res) => {
  const db = client.db(process.env.DB_NAME_USERS);
  const collection = db.collection(process.env.DB_COLLECTION_USERS);

  if (!req.session.user) {
    return res.redirect('/inlog');
  }

  const userId = req.session.user._id;
  const jobID = req.params.jobID;

  try {
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: jobID } }
    );

    res.redirect('/favorites');
  } catch (error) {
    console.error(error);
    res.send('Fout bij verwijderen uit favorieten');
  }
});

app.get('/favorites', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/inlog');
  }

  const usersDb = client.db(process.env.DB_NAME_USERS);
  const usersCollection = usersDb.collection(process.env.DB_COLLECTION_USERS);

  const jobsDb = client.db(process.env.DB_NAME);
  const jobsCollection = jobsDb.collection(process.env.DB_COLLECTION);

  try {
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.session.user._id)
    });

    const favoriteIds = (user.favorites || []).map(id => new ObjectId(id));

    const jobs = await jobsCollection.find({
      _id: { $in: favoriteIds }
    }).toArray();

  res.render('pages/favorites', { jobs });
} catch (error) {
  console.error(error);
  res.send('Fout bij ophalen van favorieten');
}
});

// ===============================
// profiel
// ===============================
app.get('/profiel', async (req, res) => {
  // 1. Check of de gebruiker in de sessie staat
  if (!req.session.user) {
      return res.redirect('/inlog'); // Niet ingelogd? Terug naar inloggen.
  }

  try {
      const db = client.db(process.env.DB_NAME_USERS);
      const collection = db.collection(process.env.DB_COLLECTION_USERS);

      // 2. Zoek de gebruiker op basis van de ID in de sessie
      // We gebruiken req.session.user._id die je in verwerkForm hebt opgeslagen
      const gebruiker = await collection.findOne({ 
          _id: new ObjectId(req.session.user._id) 
      });

      // 3. Stuur de gevonden gegevens naar de pagina
      res.render('pages/profiel', { 
          data: gebruiker 
      });
  } catch (error) {
      console.error("Fout bij laden profiel:", error);
      res.status(500).send("Fout bij laden profiel");
  }
});
// app.get('/profiel', async (req, res) => {
//   // 1. Maak verbinding met de specifieke Users database
//   const db = client.db(process.env.DB_NAME_USERS); 
//   // 2. Selecteer de juiste collectie
//   const collection = db.collection(process.env.DB_COLLECTION_USERS);

//   try {
//       // 3. Haal de gebruikers op en zet ze in een array

     
//       const gebruikers = await collection.findOne({
//         _id: new ObjectId(userID)
//       })

//       // 4. Stuur de data naar de EJS pagina
//       // LET OP: de naam links (data) moet gelijk zijn aan wat je in EJS gebruikt
//       res.render('pages/profiel', { 
//           data: gebruikers 
//       });
//   } catch (error) {
//       console.error("Fout bij ophalen profiel:", error);
//       res.status(500).send("Database fout");
//   }
// });
// ===============================
// Route functions
// ===============================
app.get('/footer', (req, res) => {
  res.render('partials/footer'); 
});

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

//================================
// range slider voor filter balk 
//================================

