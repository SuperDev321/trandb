import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    FormGroup,
    InputLabel,
    InputBase,
    Select,
    MenuItem
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
      backgroundColor: 'white',
      color: 'black'
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
    const { t } = useTranslation();
    const handleChange = (e) => {
      setLanguage(e.target.value);
    }
    

    return (
        <FormGroup className={classes.root}>
            <InputLabel className={classes.label}>{t('SettingModal.select_lan')}</InputLabel>
            <Select
              className={classes.select}
              value={language}
              onChange={handleChange}
              input={<BootstrapInput />}
            >
              <MenuItem value="en" >{t('SettingModal.english')}</MenuItem>
              <MenuItem value='iw'>{t('SettingModal.hebrew')}</MenuItem>
            </Select>
        </FormGroup>
    )
}
export default LanguageSetting;