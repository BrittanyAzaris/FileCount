import React from 'react';
// import {MDBIcon} from 'mdbreact';
import {FaFile, FaFolder, FaFolderOpen, FaAngleRight, FaAngleDown} from 'react-icons/fa'


export default class FileList extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      isLoaded: false,
      totalFiles: 0,
      totalFileSize: 0
    };
  }

  componentDidMount(){
    fetch('https://chal-locdrmwqia.now.sh/')
    .then(response => response.json())
    .then((jsonData) => {
      this.setState({ data: jsonData.data, isLoaded: true}, () => this.countFiles(this.state.data))
    })
    .catch(console.log)
  }

  // Update the count for files and filesize
  countFiles(dataArray){
    dataArray.map(item => {
      if(item.type === 'file'){
        // Update the count for total Files and Filesize
        this.setState(prevState => {
           return {
             totalFiles: prevState.totalFiles + 1,
             totalFileSize: prevState.totalFileSize + item.size
           }
        })

      } else {
        // Count files and filesize within the folder
        this.countFiles(item.children)
      }
      return null
    })

  }

  // Recursively hide all child items in a folder
  hideChildren(item, itemId){
    document.getElementById(itemId).setAttribute('class', 'hidden')
    if(item.type==='folder'){
      // Hide the folder icons
      document.getElementById(itemId+'open').setAttribute('class', 'hidden icons')
      document.getElementById(itemId+'closed').setAttribute('class', 'hidden icons')
      // Recursively hide any items of children
      item.children.map(child => {
        const childId = itemId + '/' + child.name
        this.hideChildren(child, childId)
        return null
      })
    }
  }

  // Recursively show all the child items in a folder
  showChildren(item, itemId){
    document.getElementById(itemId).setAttribute('class', 'visible')
    if(item.type==='folder'){
      // Set open icon
      document.getElementById(itemId+'open').setAttribute('class', 'visible icons')
      document.getElementById(itemId+'closed').setAttribute('class', 'hidden icons')

      // Recursively show all child items in a folder
      item.children.map(child => {
        const childId = itemId + '/' + child.name
        this.showChildren(child, childId)
        return null
      })
    }
  }

  // Handle switching of icons and visibility when a folder is clicked
  toggleFolder(item, id) {
    // When an open folder is clicked,
    // hide open folder icons and show closed folder icons
    if (document.getElementById(id+'open').getAttribute('class') === 'visible icons') {
      document.getElementById(id+'open').setAttribute('class', 'hidden icons')
      document.getElementById(id+'closed').setAttribute('class', 'visible icons')

      // Also hide children of that folder
      item.children.map(child => {
        const childId = id + '/' +child.name
        this.hideChildren(child, childId)
        return null
      })
    } else {
      // When an closed folder is clicked,
      // hide closed folder icons and show open folder icons
      document.getElementById(id+'open').setAttribute('class', 'visible icons')
      document.getElementById(id+'closed').setAttribute('class', 'hidden icons')

      // Also show children of that folder
      item.children.map(child => {
        const childId = id + '/' +child.name
        this.showChildren(child, childId)
        return null
      })
    }
  }

  // Takes two arguments:
  // item (each json data object) and
  // parent (the breadcrumb of objects names that came before it)

  displayItem(item, parent) {

    if( item.type === "folder" ) {
      const id = parent + '/' + item.name;
      // Recursively display children of folders
      const item_children = item.children.map( child => {
        return this.displayItem(child, id)
      })

      return (
        <div key={id}
             id={id}
             className='visible'
             onClick={
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
      // Display files with file icon, name, and size in MB
      return (
        <div key={parent + '/' + item.name} id={parent + '/' + item.name} className='visible'>
          <FaFile />
          <li className='fileTitle'>{item.name + ' ' + item.size + 'MB'}</li>
        </div>
      )
    }
  }

  // Map over each object from the Json Data to display
  displayFoldersNav() {
    if( this.state.isLoaded ) {
      return this.state.data.map( item => {
        // Set top level parent as "top"
        return this.displayItem(item, "top");
      })
    }
  }

  render() {
    // Wait for data to be loaded
    if(!this.state.data) return null
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
