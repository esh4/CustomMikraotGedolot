(this.webpackJsonpcustom_mg_v2=this.webpackJsonpcustom_mg_v2||[]).push([[0],{109:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(8),l=a.n(r),i=(a(75),a(76),a(31)),c=a(32),s=a(38),u=a(37),m=a(30),h=a.n(m),d=(a(94),a(53)),p=a.n(d),f=a(54),b=a.n(f),E=function(e){return e.index_title},k=function(e){return o.a.createElement("div",null,e.index_title)},v=(o.a.Component,a(59)),g=a(25),w=a(60),y=a(149),C=a(148),S=a(150),B=a(157),I=a(151),F=a(144),O=a(145),_=a(147),j=a(154),G=a(156),P=a(155),x=a(146);function D(e){var t=e.onClose,a=e.value,n=e.open,r=Object(w.a)(e,["onClose","value","open"]),l=o.a.useState(a),i=Object(g.a)(l,2),c=i[0],s=i[1],u=o.a.useRef(null);o.a.useEffect((function(){n||s(a)}),[a,n]);return o.a.createElement(j.a,Object.assign({disableBackdropClick:!0,disableEscapeKeyDown:!0,maxWidth:"xs",onEntering:function(){null!=u.current&&u.current.focus()},"aria-labelledby":"confirmation-dialog-title",open:n},r),o.a.createElement(F.a,{id:"confirmation-dialog-title"},"Bible Books"),o.a.createElement(O.a,{dividers:!0},o.a.createElement(G.a,{ref:u,"aria-label":"ringtone",name:"ringtone",value:c,onChange:function(e){s(e.target.value)}},e.options.map((function(e){return o.a.createElement(o.a.Fragment,null,o.a.createElement("p",null,e.part),e.books.map((function(e){return o.a.createElement(x.a,{value:e,key:e,control:o.a.createElement(P.a,null),label:e})})))})))),o.a.createElement(_.a,null,o.a.createElement(C.a,{autoFocus:!0,onClick:function(){t()},color:"primary"},"Cancel"),o.a.createElement(C.a,{onClick:function(){t(c)},color:"primary"},"Ok")))}var T=Object(y.a)((function(e){return{root:{width:"100%",maxWidth:360,backgroundColor:e.palette.background.paper},paper:{width:"80%",maxHeight:435}}}));function A(e){var t=T(),a=o.a.useState(!1),n=Object(g.a)(a,2),r=n[0],l=n[1],i=o.a.useState("Genesis"),c=Object(g.a)(i,2),s=c[0],u=c[1];return o.a.createElement("div",{className:t.root},o.a.createElement(S.a,{component:"div",role:"list"},o.a.createElement(B.a,{button:!0,divider:!0,"aria-haspopup":"true","aria-controls":"ringtone-menu","aria-label":"phone ringtone",onClick:function(){l(!0)},role:"listitem"},o.a.createElement(I.a,{primary:"Choose a book",secondary:s})),o.a.createElement(D,{classes:{paper:t.paper},id:"ringtone-menu",keepMounted:!0,open:r,onClose:function(t){l(!1),t&&(u(t),e.onChange(t))},value:s,options:e.options})))}var M=a(153),W=a(152);function R(e){var t=o.a.useState(!0),a=Object(g.a)(t,2),n=a[0],r=a[1],l=function(){r(!1)};return o.a.createElement("div",null,o.a.createElement(j.a,{open:n,onClose:l,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},o.a.createElement(F.a,{id:"alert-dialog-title"},"There was an error while trying to create the requested document"),o.a.createElement(O.a,null,o.a.createElement(W.a,{id:"alert-dialog-description"},e.message)),o.a.createElement(_.a,null,o.a.createElement(C.a,{onClick:l,color:"primary",autoFocus:!0},"OK"))))}var J=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={selectedBook:"",availble_comms:[],bookOptions:[{part:"Torah",books:["Genesis"]}],waitingForFile:!1,alert:!1},n.baseAPIurl="https://www.sefaria.org.il/api/",n.generatorServerBaseAPIurl="http://ec2-3-134-87-226.us-east-2.compute.amazonaws.com:3002/",n}return Object(c.a)(a,[{key:"listBibleBooks",value:function(){var e=this;h.a.get(this.baseAPIurl+"index/").then((function(e){return e.data})).then((function(t){t=t[0].contents,console.log(t.length);for(var a=[],n=["Torah","Nevi'im","Ketuvim"],o=0;o<3;o++){for(var r=[],l=0;l<t[o].contents.length;l++)r.push(t[o].contents[l].title);a.push({books:r,part:n[o]})}e.setState({bookOptions:a})}))}},{key:"getCommsForBook",value:function(e){var t=this;h.a.get(this.baseAPIurl+"links/"+e+".1.2").then((function(e){return e.data})).then((function(e){return e.filter((function(e){return"commentary"==e.type.toLowerCase()}))})).then((function(e){return e.map((function(e){return{label:e.index_title,value:e,disabled:!1}}))})).then((function(e){return e.filter((function(e,t,a){return a.findIndex((function(t){return t.label===e.label}))===t}))})).then((function(e){return e.map((function(e){return e.base_ref=e.value.ref.slice(0,-5),e}))})).then((function(e){return t.setState({availble_comms:e})}))}},{key:"componentDidMount",value:function(){this.listBibleBooks()}},{key:"requestBook",value:function(){var e=this;h.a.post(this.generatorServerBaseAPIurl+"generate",{book:this.state.selectedBook,trans:"default",coms:this.state.selected_comm}).then((function(t){e.setState({fileID:t.data.fileID})})).then((function(){e.setState({waitingForFile:!0})})).then((function(){e.intervalID=setInterval((function(){h.a.get(e.generatorServerBaseAPIurl+"file/"+e.state.fileID,{responseType:"blob"}).then((function(t){if(200==t.status||304==t.status){var a=new Blob([t.data],{type:"application/pdf"}),n=URL.createObjectURL(a);e.setState({bookURL:n,waitingForFile:!1}),clearInterval(e.intervalID)}})).catch((function(t){504==t.status&&(e.setState({alert:!0}),clearInterval(e.intervalID))}))}),1500)}))}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{id:"main"},o.a.createElement("h3",null,"Mikraot Gedolot Generator"),o.a.createElement("hr",null),o.a.createElement("div",{id:"form"},o.a.createElement(A,{options:this.state.bookOptions,onChange:function(t){e.setState({selectedBook:t}),e.getCommsForBook(t)}}),o.a.createElement("br",null),o.a.createElement(v.a,{options:this.state.availble_comms,value:this.state.selected_comm,onChange:function(t){return e.setState({selected_comm:t})},hasSelectAll:!1}),o.a.createElement("br",null),o.a.createElement("input",{type:"submit",value:"Generate MG",onClick:function(){e.requestBook(),e.setState({selected_comm:""})}})),this.state.waitingForFile?o.a.createElement(M.a,null):o.a.createElement("a",{disabled:!this.state.waitingForFile,href:this.state.bookURL,download:this.state.selectedBook+".pdf"},"Click here to download the book"),this.state.alert?o.a.createElement(R,{message:"Currently, JPS footnotes are unsupported. If you are not using JPS footnotes please contact the developers."}):o.a.createElement(o.a.Fragment,null))}}]),a}(o.a.Component);var L=function(){return o.a.createElement("div",{className:"App"},o.a.createElement("header",{className:"App-header"},o.a.createElement("h1",null,"Custom Mikraot Gedolot Generator"),o.a.createElement("h2",null,"Submitted to the Sefaria Contest by: Eshel Sinclair")),o.a.createElement("div",{id:"body"},o.a.createElement("div",{class:"instructions"},o.a.createElement("h3",{class:"instructions"},"Details"),o.a.createElement("p",null,"With our app, based on Sefaria's Yam Shel Torah, you can now create your own Mikraot Gedolot! ",o.a.createElement("br",null),"You choose the book from Tanach, and then you can choose any one of Sefaria's translations on that book, and up to 9 commentaries on the book. The PDF that the app then creates is downloadable and printable, and it's just like the best of today's modern Mikraot Gedolot. Readable print, and the commentaries on a pasuk stay on the page, so no flipping back and forth! ",o.a.createElement("br",null),"Our app is great for anyone who wants to utilize Sefaria and likes learning in the Mikraot Gedolot format. It could be great for teachers who want to prepare sefarim for their students with only specific commentaries. We think our app can really help us all learn Torah.        ")),o.a.createElement("section",{class:"info"},o.a.createElement("div",{class:"instructions"},o.a.createElement("h3",null,"Instructions:"),o.a.createElement("p",null,"1. Choose a book from the Tanakh. ",o.a.createElement("br",null),"2. Choose a translation that will apear alongside the source. ",o.a.createElement("br",null),"3. Choose any number of commentators that you wish to upear in your book.",o.a.createElement("br",null),'4. Click "generate". ',o.a.createElement("br",null),"5. Wait until the script finishes creating the book and click to download the book. (this can take up to a couple of minutes)")),o.a.createElement("div",{class:"instructions"},o.a.createElement("h3",null,"Demo version disclaimer:"),o.a.createElement("p",null,"This is a demo version of the complete project, and is thus limited as follows: ",o.a.createElement("br",null),"- Generating a Mikraot Gedolot book for and entire ",o.a.createElement("i",null,"sefer")," is a long process (can take up to an hour due to many calls to the Sefaria API and compiling it into a PDF), therefor this demo is limited to the first 5 verses.  ",o.a.createElement("br",null),"- JPS Footnotes are currently unsupported."))),o.a.createElement(J,null),o.a.createElement("footer",null,o.a.createElement("p",null,"This project uses the non-commercial version of Prince ",o.a.createElement("a",{target:"_blank",href:"https://www.princexml.com"},"www.princexml.com")))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(L,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},54:function(e,t,a){},70:function(e,t,a){e.exports=a(109)},75:function(e,t,a){},76:function(e,t,a){},94:function(e,t,a){}},[[70,1,2]]]);
//# sourceMappingURL=main.12aafe32.chunk.js.map