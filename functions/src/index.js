const functions = require('firebase-functions');
var admin = require("firebase-admin");

const express = require('express')
const fs = require('fs')
var cors = require('cors')
const { spawn } = require('child_process');
const bodyParser = require("body-parser");
const { join } = require('path');
const path = require('path')
const app = express()
const port = 3002

app.use(cors({origin: true}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(join(__dirname, 'Web_ui', 'build')));

app.get('/', function(req, res) {
  res.sendFile(join(__dirname, 'Web_ui', 'build', 'index.html'));
});


app.post('/generate', (req, res) => {
    const book = req.body.book
    const trans = req.body.trans
    const coms = req.body.coms
    let fileIDs = JSON.parse(fs.readFileSync(join('Tools/CustomMikraotGdolot/generated/file_ids.json')))
    console.log(req.body)

    // TODO: change this to a real hashing function 
    var id = Math.round(Math.random() * 2048)
    fileIDs[id] = join('Tools/CustomMikraotGdolot/generated/', id.toString(), '/pdf/out.pdf')

    fs.writeFile('Tools/CustomMikraotGdolot/generated/file_ids.json', JSON.stringify(fileIDs), err => console.log(err))

    // console.log(fileIDs[id])
    var args = ['Tools/CustomMikraotGdolot/GeneratePage_cli.py', '-b', book, '--out', id, '-c']

    coms.map(c => {
        args.push(c.base_ref)
    })

    const python = spawn('python3', args)

    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    python.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    python.on('exit', c => {

    })

    res.send({ fileID: id })
})

app.get('/file/:id', (req, res) => {
    fileIDs = JSON.parse(fs.readFileSync('Tools/CustomMikraotGdolot/generated/file_ids.json'))
    if (fileIDs[req.params.id] == 504) {
        res.sendStatus(504)
        res.send()
    } else {
        console.log(fileIDs)
        fs.access(fileIDs[req.params.id], fs.F_OK, (err) => {
            if (err) {
                res.sendStatus(404)
                res.send()
                console.error(err)
                return
            }
            //file exists
            // console.log(path.basename())
            res.download(fileIDs[req.params.id])
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

exports.app = functions.https.onRequest(app);
