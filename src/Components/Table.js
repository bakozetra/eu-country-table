import React , { useState , useEffect} from 'react';
import SearchBar from './searchButton';
import Box from '@mui/material/Box';
import {getCountryFullInfo , allCountries , euCountries ,  euCandidateCountries} from '../API/index'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  {
    field: 'countryName',
    headerName: 'Country Name',
    type: 'string',
    width: 300,
  },
  {
    field: 'capital',
    headerName: 'capital',
    type: 'string',
    width: 300,
  },
  {
    field: 'countryPopulation',
    headerName: 'Country Population',
    type: 'number',
    width: 300,
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    field: 'capitalPopulation',
    headerName: 'Capital Population',
    type: 'number',
    width: 300,
    format: (value) => value.toLocaleString('en-US'),
  },
];

export default function StickyHeadTable() {
  const [countriesData , setCountriesData] = useState([])
  const [seachQuery , setSearchQuery] = useState('')
   const rows = countriesData?.map(country => {
     return { 
       id :  country.countryName,
       countryName: country.countryName,
       countryPopulation : country.countryData.population * 1000,
       capital: country.countryData.capital,
       capitalPopulation : country.capitalData.population  }
   })

const getTableData = async() => {
  const data = await getCountryFullInfo(allCountries)
  setCountriesData(data)
}
  const euCombinedPopulations = countriesData?.filter(country => {;
   return euCountries.includes(country?.countryName)
  }).reduce(( acc , numberPopulation) => {
    const populationTotal = numberPopulation?.countryData?.population * 1000
    return acc + populationTotal
  } , 0)
  const filterRows = rows?.filter(name => name?.countryName.toLowerCase().includes(seachQuery.toLowerCase()))
  useEffect(() => {
    getTableData()
  },[])

  return (
    <>
     <Box sx={{paddingTop:5, width:'90%', margin:'auto'}}>
      <SearchBar onChange={(e) =>setSearchQuery(e.target.value)}/>
    </Box>
    <div style={{ height: 400, width: '90%', margin:'auto' }}>
      <div>
        <p>{`EU countries: ${euCountries.toString()}`} </p>
        <p>{`Candidate countries: ${euCandidateCountries.toString()}`} </p>
        <p>{`Total population EU countries combined : ${euCombinedPopulations.toLocaleString('en-US')}`} </p>
      </div>
      <DataGrid
        rows={filterRows}
        columns={columns}
        pageSize={5}
        sx={{textAlign:'center'}}
       
      />
    </div>
    </>
  );
}