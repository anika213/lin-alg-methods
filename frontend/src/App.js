import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Landing from './pages/Landing';
import RREF from './pages/RREF';
import QR from './pages/QR';


function App() {



    return (
<Router>
           <div className="App">
    <Routes>
                <Route exact path='/' element={< Landing />}></Route>
                <Route exact path='/rref' element={<RREF/>}></Route>
                <Route exact path='/qr' element={<QR/>}></Route>
          </Routes>
          
</div>
</Router>





   );
  }


export default App;
