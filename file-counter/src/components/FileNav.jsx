import React from 'react';
import {MDBIcon} from 'mdbreact';
import {css} from '@emotion/core';
import PulseLoader from 'react-spinners/PulseLoader';
var fetch = require('fetch-retry');

// Used for the pulse loading icon
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default class FileList extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      formattedData: [],
      isLoaded: false,
      totalFiles: 0,
      totalFileSize: 0,
      error: ''
    };
  }

  componentDidMount(){
    fetch('https://chal-locdrmwqia.now.sh/',  {
      retryOn: [500] // Try to fetch again if there was a server error
    })
    .then(response => response.json())
    .then((jsonData) => {

      // Add unique keys to JSON
      let index = 0;
      let formattedData = this.formatData(jsonData.data, index);

      this.setState({ data: formattedData, isLoaded: true}, () => this.countFiles(this.state.data))

    })
    .catch(console.error)
  }

  formatData(objectArray, index){

    let formattedDataArray = [];
    objectArray.map(obj => {
      // Create a unique idea key and value to add to each json object
      obj.uniqueId =  obj.name + index;
      formattedDataArray.push(obj)
      index = index + 1;
      // Recursively add new key value pairs to children of folders
      if(obj.type ==='folder'){
          this.formatData(obj.children, index)
      }
      return null
    })
    return formattedDataArray
  }


  // Update the count for files and filesize
  countFiles(dataArray){
    if (this.state.data) {
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
      })}

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
        const childId = child.uniqueId
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
        const childId = child.uniqueId
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
        const childId = child.uniqueId
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
        const childId = child.uniqueId
        this.showChildren(child, childId)
        return null
      })
    }
  }

  // Takes an object to display
  displayItem(item) {

    if( item.type === "folder" ) {
      const id = item.uniqueId
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
            <MDBIcon icon="angle-down" className='arrowIcon' size='lg'/>
            <MDBIcon far icon="folder-open" size='lg'/>
          </div>
          <div className='hidden icons' id={id+'closed'}>
            <MDBIcon icon="angle-right" className='arrowIcon' size='lg'/>
            <MDBIcon far icon="folder" size='lg'/>
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
        <div key={item.uniqueId} id={item.uniqueId} className='visible'>
          <MDBIcon far icon="file-alt" className='fileIcon' size='lg'/>
          <li className='fileTitle'>{item.name + ' ' + item.size + ' MB'}</li>
        </div>
      )
    }
  }

  // Map over each object from the Json Data to display
  displayFoldersNav() {
    if( this.state.isLoaded ) {
      return this.state.data.map( item => {
        return this.displayItem(item);
      })
    }
  }

  render() {
    // Wait for data to be loaded
    const isLoaded = this.state.isLoaded;
    let display;

    if (isLoaded){
      display = <div>
        <div className='folderNavDiv'>
          {this.displayFoldersNav()}
        </div>
        <hr/>
        <h3>Total Files: {this.state.totalFiles}</h3>
        <h3>Total Filesize: {this.state.totalFileSize} MB</h3>
      </div>

    } else {
      display = <div className='loadingContainer'>
        <h1 className='loading'>Loading</h1>
        <div className='sweet-loading loading'>
          <PulseLoader
            css={override}
            sizeUnit={"px"}
            size={10}
            color={'#00A5BF'}
            loading={this.state.loading}
          />
        </div>
      </div>


    }
      return (
        <div>
          {display}
        </div>
      );
  }

}
