import React from 'react';
import ReactDOM from 'react-dom';
// import {MDBIcon} from 'mdbreact';
import {FaFile, FaFolder, FaFolderOpen} from 'react-icons/fa'


export default class FileList extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      totalFiles: 0,
      totalFileSize: 0
    };
    this.CheckType = this.CheckType.bind(this);
  }

  componentDidMount(){
    fetch('https://chal-locdrmwqia.now.sh/')
    .then(response => response.json())
    .then((jsonData) => {
      this.setState({ data: jsonData})
    })
    .catch(console.log)
  }

  CheckType(obj) {
    if (obj.type === 'folder') {
      return (
        <div>
          <FaFolder />
          <li className='folder' key={obj.name}> {obj.name} </li>
        </div>
      )
    } else {
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
      const dataArray =(Object.values(this.state.data)[0]);
      const listItems = dataArray.map((d) => this.CheckType(d));

      console.log('BB' + listItems)

      return (
        <div>
          {listItems }
        </div>
      );
    }
    return null
  }

}
