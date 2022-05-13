import React, { useState, useEffect } from 'react';
import SearchBar from './searchButton';
import Box from '@mui/material/Box';
import { getCountryFullInfo, allCountries, euCountries, euCandidateCountries } from '../API/index'
import { DataGrid } from '@mui/x-data-grid'
import { Switch, FormGroup, FormControlLabel } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import NestedModal from './modalPopup'

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
 

]

const columnsCapital = [
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

]

const defaultColums = (handlEdit, handDelete) =>  [{
  field: 'capitalPopulationPercentage',
  headerName: 'Population % live in Capital',
  type: 'number',
  width: 300,
  format: (value) => value.toLocaleString('en-US'),
}, 
{
  field: 'id',
  headerName: 'Edit and delete',

  type: 'number',
  width: 300,
  format: (value) => value.toLocaleString('en-US'),
  renderCell: (params) => {
    console.log('params::::::',params.id);
    return (
      <Box sx={{ display: 'flex', gap: 4 }}>
        <ModeEditIcon onClick={() => handlEdit(params.id)} />
        <DeleteIcon onClick={() => handDelete(params.id)} />
      </Box>
    )
  }
},]
function getColums(showCountry, showCapital,handlEdit, handDelete) {
  const countryCol = showCountry? columnsCountries:[]
  const capitalCol =showCapital?columnsCapital:[]
  return (countryCol).concat(capitalCol).concat(defaultColums(handlEdit, handDelete))
}

export default function StickyHeadTable() {
  const [countriesData, setCountriesData] = useState([])
  const [seachQuery, setSearchQuery] = useState('')
  const [showCapital, setShowCapital] = useState(true)
  const [showCountry, setShowCountry] = useState(true)
  const [open, setOpen] = React.useState(false);
  // const [editNumberPopulation , setEditNumberPopulation] = useState([])
  const rows = countriesData?.map(country => {
    const capitalPopulation = country.capitalData.population * 100;
    const countryPopulation = country.countryData.population * 1000
    const capitalToCountryPopulationPercent = capitalPopulation / countryPopulation
    let roundPercentage = Math.round(capitalToCountryPopulationPercent)
    return {
      id: country.countryName,
      countryName: country.countryName,
      countryPopulation: country.countryData.population * 1000,
      capital: country.countryData.capital,
      capitalPopulation: country.capitalData.population,
      capitalPopulationPercentage: roundPercentage += '%',
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

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const filterRows = rows?.filter(name => {
    const searchByNameCountry = name?.countryName.toLowerCase().includes(seachQuery.toLowerCase())
    return searchByNameCountry
  })

  useEffect(() => {
    getTableData()
  }, [])

  const handDelete = (id) => {
    const fiterPerRow = countriesData?.filter(countryId => countryId.countryName !== id)
    setCountriesData(fiterPerRow) 
  }

  const handlEdit = (id) => {
    const fiterPerRow = countriesData?.find(countryId => countryId.countryName === id)
    if(fiterPerRow) {
      setOpen(true);
    }
    // if(fiterPerRow) {
    //   return (
    //     <NestedModal handleOpen={handleOpen} handleClose={handleClose}/>
    //   )
    // }
  }

  function showColums() {
    return getColums(showCountry, showCapital, handlEdit ,handDelete)
  }
  return (
    <>
      <Box sx={{ paddingTop: 5, width: '90%', margin: 'auto' }}>
        <SearchBar onChange={(e) => setSearchQuery(e.target.value)} />
      </Box>
      <div style={{
        width: '90%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'end'

      }}>
        <Box sx={{ width: '50%' }}>
          <p>{`EU countries: ${euCountries.toString().replace(/,/g, ', ')}`}</p>
          <p>{`Candidate countries: ${euCandidateCountries.toString().replace(/,/g, ', ')}`} </p>
          <p>{`Total population EU countries combined : ${euCombinedPopulations.toLocaleString('en-US')}`}</p>
        </Box>
        <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
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