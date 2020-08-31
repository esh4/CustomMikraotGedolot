import React from 'react';
import './App.css';
import MG_generator_ui from './Components/MG_generator_ui'
import esh_img from './resources/esh.jpg'
import ben_img from './resources/ben.jpg'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Custom Mikraot Gedolot</h1>
        <h2>Submitted to the Sefaria Contest by: Eshel Sinclair and Ben Gold</h2>
      </header>

      <div id="page-one">
        {/* Col 1 */}
        <div id='instructions'>
          <h1>Create your own Mikraot Gedolot!</h1>
          <h3>Based on Sefaria</h3>
          <br />
            <ol>
              <li>Choose the book from Tanach.</li>
              <li>Choose any one of Sefaria's translations on that book.</li>
              <li>Choose up to 9 commentaries on the book. </li>
              <li>Download the PDF. </li>
            </ol>
          <p>
            Readable print, and the commentaries on a verse stay on the page, so no flipping back and forth!
            </p>
            <ul>
              <li>Great for anyone who wants to utilize Sefaria and likes learning in the Mikraot Gedolot format. </li>
              <li>Great for teachers who want to prepare sefarim for their students with only specific commentaries. </li>
            </ul>
        </div>
        <div id='generator'>
          <MG_generator_ui></MG_generator_ui>
        </div>
        <div id='disclaimer'>
          <h2>Demo version disclaimer:</h2>
          <p>This is a demo version of the complete project, and is thus limited as follows:
            
          </p>
          <ul>
              <li>Generating a Mikraot Gedolot book for and entire sefer is a long process (can take up to an hour due to many calls to the Sefaria API and compiling it into a PDF), therefore this demo is limited to the first 5 verses. I plan to implement better concurrency so that the process takes substancially less time in the future. </li>
              <li>JPS Footnotes are currently unsupported.</li>
            </ul>
          <p><a rel="noopener noreferrer" target='_blank' href='https://drive.google.com/drive/folders/1BHK6VQOcy2prSw-vCz7UTTvUmS7AFjSZ?usp=sharing'>Here</a> you can find a few examples that we've precompiled</p>
        </div>
      </div>
      <hr></hr>
      <div id='notes'>
        <div class='bio'>
          <div class='profile'>
            <img alt='' src={esh_img} class='profile-pic'></img>
            <h2>Eshel Sinclair</h2>
          </div>
          <p>
            Eshel has just finished a gap year program at the Hartman Institute in Jerusalem, and will be drafting to a cyber position in the IDF this fall. He currently lives with his family in Modi'in
            and is planning on spending a few months doing a Shanna Bet program in the Galilee until his draft date. <br />
            Eshel was responsible for the developement of this project. <br />
            Contact Eshel at <a href='mailto: eshel.sinclair@gmail.com'>eshel.sinclair@gmail.com</a>
          </p>
        </div>
        <div class='bio'>
          <div class='profile'>
            <img alt='' src={ben_img} class='profile-pic'></img>
            <h2>Ben Gold</h2>
          </div>
          <p>Ben lives in Modiin with his wife and 3 kids. He loves books and Tanach. He’s a technical writer and knowledge manager. <br />
          This app was Ben’s idea originally, and Ben’s responsibility was designing the app interface and the PDF output. <br />
          Contact Ben at <a href='mailto: brichva@gmail.com'>brichva@gmail.com</a> </p>
        </div>

      </div>
      <footer>
        <p>
          This project uses the non-commercial version of Prince <a rel="noopener noreferrer" target="_blank" href="https://www.princexml.com">www.princexml.com</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
