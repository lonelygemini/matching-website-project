### JobConnect

In het profileringsvak Project Tech, maken we (Team 4) een zogenaamde _matching website_ waar bezoekers content kunnen selecteren, filteren en/of sorteren, en aan elkaar kunnen worden gematcht op basis van gelijke interesses of omdat ze iets voor elkaar kunnen betekenen.

Voor dit project hebben we vacatures voor developers als thema gekozen. De website richt zich op het ondersteunen van bezoekers door hen, op basis van de informatie die zij zelf invoeren, te matchen met hun droombaan. Het is een professioneel matching desktop website.


## Demo


## Issues/ TO-DO's


## Features
Op de Jobconnect website kun je: 
* Inloggen of registreren
* Filteren naar vacature via zoekbalk of filterbar
* Je eigen account beheren
* Favorieten vacature opslaan
* Details van vacture bekijken
* Veilig de website gebruiken

## Installatie
1. Clone de repository
git clone https://github.com/username/projectnaam.git

2. Ga naar de map
cd projectnaam

3. Installeer dependencies
npm install

4. Installeer package
npm install Express

5. Koppel de MongoDB Database
npm install mongodb


## .ENV sample
/lege kopie van .env bestand/ 


## Gebruik
Open http://localhost:1500 in je browser.


## Tech Stack
- JavaScript
- Nodemon.js
- Express
- MongoDB
- package.json
- Ejs template
- CSS

## Projectstructuur
matching-website-project/
│
├── node_modules/
│
├── static/
│ ├── image/
│ └── style.css
│
├── views/
│ ├── pages/
│ │ ├── detail.ejs
│ │ ├── favorites.ejs
│ │ ├── filter.ejs
│ │ ├── index.ejs
│ │ ├── inlog.ejs
│ │ ├── overzicht.ejs
│ │ ├── registratie.ejs
│ │ └── submitted.ejs
│ │
│ └── partials/
│ ├── bookmark-card.ejs
│ ├── footer.ejs
│ ├── header.ejs
│ └── kaartje.ejs
│
├── .env
├── .gitattributes
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js

## Mappen uitleg
- **static/** → CSS en afbeeldingen  
- **views/** → EJS templates  
- **views/pages/** → volledige pagina's  
- **views/partials/** → herbruikbare componenten (header, footer, kaartjes)  
- **server.js** → Express server configuratie  
- **.env** → environment variables  

## Contributing
Alleen leden van profileringsvak Project Tech, Team 4 mogen aanpassingen doen en pull request sturen. 
Mocht er aanpassingen zijn die aangeraden worden buiten dit team vragen we jou contact op te nemen met dit Team.


## Code of Conduct
/hoe wij communiceren/ 