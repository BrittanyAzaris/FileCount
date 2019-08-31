import React from 'react';
import './styles/App.css';
import FileList from './components/FileList.jsx';

function App() {
  return (
    <div className='App'>
      <h1>Folders go here</h1>
      <FileList className='fileList'/>
    </div>
  );
}

export default App;
