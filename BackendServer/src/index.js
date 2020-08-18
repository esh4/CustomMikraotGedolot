const express = require('express')
const fs = require('fs')
var cors = require('cors')
const { spawn } = require('child_process');
const bodyParser = require("body-parser");
const { join } = require('path');
const app = express()
const port = 3002

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var fileIDs = {}

app.post('/generate', (req, res) => {
    const book = req.body.book
    const trans = req.body.trans
    const coms = req.body.coms

    // TODO: change this to a real hashing function 
    var id = Math.round(Math.random() * 2048)
    fileIDs[id] = join('Tools/CustomMikraotGdolot/generated/',book+'_'+ id, '/pdf/out.pdf')
    console.log(fileIDs[id])

    var args = ['Tools/CustomMikraotGdolot/GeneratePage_cli.py', '-b', book, '--out', book + '_' + id, '-c']

    coms.map(c => {
        args.push(c.label)
    })

    const python = spawn('python', args)

    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    python.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    python.on('exit', c => {
        // res.download('Tools/CustomMikraotGdolot/generated/' + book + '/pdf/out.pdf')
    })

    res.send({ fileID: id })
})

app.get('/file/:id', (req, res) => {
    fs.access(fileIDs[req.params.id], fs.F_OK, (err) => {
        if (err) {
            res.sendStatus(404)
            res.send()
            console.error(err)
            return
        }
        //file exists
        res.download(fileIDs[req.params.id])
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})