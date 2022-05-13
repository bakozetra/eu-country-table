import React, { useState, useEffect } from 'react';
import SearchBar from './searchButton';
import Box from '@mui/material/Box';
import { getCountryFullInfo, allCountries, euCountries, euCandidateCountries } from '../API/index'
import { DataGrid } from '@mui/x-data-grid'
import { Switch, FormGroup, FormControlLabel, Input } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const columnsCountries = [
  {
    field: 'countryName',
    headerName: 'Country Name',
    type: 'string',
    flex: 1,
  },
  {
    field: 'countryPopulation',
    headerName: 'Country Population',
    type: 'number',
    flex: 1,
    format: (value) => value.toLocaleString('en-US'),
  },
]

const columnsCapital = [
  {
    field: 'capital',
    headerName: 'capital',
    type: 'string',
    flex: 1
  },
  {
    field: 'capitalPopulation',
    headerName: 'Capital Population',
    type: 'number',
    flex: 1,
    format: (value) => value.toLocaleString('en-US'),
  },

]

const defaultColums = (handlEdit, handDelete) => [{
  field: 'capitalPopulationPercentage',
  headerName: 'Population % live in Capital',
  type: 'number',
  flex: 1,
  format: (value) => value.toLocaleString('en-US'),
},
{
  field: 'id',
  headerName: 'Edit and delete',
  type: 'number',
  flex: 1,
  format: (value) => value.toLocaleString('en-US'),
  renderCell: (params) => {
    return (
      <Box sx={{ display: 'flex', gap: 4 }}>
        <ModeEditIcon onClick={() => handlEdit(params.id)} />
        <DeleteIcon onClick={() => handDelete(params.id)} />
      </Box>
    )
  }
},
]

function getColums(showCountry, showCapital, handlEdit, handDelete) {
  const countryCol = showCountry ? columnsCountries : []
  const capitalCol = showCapital ? columnsCapital : []
  return (countryCol).concat(capitalCol).concat(defaultColums(handlEdit, handDelete))
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function StickyHeadTable() {
  const [countriesData, setCountriesData] = useState([])
  const [seachQuery, setSearchQuery] = useState('')
  const [showCapital, setShowCapital] = useState(true)
  const [showCountry, setShowCountry] = useState(true)
  const [open, setOpen] = React.useState(false);
  const [editPopulationRecord, setEditPopulationRecord] = useState({})
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
    const updated = ({ ...fiterPerRow, countryData: { ...fiterPerRow?.countryData, population: fiterPerRow.countryData.population * 1000 } })
    if (fiterPerRow) {
      handleOpen();
      setEditPopulationRecord(updated)
    }
  }


  function showColums() {
    return getColums(showCountry, showCapital, handlEdit, handDelete)
  }

  function saveEditData() {
    const dataAfterUpdate = countriesData?.map(country => {
      if (country.countryName === editPopulationRecord?.countryName) {
        const updated = { ...editPopulationRecord, countryData: { ...editPopulationRecord.countryData, population: editPopulationRecord.countryData.population / 1000 } }

        return updated
      } else {
        return country
      }
    })
    setCountriesData(dataAfterUpdate)
    setOpen(false)
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
          showCellRightBorder={true}
          sx={{ textAlign: 'center' }}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Edit {editPopulationRecord?.countryName} data</h2>
          <Box sx={{ paddingBottom: 5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 36 }}>
              <label style={{ paddingBottom: 20 }}>Edit {editPopulationRecord?.countryName} population</label>
              <Input
                value={editPopulationRecord?.countryData?.population}
                onChange={(e) => setEditPopulationRecord({ ...editPopulationRecord, countryData: { ...editPopulationRecord?.countryData, population: e.target.value } })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 36, }}>
              <label style={{ paddingBottom: 20 }}>Edit {editPopulationRecord?.capitalData?.name} population</label>
              <Input
                value={editPopulationRecord?.capitalData?.population}
                onChange={(e) => setEditPopulationRecord({ ...editPopulationRecord, capitalData: { ...editPopulationRecord.capitalData, population: e.target.value } })} />
            </div>
          </Box>
          <Button onClick={saveEditData}>save</Button>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </>
  );
}

