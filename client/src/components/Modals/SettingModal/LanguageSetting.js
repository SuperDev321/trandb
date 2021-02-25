import React, {useState, useContext, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    FormGroup,
    FormControl,
    InputLabel,
    InputBase,
    Select
} from '@material-ui/core';

import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);
const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        padding: 20,
        color: 'white'
    },
    label: {
      color: 'white'
    },
}))
const LanguageSetting = ({language, setLanguage}) => {
    const classes = useStyles();
    
    const handleChange = (e) => {
      setLanguage(e.target.value);
    }
    

    return (
        <FormGroup className={classes.root}>
            <InputLabel className={classes.label}>Select Language</InputLabel>
            <Select
              className={classes.select}
              value={language}
              onChange={handleChange}
              input={<BootstrapInput />}
            >
              <option value="en" >English</option>
              <option value={'iw'}>Isarel</option>
            </Select>
        </FormGroup>
    )
}
export default LanguageSetting;