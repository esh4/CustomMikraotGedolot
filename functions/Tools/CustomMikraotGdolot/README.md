# CustomMikraotGedolot

This is the module responsible for generating the final Mikraot Gedolot PDF. 
The script, written in python, gets all the relevant texts from Sefaria's API, processes it and organizes it and then inserts in into an HTML template with Jina2. That HTML file is subsequently converted to PDF format using [Prince](https://www.princexml.com/).

## Running the code:
The code is run by calling GeneratePage_cli.py with the following arguments: 
-b <book> 
-c <list of commentators> (their base_ref)
-t <traslation> (i.e what version of the text including the language code)
--out <name to save the book under>
--range 
  
for example: 
>> python GeneratePage_cli.py -b Genesis -t "en/Bible du Rabbinat 1899 [fr]" -c "Rashi on Genesis" "Malbim on Genesis" "Yeriot Shlomo on Torah, Genesis" --out Bereishit --range "(3, 7)"

### Dependancies:
- Jinja2
- Prince
- aiohttp
- argparse
