import React from 'react';
import './App.css';
import MG_generator_ui from './Components/MG_generator_ui'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Custom Mikraot Gedolot Generator</h1>
        <h2>Submitted to the Sefaria Contest by: Eshel Sinclair</h2>
      </header>

      <div id="body">
      <div class="instructions">
            <h3>Details</h3>
            <p>
              explanation here
        </p>
          </div>
        <section class="info">
          <div class="instructions">
            <h3>Instructions:</h3>
            <p>
              1. Choose a book from the Tanakh. <br />
          2. Choose a translation that will apear alongside the source. <br />
          3. Choose any number of commentators that you wish to upear in your book.<br />
          4. Click "generate". <br />
          5. Wait until the script finishes creating the book and click to download the book. (this can take up to a couple of minutes)
        </p>
          </div>
          <div class="instructions">
            <h3>Demo version disclaimer:</h3>
            <p>
              This is a demo version of the complete project, and is thus limited as follows: <br/>
              - Generating a Mikraot Gedolot book for and entire <i>sefer</i> is a long process (can take up to an hour due to many calls to the Sefaria API and compiling it into a PDF), 
              therefor this demo is limited to the first 5 verses.  <br/>
              - JPS Footnotes are currently unsupported.  
            </p>
          </div>
        </section>

        <MG_generator_ui></MG_generator_ui>

        <footer>
          <p>
            This project uses the non-commercial version of Prince www.princexml.com
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
