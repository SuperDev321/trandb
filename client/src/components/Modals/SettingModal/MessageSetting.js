import React, {useState, useContext, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Switch,
    Grid,
    Slider
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        padding: 20
    }
}))
const PrettoSlider = withStyles({
    root: {
      color: '#52af77',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
})(Slider);
const MessageSetting = ({messageSize, setMessageSize}) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(30);
    const { t } = useTranslation();
    const handleChange = (event, newValue) => {
        console.log(value)
        setValue(newValue);
        setMessageSize(newValue/5+10)
    };

    return (
        <div className={classes.root}>
            <Grid container alignItems="center" spacing={0}>
                <Grid item xs={12} spacing={5}>
                    <span>{t('SettingModal.message_size')}</span>
                </Grid>
                <Grid item xs={12} spacing={5}>
                    <PrettoSlider value={(messageSize-10)*5} onChange={handleChange} aria-labelledby="continuous-slider" />
                </Grid>
            </Grid>
        </div>
    )
}
export default MessageSetting;