import './App.css';
import StickyHeadTable from './Components/Table'
import {getCountryFullInfo , allCountries} from './API/index'
import { useEffect, useState } from 'react';


function App() {  
  return (
    <>
    <StickyHeadTable/>
    </>
  );
}

export default App;
