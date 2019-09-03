import React from 'react';
// import ReactDOM from 'react-dom';
// import {MDBIcon} from 'mdbreact';
import {FaFile, FaFolder, FaFolderOpen, FaAngleRight, FaAngleDown} from 'react-icons/fa'


export default class FileList extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      isLoaded: false
    };
  }

  componentDidMount(){
    fetch('https://chal-locdrmwqia.now.sh/')
    .then(response => response.json())
    .then((jsonData) => {
      this.setState({ data: jsonData.data, isLoaded: true})
    })
    .catch(console.log)
    // call method here not in render

  }

  hideChildren(item, itemId){
    document.getElementById(itemId).setAttribute('class', 'red')
    if(item.type==='folder'){
        item.children.map(child => {
        const childId = itemId + '/' + child.name
        this.hideChildren(child, childId)
      })
    }
  }

  showChildren(item, itemId){
    document.getElementById(itemId).setAttribute('class', 'blue')
    if(item.type==='folder'){
      item.children.map(child => {
        const childId = itemId + '/' + child.name
        this.showChildren(child, childId)
      })
    }
  }

  toggleFolder(item, id) {
    console.log(item)

    console.log("item id: " + id)
    // toggle icon
    //if open folder clicked

    if (document.getElementById(id+'open').getAttribute('class') === 'visible icons') {
      document.getElementById(id+'open').setAttribute('class', 'hidden icons')
      document.getElementById(id+'closed').setAttribute('class', 'visible icons')

      // hide children

      item.children.map(child => {
        const childId = id + '/' +child.name
        this.hideChildren(child, childId)

        // document.getElementById(childId).setAttribute('class', 'red')
      })
    } else {
      document.getElementById(id+'open').setAttribute('class', 'visible icons')
      document.getElementById(id+'closed').setAttribute('class', 'hidden icons')

      //show children
      item.children.map(child => {
        const childId = id + '/' +child.name
        this.showChildren(child, childId)

        // document.getElementById(childId).setAttribute('class', 'red')
      })

    }



  }

  displayItem(item, parent) {
    if( item.type === "folder" ) {
      const id = parent + '/' + item.name;
      const item_children = item.children.map( child => {
        return this.displayItem(child, id)
      })

      return (
        <div key={id} id={id} className='visible' onClick={
            (e) => {
              // Prevent parents also being called
              e.cancelBubble = true;
              e.stopPropagation();

              this.toggleFolder(item, id);
            }
          }>
          <div className='visible icons' id={id+'open'}>
            <FaAngleDown />
            <FaFolderOpen />
          </div>
          <div className='hidden icons' id={id+'closed'}>
            <FaAngleRight />
            <FaFolder />
          </div>
          <li className='folderTitle'>{item.name}</li>
          <div className='indent'>
            {item_children}
          </div>
        </div>
      )
    } else {
      return (
        <div key={parent + '/' + item.name} id={parent + '/' + item.name} className='visible'>
          <FaFile />
          <li className='fileTitle'>{item.name + ' ' + item.size + 'MB'}</li>
        </div>
      )
    }
  }

  displayFoldersNav() {
    if( this.state.isLoaded ) {
      return this.state.data.map( item => {
        return this.displayItem(item, "top");
      })
    }
  }

  render() {
    // console.log(Object.values(this.state.data)[0])

      return (
        <div>
          {this.displayFoldersNav()}
          <hr/>
          <h3>Total Files: {this.state.totalFiles}</h3>
          <h3>Total Filesize: {this.state.totalFileSize} MB</h3>
        </div>
      );
  }

}
