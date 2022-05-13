import React, { useState, useEffect } from 'react';
import SearchBar from './searchButton';
import Box from '@mui/material/Box';
import { getCountryFullInfo, allCountries, euCountries, euCandidateCountries } from '../API/index'
import { DataGrid } from '@mui/x-data-grid'
import { Switch, FormGroup, FormControlLabel } from '@mui/material';

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
  {
    field: 'capitalPopulationPercentage',
    headerName: 'Population % live in Capital',
    type: 'number',
    width: 300,
    format: (value) => value.toLocaleString('en-US'),
  },
];

const columnsCountries = [
  {
    field: 'countryName',
    headerName: 'Country Name',
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
    field: 'capitalPopulationPercentage',
    headerName: 'Population % live in Capital',
    type: 'number',
    width: 300,
    format: (value) => value.toLocaleString('en-US'),
  },

]

const columnsCapitalCountries = [
  {
    field: 'capital',
    headerName: 'capital',
    type: 'string',
    width: 300,
  },
  {
    field: 'capitalPopulation',
    headerName: 'Capital Population',
    type: 'number',
    width: 300,
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    field: 'capitalPopulationPercentage',
    headerName: 'Population % live in Capital',
    type: 'number',
    width: 300,
    format: (value) => value.toLocaleString('en-US'),
  },
]

export default function StickyHeadTable() {
  const [countriesData, setCountriesData] = useState([])
  const [seachQuery, setSearchQuery] = useState('')
  const [showCapital, setShowCapital] = useState(false)
  const [showCountry, setShowCountry] = useState(false)
  const rows = countriesData?.map(country => {
    const capitalPopulation =  country.capitalData.population * 100 ;
    const countryPopulation = country.countryData.population * 1000
    const capitalToCountryPopulationPercent = capitalPopulation / countryPopulation
    let roundPercentage = Math.round(capitalToCountryPopulationPercent)
    return {
      id: country.countryName,
      countryName: country.countryName,
      countryPopulation: country.countryData.population * 1000,
      capital: country.countryData.capital,
      capitalPopulation: country.capitalData.population, 
      capitalPopulationPercentage : roundPercentage += '%'
    }
  })

  const getTableData = async () => {
    const data = await getCountryFullInfo(allCountries)
    setCountriesData(data)
  }
  const euCombinedPopulations = countriesData?.filter(country => {
    return euCountries.includes(country?.countryName)
  }).reduce((acc, numberPopulation) => {
    const populationTotal = numberPopulation?.countryData?.population * 1000
    return acc + populationTotal
  }, 0)

  const filterRows = rows?.filter(name => {
    const searchByNameCountry = name?.countryName.toLowerCase().includes(seachQuery.toLowerCase())
    //  const searchByNameCapital = name?.countryData?.capital.toLowerCase().includes(seachQuery.toLowerCase())
    return searchByNameCountry
  })
  useEffect(() => {
    getTableData()
  }, [])

  function showColums() {
    if (!showCountry && !showCapital) {
      return columns
    }
    if (showCapital) {
      return columnsCapitalCountries
    }
    if (showCountry) {
      return columnsCountries
    }
  }
  
  return (
    <>
      <Box sx={{ paddingTop: 5, width: '90%', margin: 'auto' }}>
        <SearchBar onChange={(e) => setSearchQuery(e.target.value)} />
      </Box>
      <div style={{ 
        width: '90%', 
        margin: 'auto',
        display:'flex',
        flexDirection:'row', 
        justifyContent:'space-between',
        alignItems:'end'
        
        }}>
        <Box sx={{ width: '50%'}}>
          <p>{`EU countries: ${euCountries.toString()}`}</p>
          <p>{`Candidate countries: ${euCandidateCountries.toString()}`} </p>
          <p>{`Total population EU countries combined : ${euCombinedPopulations.toLocaleString('en-US')}`}</p>
        </Box>
        <FormGroup sx={{display:'flex' , flexDirection:'row' }}>
          <FormControlLabel control={<Switch
            checked={showCapital}
            onChange={() => setShowCapital(!showCapital)}
            inputProps={{ 'aria-label': 'controlled' }}
          />} label="Show Capital" />
          <FormControlLabel control={<Switch
            checked={showCountry}
            onChange={() => setShowCountry(!showCountry)}
            inputProps={{ 'aria-label': 'controlled' }}
          />}
            label="Show country" />
        </FormGroup>
      </div>
      <div style={{ height: 400, width: '90%', margin: 'auto' }}>
        <DataGrid
          rows={filterRows}
          columns={showColums()}
          pageSize={5}
          sx={{ textAlign: 'center' }}
        />
      </div>
    </>
  );
}