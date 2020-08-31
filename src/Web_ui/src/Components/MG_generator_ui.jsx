import React from 'react';
import axios from 'axios';
import './MG_generator_ui.css'
// import MultiSelect from "react-multi-select-component";
import ConfirmationDialog from './Dialog'
import CircularProgress from '@material-ui/core/CircularProgress';
// import Card from '@material-ui/core/Card';
// import { Dialog } from '@material-ui/core';
import AlertDialog from './AlertDialog';
import Select from 'react-select'


class MG_generator_ui extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBook: 'Genesis',
            availble_comms: [],
            bookOptions: [{
                part: 'Torah',
                books: ['Genesis']
            }],
            translationOptions: {},
            targumOptions: {},
            selectedTranslation: 'default',
            waitingForFile: false,
            alert: false
        };
        this.baseAPIurl = 'https://www.sefaria.org.il/api/';
        this.generatorServerBaseAPIurl = 'http://ec2-3-129-165-55.us-east-2.compute.amazonaws.com:3002/';

        this.getCommsForBook(this.state.selectedBook)
        this.getTranslationOptions(this.state.selectedBook)
        this.downloadRef = React.createRef()
    }

    listBibleBooks() {
        axios.get(this.baseAPIurl + 'index/')
            .then((res) => res.data).then(data => {
                data = data[0].contents;
                console.log(data.length);

                var bookOptions = [];
                var parts = ['Torah', 'Nevi\'im', 'Ketuvim']

                for (var i = 0; i < 3; i++) {
                    var subBookOption = [];
                    for (var j = 0; j < (data[i].contents).length; j++) {
                        subBookOption.push((data[i].contents)[j].title)
                    }
                    bookOptions.push({
                        books: subBookOption,
                        part: parts[i]
                    })
                }
                this.setState({ 'bookOptions': bookOptions })
            })
    }

    getCommsForBook(book) {
        axios.get(this.baseAPIurl + 'links/' + book + '.1?with_text=0').then(res => res.data)
            .then(data => {
                return data.filter(o => {
                    return o.type.toLowerCase() == 'commentary' && o.category.toLowerCase() == 'commentary';
                })
            })
            .then(data => {
                return data.map(o => {
                    var newObj = {
                        label: o.index_title,
                        value: o,
                        disabled: false
                    };
                    return newObj;
                });
            })
            .then(data => { //remove duplicates
                return data.filter((v, i, a) => a.findIndex(t => (t.label === v.label)) === i)
            })
            .then(data => {
                return data.map(o => {
                    o.base_ref = o.value.ref.slice(0, -5)
                    return o;
                })
            })
            .then(data => this.setState({ availble_comms: data }))
    }

    getTranslationOptions(book) {
        axios.get(this.baseAPIurl + 'texts/' + book + '.1.3?pad=0').then(res => res.data)
            .then(t => {
                return t.versions.map(o => {
                    var newObj = {
                        label: o.versionTitle,
                        value: t.ref + '/' + o.language + '/' + o.versionTitle,
                        disabled: false
                    };
                    return newObj;
                });
            }).then(trans => this.setState({ translationOptions: trans }));

        axios.get(this.baseAPIurl + 'links/' + book + '.1.3?with_text=0').then(res => res.data)
            .then(data => data.filter(o => o.type.toLowerCase() == 'targum'))
            .then(t => {
                return t.map(o => {
                    var newObj = {
                        label: o.index_title,
                        value: o.ref,
                        disabled: false
                    };
                    return newObj;
                })
            })
            .then(data => this.setState({ targumOptions: data }))
    }

    componentDidMount() {
        this.listBibleBooks();
    }

    requestBook() {
        clearInterval(this.intervalID)
        axios.post(this.generatorServerBaseAPIurl + 'generate',
            {
                book: this.state.selectedBook,
                trans: this.state.selectedTranslation,
                coms: this.state.selected_comm,
            })
            .then(res => { this.setState({ fileID: res.data.fileID }) })
            .then(() => { this.setState({ waitingForFile: true }) })
            .then(() => {
                this.intervalID = setInterval(() => {
                    axios.get(this.generatorServerBaseAPIurl + 'file/' + this.state.fileID, { responseType: 'blob' })
                        .then(res => {
                            if (res.status == 200 || res.status == 304) {
                                var myBlob = new Blob([res.data], {
                                    type: 'application/pdf'
                                });
                                var blobUrl = URL.createObjectURL(myBlob);
                                if (this.state.waitingForFile){
                                    this.downloadRef.current.click()
                                }
                                this.setState({
                                    bookURL: blobUrl,
                                    waitingForFile: false
                                })
                                clearInterval(this.intervalID);
                            }
                        })
                        .catch(err => {
                            if (err.status == 504) {
                                this.setState({ alert: true })
                                clearInterval(this.intervalID);
                            }
                        })
                }, 2000)
            })
    }

    render() {
        return (
            <div id="main">
                <h3>Mikraot Gedolot Generator</h3>
                <hr />
                <div id="form">
                    <ConfirmationDialog options={this.state.bookOptions} onChange={b => {
                        this.setState({ selectedBook: b })
                        this.getCommsForBook(b)
                        this.getTranslationOptions(b)
                    }}></ConfirmationDialog>
                    <br />
                    <div class='select'>
                        <Select
                            placeholder="Select a translation..."
                            options={
                                [{
                                    label: 'Targumim',
                                    options: this.state.targumOptions
                                },
                                {
                                    label: 'Text versions',
                                    options: this.state.translationOptions
                                }]
                            }
                            onChange={t => this.setState({ selectedTranslation: t.value })}></Select>
                    </div>
                    <div class='select'>
                        <Select
                            class='select'
                            placeholder="Select commentators..."
                            options={this.state.availble_comms}
                            isMulti
                            onChange={b => this.setState({ selected_comm: b })}
                        >
                        </Select>
                    </div>
                    <br />
                    <input type="submit" value="Generate Mikraot Gedolot" onClick={() => {this.requestBook()}}></input>
                </div>
                {this.state.waitingForFile ? <CircularProgress /> :
                    <a ref={this.downloadRef} disabled={!this.state.waitingForFile} href={this.state.bookURL} download={this.state.selectedBook + '.pdf'}>Click Here if the download has not begun</a>}

                {this.state.alert ? <AlertDialog message={"Currently, JPS footnotes are unsupported. If you are not using JPS footnotes please contact the developers."}></AlertDialog> : <></>}
            </div>
        )
    }
}

export default MG_generator_ui