import React from 'react';
import axios from 'axios';
import './MG_generator_ui.css'
import CommInput from './CommInput'
import MultiSelect from "react-multi-select-component";
import ConfirmationDialog from './Dialog'
import CircularProgress from '@material-ui/core/CircularProgress';

class MG_generator_ui extends React.Component{
    constructor(props){
        super(props);
        this.state  = {
            selectedBook: '', 
            availble_comms: [],
            bookOptions: [{
                part: 'Torah',
                books: ['Genesis']
            }],
            waitingForFile: false
        };
        this.baseAPIurl = 'https://www.sefaria.org.il/api/';
        this.generatorServerBaseAPIurl = 'http://localhost:3002/';
    }

    listBibleBooks(){
        axios.get(this.baseAPIurl + 'index/')
        .then((res) => res.data).then(data => {
            data = data[0].contents;
            console.log(data.length); 
            
            var bookOptions = [];
            var parts = ['Torah', 'Nevi\'im', 'Ketuvim']

            for (var i=0; i<3; i++){
                var subBookOption = [];
                for (var j=0; j<(data[i].contents).length; j++){
                    var a = 
                    subBookOption.push((data[i].contents)[j].title)
                }
                // console.log(subBookOption)
                bookOptions.push({
                    books: subBookOption,
                part: parts[i]})
            }

            // console.log(bookOptions)
            this.setState({'bookOptions': bookOptions})
        })
    }

    getCommsForBook(book){
        axios.get(this.baseAPIurl + 'links/' + book + '.1.2').then(res => res.data)
        .then(data => {
            return data.filter(o => {
                return o.category.toLowerCase() == 'commentary' || o.type.toLowerCase() == 'commentary';
            })
        })
        .then(data => {
            return data.map(o => {
                var newObj = {label: o.index_title,
                                value: o,
                                disabled: false
                            };
                            return newObj;
            });
        })
        .then(data => {
            return data.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label))===i)
        })
        .then(data => this.setState({availble_comms: data}))
    }

    componentDidMount(){
        this.listBibleBooks();
    }

    requestBook(){
        axios.post(this.generatorServerBaseAPIurl + 'generate', 
        {
            book: this.state.selectedBook,
            trans: 'default',
            coms: this.state.selected_comm,
        }).then(res => {this.setState({fileID: res.data.fileID})})
        .then(() => { this.setState({waitingForFile: true })})
        .then(() => {
            this.intervalID = setInterval(() => {
                axios.get(this.generatorServerBaseAPIurl + 'file/' + this.state.fileID, {responseType: 'blob'})
                .then(res => {
                    if (res.status == 200){
                        var myBlob = new Blob([res.data], {
                            type: 'application/pdf'
                        });
                        var blobUrl = URL.createObjectURL(myBlob);
                        this.setState({
                            bookURL: blobUrl,
                            waitingForFile: false
                        })
                        clearInterval(this.intervalID);
                    }
                })
            }, 1500)
            

        })
    }

    render(){
        return(
            <div>
                <h1>MG_generator_ui</h1>
                <div id="form">
                    <ConfirmationDialog options={this.state.bookOptions} onChange={b => {
                        this.setState({selectedBook: b})
                        this.getCommsForBook(b)
                        }}></ConfirmationDialog>
                    <br/>
                    <MultiSelect 
                    options={this.state.availble_comms} 
                    value={this.state.selected_comm}
                    onChange={b => this.setState({selected_comm: b})} 
                    hasSelectAll={false}>
                    </MultiSelect>
                    <br/>
                    <input type="submit" value="Generate MG" onClick={() => {
                        this.requestBook()
                        this.setState({
                            selected_comm: ''
                        })
                        }}></input>
                </div>
                {this.state.waitingForFile ? <CircularProgress/> : 
                <a disabled={!this.state.waitingForFile} href={this.state.bookURL} download={this.state.selectedBook + '.pdf'}>Click here to download the book</a>}
            </div> 
        )
    }
}

export default MG_generator_ui