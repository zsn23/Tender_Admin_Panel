import React, { useState } from 'react';
import { Autocomplete, TextField, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function CustomizedHook(props) {
  const [selectedValues, setSelectedValues] = useState([]);

  
  const handleSelectionChange = (event, newValue) => {
    setSelectedValues(newValue);
    props.getSelectedItems(newValue);
  };
  
   
  return (
    <>
      <Autocomplete
        sx={{ bgcolor: 'white' }}
        multiple
        id="tags-standard"
        options={props.CategoryDetails}
        getOptionLabel={(option) => option.name}
        defaultValue={[]}
        disableCloseOnSelect
        onChange={handleSelectionChange}
        renderOption={(props, option, { selected }) => (
          <MenuItem
            key={option.id}
            value={option}
            sx={{ justifyContent: 'space-between' }}
            {...props}
          >
            {option.name}
            {selected ? <CheckIcon color="info" /> : null}
          </MenuItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Categories"
          />
        )}
      />
    </>
  );
}
