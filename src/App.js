import './App.css';
import StickyHeadTable from './Components/Table'
import SearchBar from './Components/searchButton'
import Box from '@mui/material/Box'
import {getCountryFullInfo , allCountries} from './API/index'
import { useEffect, useState } from 'react';


function App() {  

  return (
    <>
    <Box sx={{paddingTop:5, width:'90%', margin:'auto'}}>
      <SearchBar/>
    </Box>
    <StickyHeadTable/>
    </>
  );
}

export default App;
