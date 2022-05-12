import React , { useState , useEffect} from 'react';
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

  useEffect(() => {
    getTableData()
  },[])


  return (
    <div style={{ height: 400, width: '100%' }}>
      <div>
        <p>{`EU countries: ${euCountries.toString()}`} </p>
        <p>{`Candidate countries: ${euCandidateCountries.toString()}`} </p>
        <p>{`Total population EU countries combined : ${euCombinedPopulations.toLocaleString('en-US')}`} </p>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
      />
    </div>
  );
}