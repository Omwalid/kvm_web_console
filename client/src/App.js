import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import  Main  from './Components/MainComponent';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <Main />
      </BrowserRouter>

    );
  }
}

export default App;
