import React from 'react';
import axios from 'axios';
import './MG_generator_ui.css'
import CommInput from './CommInput'
import MultiSelect from "react-multi-select-component";
import ConfirmationDialog from './Dialog'

class MG_generator_ui extends React.Component{
    constructor(props){
        super(props);
        this.state  = {
            selectedBook: '', 
            availble_comms: []};
        this.baseAPIurl = 'https://www.sefaria.org.il/api/';
        this.generatorServerBaseAPIurl = 'http://localhost:3002/';
    }

    listCommentatorsForBook(){
        axios.get(this.baseAPIurl + 'index/')
        .then((res) => res.data).then(data => {
            data = data[0].contents;
            console.log(data.length); 
            
            var bookOptions = [];

            for (var i=0; i<3; i++){
                var subBookOption = [];
                // console.log((data[i].contents).length)
                for (var j=0; j<(data[i].contents).length; j++){
                    // console.log((data[i].contents)[j]);
                    var a = 
                    subBookOption.push(
                            <label htmlFor={(data[i].contents)[j].title}>
                                {(data[i].contents)[j].title}
                                <input type="radio" name="bibleBooks" value={(data[i].contents)[j].title}
                                onChange={e => {
                                    console.log(e.target.value)
                                    this.setState({selectedBook: e.target.value})
                                    this.getCommsForBook(e.target.value)}}
                                />
                            </label>)
                }
            bookOptions.push(<div class="books">{subBookOption}</div>)
            }
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
        this.listCommentatorsForBook();
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
                        var link = document.createElement("a"); 
                        link.href = blobUrl;
                        link.download = "aDefaultFileName.pdf";
                        link.innerHTML = "Click here to download the file";
                        document.body.appendChild(link); 

                        this.setState({waitingForFile: false});
                        clearInterval(this.intervalID);
                    }
                })
            }, 500)
            

        })
    }

    render(){
        return(
            <div>
                <h1>MG_generator_ui</h1>
                <div id="form">
                    <br/>
                    <ConfirmationDialog options={['a', 'b', 'c']}></ConfirmationDialog>
                    <div id="bible-radio">
                    {this.state.bookOptions}
                    </div>
                    <br/>
                    <MultiSelect 
                    options={this.state.availble_comms} 
                    value={this.state.selected_comm}
                    onChange={b => this.setState({selected_comm: b})} 
                    hasSelectAll={false}>
                    </MultiSelect>
                    <input type="submit" value="Generate MG" onClick={() => this.requestBook()}></input>
                </div>
            </div> 
        )
    }
}

export default MG_generator_ui