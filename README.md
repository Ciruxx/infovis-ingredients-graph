# Dynamic Rect

## Informazioni tecniche

Il progetto è stato sviluppato con il framework [React.js](https://it.reactjs.org/).

Il cuore del progetto è la libreria [Vis.js](https://visjs.org), la quale gestisce la visualizzazione del grafo degli 
alimenti.

Le bandiere nazionali sono state recuperate grazie a [CountryFlags](https://www.countryflags.io), una semplice api che 
restituisce le bandiere nazionali a partire da un codice.

Tutti i path specificati in questo README.md sono relativi alla root di questo progetto.
 
Per avviare questo progetto è necessario installare [Node.js](https://nodejs.org/it/) e [NPM](https://www.npmjs.com/), 
per entrambi basta seguire questa [guida ufficiale](https://nodejs.org/it/download/).

## Struttura del progetto

Dal punto di vista del progetto sono interessanti: 
 - Il file `./src/data/TheMealDB.js`
    - Il quale contiene il codice necessario all'interrogazione del database degli alimenti.
 - La cartella `./src/components`
    - La cartella che contiene tutti i principali componenti dell'app.

### Componenti

#### Ingredients Chart Page
IngredientsChartPage.js è una classe Javascript che estende un componente React.

Questo componente visualizza la pagina principale dell'app, non ha metodi particolari.

#### Ingredients Chart

IngredientsChart.js è una classe Javascript che estende un componente React.

Questo componente si occupa di gestire Vis.js e gli eventi di click.

I principali metodi della classe sono i seguenti: 
 - `constructor`
    - Il costruttore della classe, vengono inizializzate tutte le variabili globali e gli eventi.
 - `componentDidMount`
    - Questo metodo viene eseguito solo quando il componente viene montato, è utilizzato per inizializzare Vis.js con la
    rete iniziale.
 - `rightClick`
    - Questo metodo intercetta il click destro e si occupa di eliminare tutti i nodi non più necessari dalla 
    visualizzazione.
 - `nodeDifference`
    - Metodo helper per fare la differenza tra nodi.
 - `singleClick`
    - Questo metodo intercetta il singolo click sinistro e si occupa di aprire il drawer con le informazioni del nodo 
    selezionato, recuperandole dal MealDB.
 - `getContent`
    - Metodo helper per generare il contenuto del drawer.
 - `doubleClick`
     - Questo metodo intercetta il doppio click sinistro e si occupa di espandere il nodo selezionato.
 - `render`
    - Questo metodo contiene il [JSX](https://it.reactjs.org/docs/introducing-jsx.html) del componente, ovvero, la 
    struttura simil html del componente, è un metodo obbligatorio in React.js.
 - `getNetwork`
    - Metodo helper che restituisce l'oggetto Vis.js.
 - `getNetwork`
     - Metodo helper che setta lo stato interno quando il drawer viene chiuso.
 - `getCountryCode`
     - Metodo helper che traduce il nome di un paese con il codice CountryFlags corrispondente.
     
#### Drawer
Drawer.js è una classe Javascript che estende un componente React.

Questo componente visualizza il drawer con un contenuto passato per argomento, è stato reso così indipendente dal contenuto
e dinamico, non ha metodi particolari.

## Test

**Solo la prima volta** che si scarica questo repository bisogna installare le dipendenze: 

### `npm install`

Nella root del progetto puoi avviare l'app con il comando:

### `npm start`

Questo comando avvia l'app in modalità development.

Apri [http://localhost:3000](http://localhost:3000) sul tuo browser per accedere all'app.

La pagina si ricaricherà automaticamente se fai una modifica al codice, gli eventuali errori verranno stampati sulla console.