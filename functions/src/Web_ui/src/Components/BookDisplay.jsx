import React from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { pdfjs } from 'react-pdf';


class BookDisplay extends React.Component {
    constructor(props) {
        super(props)

        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

        this.state = {
            pageNumber: 1,
            numPages: null
        }
    }

    onDocumentLoadSuccess({ numPages }) {
        this.setState({numPages: numPages});
      }

    render() {
        return (
            <div>
                <Document
                    file={this.props.file}
                    onLoadSuccess={() => this.onDocumentLoadSuccess()}
                >
                    <Page pageNumber={this.state.pageNumber} />
                </Document>
                <p>Page {this.state.pageNumber} of {this.state.numPages}</p>
            </div>
        )
    }
}


export default BookDisplay