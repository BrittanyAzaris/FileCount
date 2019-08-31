import React from 'react';
// import ReactDOM from 'react-dom';
// import {MDBIcon} from 'mdbreact';
import {FaFile, FaFolder, FaFolderOpen, FaAngleRight, FaAngleDown} from 'react-icons/fa'


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
    this.handleClick = this.handleClick.bind(this);
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

  handleClick(folderID) {
    console.log(folderID)

    document.getElementById(folderID+'open').getAttribute("class") == "visible folder" ?
    document.getElementById(folderID+'open').setAttribute("class", "hidden folder") :
    document.getElementById(folderID+'open').setAttribute("class", "visible folder")

    document.getElementById(folderID+'closed').getAttribute("class") == "visible folder" ?
    document.getElementById(folderID+'closed').setAttribute("class", "hidden folder") :
    document.getElementById(folderID+'closed').setAttribute("class", "visible folder")
  }


  // Function to sort the data by type of folder vs file
  CheckType(obj) {
    if (obj.type === 'folder') { // For folders itterate over children values and use folder icon
      let childItems = this.OpenFolder(obj.children)
      const folderVis = this.state.IsFolderOpen ? 'red' : 'blue';
      //TODO make better unique IDs
      return (
        <div>
          <div id={obj.name+obj.children+'open'} className="visible folder" onClick={() => this.handleClick(obj.name+obj.children)}>
            <FaAngleDown />
            <FaFolderOpen />
          </div>
          <div id={obj.name+obj.children+'closed'} className="hidden folder" onClick={() => this.handleClick(obj.name+obj.children)}>
            <div className="closedIcons">
              <FaAngleRight />
              <FaFolder />
            </div>
          </div>
          <li className='folder' key={obj.name}> {obj.name} </li>
          {childItems}
        </div>
      )
    } else { //For a file update file count and file size and use file icon
      // TODO use this.setstate instead
      this.state.totalFiles = this.state.totalFiles + 1
      this.state.totalFileSize = this.state.totalFileSize + obj.size
      return (
        <div>
          <FaFile />
          <li className='file' key={obj.name}> {obj.name} {obj.size} MB</li>
        </div>
      )
    }
  }

  render() {
    if (Object.values(this.state.data).length >0 ){
      const dataArray =(Object.values(this.state.data)[0]);
      const listItems = dataArray.map((d) => this.CheckType(d));


      return (
        <div>
          {listItems }
          <hr/>
          <h3>Total Files: {this.state.totalFiles}</h3>
          <h3>Total Filesize: {this.state.totalFileSize} MB</h3>
        </div>
      );
    }
    return null
  }

}
