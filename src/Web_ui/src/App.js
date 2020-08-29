import React from 'react';
import './App.css';
import MG_generator_ui from './Components/MG_generator_ui'
import BookDisplay from './Components/BookDisplay'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Custom Mikraot Gedolot Generator</h1>
        <h2>Submitted to the Sefaria Contest by: Eshel Sinclair</h2>
      </header>

      <div id="body">
      <div class="instructions">
            <h3 class="instructions">Details</h3>
            <p>
            With our app, based on Sefaria's Yam Shel Torah, you can now create your own Mikraot Gedolot! <br/>
            You choose the book from Tanach, and then you can choose any one of Sefaria's translations on that book, and up to 9 commentaries on the book. The PDF that the app then creates is downloadable and printable, and it's just like the best of today's modern Mikraot Gedolot. Readable print, and the commentaries on a pasuk stay on the page, so no flipping back and forth! <br/>
Our app is great for anyone who wants to utilize Sefaria and likes learning in the Mikraot Gedolot format. It could be great for teachers who want to prepare sefarim for their students with only specific commentaries. 
We think our app can really help us all learn Torah.        </p>
          </div>
        <section class="info">
          <div class="instructions">
            <h3>Instructions:</h3>
            <p>
              1. Choose a book from the Tanakh. <br />
          2. Choose a translation that will appear alongside the source. <br />
          3. Choose any number of commentators that you wish to appear in your book.<br />
          4. Click "generate". <br />
          5. Wait until the script finishes creating the book and click to download the book. (this can take up to a couple of minutes)
        </p>
          </div>
          <div class="instructions">
            <h3>Demo version disclaimer:</h3>
            <p>
              This is a demo version of the complete project, and is thus limited as follows: <br/>
              - Generating a Mikraot Gedolot book for and entire <i>sefer</i> is a long process (can take up to an hour due to many calls to the Sefaria API and compiling it into a PDF), 
              therefore this demo is limited to the first 2 chapters. I plan to implement better concurrency so that the process takes substancially less time in the future. <br/>
              - JPS Footnotes and Sefer HaMitzvot are currently unsupported.  
            </p>
            <p>
              You can look through a few examples I generated <a target="_blank" href='https://www.dropbox.com/s/17zw7lye3i8yps5/Esther%20Chapter%201.pdf?dl=0'>here</a>
            </p>
          </div>
        </section>

        <MG_generator_ui></MG_generator_ui>
        <footer>
          <p>
            This project uses the non-commercial version of Prince <a target="_blank" href="https://www.princexml.com">www.princexml.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
