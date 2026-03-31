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
const multer = require('multer');
const path = require('path'); 

const bcrypt = require('bcryptjs'); 
const saltRounds = 10;

// ===============================
// Multer setup
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Vertel multer dat bestanden in de 'uploads' map moeten landen
    cb(null, 'static/images/uploads') 
  },
  filename: (req, file, cb) => {
    // Geef elk bestand een unieke naam (huidige tijd + extensie)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) 
  }
})
const upload = multer({ storage: storage })
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

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

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
let collection

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
    console.log('Database connection established')
    // Hier selecteer je de juiste database en collectie uit je .env

  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`)
  })


// ===============================
// Data
// ===============================
//const db = client.db(process.env.DB_NAME);
//collection = db.collection(process.env.DB_COLLECTION);

app.get('/kaartje', async (req, res) => {

  const db = client.db(process.env.DB_NAME)
  const collection = db.collection(process.env.DB_COLLECTION)

  const data = await collection.find().toArray()
      
  res.render('partials/kaartje', { data: data })
})

app.get(['/overzicht', '/filter'], async (req, res) => {
  const db = client.db(process.env.DB_NAME)
  const collection = db.collection(process.env.DB_COLLECTION)

  const search = req.query.search || ''
  const location = req.query.location
  const company = req.query.company
  const workSchedule = req.query.work_schedule
  const sort = req.query.sort
  // Bouw query
  let query = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { locations: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ]
  }

  if (location && location !== 'alles') {
    query.locations = { $regex: location, $options: 'i' }
  }

  if (company) {
    if (Array.isArray(company)) {
      query.company = { $in: company }
    } else {
      query.company = company
    }
  }

  if (workSchedule) {
    query.workSchedule = workSchedule
  }

  // Pipeline voor sort
  const pipeline = [
    { $match: query },
    { $addFields: { dateObj: { $toDate: '$date' } } }
  ]

  if (sort === 'newest') pipeline.push({ $sort: { dateObj: -1 } })
  if (sort === 'oldest') pipeline.push({ $sort: { dateObj: 1 } })

  const jobs = await collection.aggregate(pipeline).toArray()

  // 5 willekeurige jobs (optioneel)
  const randomJobs = await collection.aggregate([{ $sample: { size: 5 } }]).toArray()

  // Kies view
  const viewName = req.path === '/filter' ? 'pages/filter' : 'pages/overzicht'

  res.render(viewName, {
    jobs,
    search: req.query.search || '',
    randomJobs,
    filters: req.query, // hier kan je alles van search/sort doorgeven
  })
})

app.get('/detail/:jobID', async (req, res) => {

  const db = client.db(process.env.DB_NAME)
  const collection = db.collection(process.env.DB_COLLECTION)

  const jobID = req.params.jobID

  const job = await collection.findOne({
    _id: new ObjectId(jobID)
  })

  // 5 willekeurige vacatures
  const randomJobs = await collection.aggregate([
    { $sample: { size: 5 } }
  ]).toArray()

  res.render('pages/detail', {
    job: job,
    randomJobs: randomJobs
  })

})

// ===============================
// Route
// ===============================

//================================
// index page
//================================

// set the view engine to ejs
app.set('view engine', 'ejs')

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) { 
  if (req.session.user) { // als ingelogd
    req.session.destroy() // log uit
  }
  res.render('pages/index')
})

//================================
// inlog
//================================
app.get('/inlog', (req, res) => {
  res.render('pages/inlog', {error:''})
})

app.get('/inlog', showForm)
app.post('/verwerkform', verwerkForm)

function showForm(req, res) {
  res.render('pages/inlog')
}
async function verwerkForm(req, res) {
  const db = client.db(process.env.DB_NAME_USERS);
  const collection = db.collection(process.env.DB_COLLECTION_USERS);
  
  const emailInput = req.body.email;
  const wachtwoordInput = req.body.wachtwoord;

  try {
    // 1. Zoek de gebruiker alleen op email
    const gebruikerGevonden = await collection.findOne({ email: emailInput });

    // 2. Als de email niet bestaat
    if (!gebruikerGevonden) {
      return res.render('pages/inlog', { error: 'E-mail of wachtwoord onjuist' })
    }

    // 3. Vergelijk het ingevoerde wachtwoord met de hash uit de database
    const match = await bcrypt.compare(wachtwoordInput, gebruikerGevonden.wachtwoord);

    if (match) {
      // Wachtwoord klopt!
      req.session.user = { 
        _id: gebruikerGevonden._id, 
        email: gebruikerGevonden.email,
        profielfoto: gebruikerGevonden.profielfoto
      };
      return res.redirect('/overzicht');
    } else {
      // Wachtwoord klopt niet
      return res.render('pages/inlog', { error: 'E-mail of wachtwoord onjuist' });
    }

  } catch (error) {
    console.error('Database fout:', error)
    return res.render('pages/inlog', { error: 'Database fout' })
  }
}

app.get('/uitlog', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Fout bij uitloggen')
    }
    res.redirect('/')
  })
})

// ===============================
// Registratie
// ===============================

app.get('/registratie', (req, res) => {
  res.render('pages/registratie', {error:''})
})

// app.get('/registratie', (req, res) => {
//   res.render('pages/registratie');
// });
app.post('/nieuweregistratie', upload.single('profielfoto'), async (req, res) => {
  const db = client.db(process.env.DB_NAME_USERS)
  const collection = db.collection(process.env.DB_COLLECTION_USERS)
  
  const fotoPad = req.file 
    ? '/images/uploads/' + req.file.filename 
    : '/images/profiel.png'

  try {
    // HASHTAG TIJD: Hash het wachtwoord voordat we de user maken
    const hashedPassword = await bcrypt.hash(req.body.wachtwoord, saltRounds);

    const nieuwUser = {
      name: req.body.name,
      datum: req.body.datum,
      email: req.body.email,
      leeftijd: req.body.leeftijd,
      woonplaats: req.body.woonplaats,
      wachtwoord: hashedPassword, // Sla de hash op, niet het tekstwachtwoord!
      profielfoto: fotoPad,
      favorites: []
    };

    const result = await collection.insertOne(nieuwUser);
    
    req.session.user = { 
      _id: result.insertedId, 
      email: nieuwUser.email,
      name: nieuwUser.name,
      profielfoto: nieuwUser.profielfoto
    }

    res.redirect('/overzicht');
  } catch (err) {
    console.error(err);
    res.send("Er ging iets mis met de registratie.");
  }
})

app.get('/filter', (req, res) => {
  res.render('pages/filter')
})

app.get('/detail/:jobID', (req, res) => {
  
  const db = client.db(process.env.DB_NAME)
  collection = db.collection(process.env.DB_COLLECTION)
  
  console.log(req.params.jobID)
  res.send('job id = '+req.params.jobID)
})

// ===============================
// Favourites
// ===============================

app.post('/favorites/add/:jobID', async (req, res) => {
  const db = client.db(process.env.DB_NAME_USERS)
  const collection = db.collection(process.env.DB_COLLECTION_USERS)

  if (!req.session.user) {
    return res.redirect('/inlog')
  }

  const userId = req.session.user._id
  const jobID = req.params.jobID

  try {
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: jobID } }
    )

    res.json({ success: true, action: 'added' })
  } catch (error) {
    console.error(error)
    res.send('Fout bij toevoegen aan favorieten')
  }
})

app.post('/favorites/remove/:jobID', async (req, res) => {
  const db = client.db(process.env.DB_NAME_USERS)
  const collection = db.collection(process.env.DB_COLLECTION_USERS)

  if (!req.session.user) {
    return res.redirect('/inlog')
  }

  const userId = req.session.user._id
  const jobID = req.params.jobID

  try {
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: jobID } }
    )

    res.redirect( '/favorites' );
  } catch (error) {
    console.error(error)
    res.send('Fout bij verwijderen uit favorieten')
  }
})

app.get('/favorites', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/inlog')
  }

  const usersDb = client.db(process.env.DB_NAME_USERS)
  const usersCollection = usersDb.collection(process.env.DB_COLLECTION_USERS)

  const jobsDb = client.db(process.env.DB_NAME)
  const jobsCollection = jobsDb.collection(process.env.DB_COLLECTION)

  try {
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.session.user._id)
    })

    const favoriteIds = (user.favorites || []).map(id => new ObjectId(id))

    const jobs = await jobsCollection.find({
      _id: { $in: favoriteIds }
    }).toArray()
   
    res.render('pages/favorites', { jobs })
  } catch (error) {
    console.error(error)
    res.send('Fout bij ophalen van favorieten')
  }
})

// ===============================
// profiel
// ===============================
app.get('/profiel', async (req, res) => {
  // 1. Check of de gebruiker in de sessie staat
  if (!req.session.user) {
    return res.redirect('/inlog') // Niet ingelogd? Terug naar inloggen.
  }

  try {
    const db = client.db(process.env.DB_NAME_USERS)
    const collection = db.collection(process.env.DB_COLLECTION_USERS)

    // 2. Zoek de gebruiker op basis van de ID in de sessie
    // We gebruiken req.session.user._id die je in verwerkForm hebt opgeslagen
    const gebruiker = await collection.findOne({ 
      _id: new ObjectId(req.session.user._id) 
    })

    // 3. Stuur de gevonden gegevens naar de pagina
    res.render('pages/profiel', { 
      data: gebruiker 
    })
  } catch (error) {
    console.error('Fout bij laden profiel:', error)
    res.status(500).send('Fout bij laden profiel')
  }
})


app.post('/delete-account', async (req, res) => {
  const db = client.db(process.env.DB_NAME_USERS)
  const collection = db.collection(process.env.DB_COLLECTION_USERS)

  console.log('Sessie data bij delete:', req.session)

  if (!req.session.user) {
    console.log('FOUT: req.session.user is leeg!')
    return res.status(401).send('Niet ingelogd.')
  }
  try {
    // We halen de gebruiker op uit de sessie. 
    // Controleer of jouw sessie-object inderdaad 'user' heet.
    const users = req.session.user

    if (!users) {
      return res.status(401).send('Niet ingelogd.')
    }

    // Verwijderen uit de collectie 'users' in de database 'JobConnect'
    // We gebruiken het _id dat MongoDB zelf heeft aangemaakt
    await db.collection('Users').deleteOne({ 
      _id: new ObjectId(users._id) 
    })

    // Belangrijk: Vernietig de sessie na het verwijderen zodat de gebruiker is uitgelogd
    req.session.destroy()

    console.log('Account succesvol verwijderd uit JobConnect.')
    res.redirect('/') // Stuur terug naar de home of inlogpagina

  } catch (error) {
    console.error('Fout bij verwijderen:', error)
    res.status(500).send('Kon account niet verwijderen.')
  }
  
})
// ===============================
// EDIT PROFIEL
// ===============================
app.get('/editprofiel', async (req, res) => {
  if (!req.session.user) return res.redirect('/inlog')

  const db = client.db(process.env.DB_NAME_USERS)
  const gebruiker = await db.collection(process.env.DB_COLLECTION_USERS).findOne({ 
    _id: new ObjectId(req.session.user._id) 
  })

  res.render('pages/editprofiel', { data: gebruiker })
})

app.post('/update-profiel', async (req, res) => {
  try {
    const db = client.db(process.env.DB_NAME_USERS)
    const collection = db.collection(process.env.DB_COLLECTION_USERS)

    await collection.updateOne(
      { _id: new ObjectId(req.session.user._id) },
      { $set: {
        name: req.body.name,
        woonplaats: req.body.woonplaats,
        email: req.body.email
      }}
    )

    // Update ook de sessie als de naam of email is veranderd
    req.session.user.email = req.body.email
      
    req.session.save(() => {
      res.redirect('/profiel')
    })
  } catch (error) {
    res.send('Fout bij het bijwerken van je profiel.')
  }
})

// ===============================
// Route functions
// ===============================
app.get('/footer', (req, res) => {
  res.render('partials/footer')
})

// ===============================
// 404 handler
// ===============================
app.use((req, res) => {
  res.status(404).render('partials/notfound')
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

