import React from 'react';
import './styles/App.css';
import FileList from './components/FileList.jsx';

function App() {
  return (
    <div className='App'>
      <h1>Folders go here</h1>
      <FileList className='fileList'/>
      <hr/>
      <h3>Total Files: </h3>
      <h3>Total Filesize: </h3>
    </div>
  );
}

export default App;
