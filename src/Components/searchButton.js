import SearchIcon from '@mui/icons-material/Search'
import {TextField} from '@mui/material'

export default function SearchBar() {
  return (
    <TextField
      sx={(theme) => ({
        background: theme.palette.background.neutral,
        width: '40%',
        borderRadius: 1,
      })}
      size="small"
      type="search"
      placeholder="Search..."
      InputProps={{
        startAdornment: <SearchIcon />,
      }}
    />
  )
}