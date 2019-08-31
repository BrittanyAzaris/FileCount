import React from 'react';
// import ReactDOM from 'react-dom';
// import {MDBIcon} from 'mdbreact';
import {FaFile, FaFolder, /*FaFolderOpen*/} from 'react-icons/fa'


export default class FileList extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      totalFiles: 0,
      totalFileSize: 0
    };
    this.CheckType = this.CheckType.bind(this);
    this.OpenFolder = this.OpenFolder.bind(this);
  }

  componentDidMount(){
    fetch('https://chal-locdrmwqia.now.sh/')
    .then(response => response.json())
    .then((jsonData) => {
      this.setState({ data: jsonData})

    })
    .catch(console.log)
  }

  // Function to recursively check folders and add indentation
  OpenFolder(children){
    let childItems = children.map((d) => this.CheckType(d));
    return (
      <div className="indent">
        {childItems}
      </div>
    )
  }

  // Function to sort the data by type of folder vs file
  CheckType(obj) {
    if (obj.type === 'folder') { // For folders itterate over children values and use folder icon
      let childItems = this.OpenFolder(obj.children)
      return (
        <div>
          <FaFolder />
          <li className='folder' key={obj.name}> {obj.name} </li>
          {childItems}
        </div>
      )
    } else { //For a file update file count and file size and use file icon
      return (
        <div>
          <FaFile />
          <li className='file' key={obj.name}> {obj.name} </li>
        </div>
      )
    }
  }

  render() {
    if (Object.values(this.state.data).length >0 ){
      console.log('BB' + JSON.stringify(this.state.data))
      const dataArray =(Object.values(this.state.data)[0]);
      const listItems = dataArray.map((d) => this.CheckType(d));


      return (
        <div>
          {listItems }
        </div>
      );
    }
    return null
  }

}
