import React from 'react';
import './App.css';
import MG_generator_ui from './Components/MG_generator_ui'
import BookDisplay from './Components/BookDisplay'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Custom Mikraot Gedolot</h1>
        <h2>Submitted to the Sefaria Contest by: Eshel Sinclair and Ben Gold</h2>
      </header>

      <div id="body">
        <div id="main">
          {/* Col 1 */}
          <div id=''>
            <h1>Create your own Mikraot Gedolot!</h1>
            <h3>Based on Sefaria</h3>

            <ol>
              <li>Choose the book from Tanach.</li>
            </ol>
          </div>

        </div>

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
