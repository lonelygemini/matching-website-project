# JobConnect

In het profileringsvak Project Tech, maken we (Team 4) een zogenaamde _matching website_ waar bezoekers content kunnen selecteren, filteren en/of sorteren, en aan elkaar kunnen worden gematcht op basis van gelijke interesses of omdat ze iets voor elkaar kunnen betekenen.

Voor dit project hebben we vacatures voor developers als thema gekozen. De website richt zich op het ondersteunen van bezoekers door hen, op basis van de informatie die zij zelf invoeren, te matchen met hun droombaan. Het is een professioneel matching desktop website.


## Demo


## Issues/ TO-DO's
1. Issue
We maken op dit moment gebruik van twee databases. Dit is natuurlijk niet de bedoeling.
 
To do
Alleen de database jobs gebruiken en dan een mapje users toevoegen. Dit moet dan uiteraard ook in de code aangepast worden.
 
2. Issue
Op de edit-pagina kan je je wachtwoord nog veranderen.
 
To do
Een aparte pagina maken voor het wijzigen van je wachtwoord en hier nog een extra beveiliging op zetten, zodat dit niet zomaar kan gebeuren. Eerst het oude wachtwoord vragen en dan pas je nieuwe kunnen maken of eerst een e-mail sturen ter controle.
 
3. Issue
De dark/light mode werkt nog niet naar behoren. Als je switch van pagina’s dan verdwijnt de dark mode.
 
To do
Ervoor zorgen dat als je dark mode hebt aanstaan hij aan blijft.
 
4. Issue
Bij het registratieformulier kan je een profielfoto toevoegen aan je account. Als je deze hebt toegevoegd krijg je een melding, maar krijg je je profielfoto nog niet te zien in het registratieformulier.
 
To do
Ervoor zorgen dat je je profielfoto na het selecteren gelijk ook in het registratieformulier te zien krijgt.
 
5. Issue
Code kan schoner
 
To do
Controleren op classes en CSS styling. We hebben gebruik gemaakt van heel veel classes en denken dat dit zeker minder kan. Controleer ook op dubbele CSS, vooral bij aanroeping van font-family en font-size.
 
6. Issue
We hebben weinig security… We gebruiken tot nu toe allen bycrypt en hash, maar dit kan natuurlijk uitgebreider.
 
To do
Meer security toevoegen, zoals rate limiting en account lockout.

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
├── node_modules/ # Alle externe bibliotheken die npm installeert (Express, EJS, etc.).
│
├── static/ # Bestanden die direct naar de browser worden gestuurd (geen bewerking nodig).
│   ├── images/ # Algemene afbeeldingen voor de website.
│   ├── logo-variants/ # Verschillende versies en formaten van je logo's.
│   ├── video/ # Videobestanden voor de site.
│   ├── script.js/ # Client-side JavaScript (bijv. voor animaties of formulier-checks).
│   └── style.css # De centrale stylesheet voor de vormgeving van je hele site.
│
├── views/ # De "gezichten" van je website (EJS templates).
│   ├── pages/ # De volledige pagina's die een eigen URL hebben.
│   │   ├── detail.ejs # Specifieke informatiepagina van één item/persoon.
│   │   ├── editprofiel.ejs # Formulier om een bestaand profiel aan te passen.
│   │   ├── favorites.ejs # Overzicht van de door de gebruiker bewaarde items.
│   │   ├── filter.ejs # Zoek- en filterinterface.
│   │   ├── index.ejs # De homepage (vaak de eerste pagina die je ziet).
│   │   ├── inlog.ejs # Het inlogscherm.
│   │   ├── overzicht.ejs # De verzamelpagina met alle matches/items.
│   │   ├── profiel.ejs # De persoonlijke profielpagina.
│   │   └── registratie.ejs # Pagina om een nieuw account aan te maken.
│   │
│   └── partials/ # Herbruikbare brokken code die je in de pages plakt.
│       ├── bookmark-card.ejs # Specifiek kaartje voor op de favorietenpagina.
│       ├── footer.ejs # De onderkant van de website (copyright, links).
│       ├── header.ejs # De bovenkant (navigatie, logo).
│       ├── kaartje.ejs # De standaard preview-kaart voor in het overzicht.
│       └── notfound.ejs # De 404-foutmelding pagina.
│
├── .env # Geheime variabelen (zoals database wachtwoorden).
├── .eslint.config.mjs # Regels voor de code-kwaliteit (linter).
├── .eslintignore # Bestanden die de linter moet overslaan.
├── .gitattributes # Instellingen voor hoe Git met bepaalde bestanden omgaat.
├── .gitignore # Vertelt Git welke bestanden NIET geüpload moeten worden (zoals node_modules).
├── package-lock.json # Exacte versies van dependencies voor consistentie.
├── package.json # De "inhoudsopgave" van je project met scripts en versies.
├── README.md # Uitleg over het project voor andere developers.
└── server.js # De hoofdmotor van je app; regelt de routes en start de server.

## Mappen uitleg
- **static/** → CSS en afbeeldingen  
- **views/** → EJS templates  
- **views/pages/** → volledige pagina's  
- **views/partials/** → herbruikbare componenten (header, footer, kaartjes)  
- **server.js** → Express server configuratie  
- **.env** → environment variables  

## Contributing
Bijdragen aan dit project zijn momenteel beperkt tot leden van Project Tech – Team 4.

Als je geen onderdeel bent van Team 4 maar wel suggesties, verbeteringen of een bug hebt gevonden, kun je een Issue openen in de repository op GitHub. Het team zal de suggestie bekijken en beslissen of deze wordt meegenomen.

### Voor Team 4 leden

Wanneer je bijdraagt aan het project:

- Maak een nieuwe branch voor je feature of bugfix
- Schrijf duidelijke en beschrijvende commits
- Test je wijzigingen voordat je ze indient
- Maak een Pull Request naar de main branch

Alle pull requests worden eerst door een ander teamlid beoordeeld voordat ze worden samengevoegd.

Door bij te dragen aan dit project ga je ermee akkoord dat jouw bijdragen vallen onder de MIT License. 

## Code of Conduct
- Wij maken de website in het Nederlands
- Als iemand een code van iemand anders heeft aangepast, dan melden we dit gelijk om conflicten te voorkomen.
- We kunnen pas een pull request sturen als iemand naar de code gekeken heeft.
- We geven elkaar tips als de code beter kan.
- We helpen elkaar bij merge conflicts.

## License
MIT License © 2026 Team 4