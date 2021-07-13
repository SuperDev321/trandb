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
const MessageSetting = ({
    messageSize, setMessageSize, enableSysMessage, setEnableSysMessage,
    showGift, showGiftMessage, setShowGift, setShowGiftMessage
}) => {
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
            <Grid container alignItems="center" spacing={0}>
                <Grid item xs={12} spacing={5}>
                    <span>{t('SettingModal.join_leave_messages')}</span>
                </Grid>
                <Grid item xs={12} spacing={5}>
                  <Grid container alignItems="center">
                    <Grid item>{t('SettingModal.hide')}</Grid>
                    <Grid item>
                      <Switch
                          checked={enableSysMessage}
                          onChange={(e) => {setEnableSysMessage(e.target.checked)}}
                          color="secondary"
                          name="join_leave_message"
                          inputProps={{ 'aria-label': 'system message checkbox' }}
                      />
                    </Grid>
                    <Grid item>{t('SettingModal.show')}</Grid>
                  </Grid>
                </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={0}>
                <Grid item xs={12} spacing={5}>
                    <span>{t('SettingModal.gift_messages')}</span>
                </Grid>
                <Grid item xs={12} spacing={5}>
                  <Grid container alignItems="center">
                    <Grid item>{t('SettingModal.hide')}</Grid>
                    <Grid item>
                      <Switch
                          checked={showGiftMessage}
                          onChange={(e) => {setShowGiftMessage(e.target.checked)}}
                          color="secondary"
                          name="gift_message"
                          inputProps={{ 'aria-label': 'gift message checkbox' }}
                      />
                    </Grid>
                    <Grid item>{t('SettingModal.show')}</Grid>
                  </Grid>
                </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={0}>
                <Grid item xs={12} spacing={5}>
                    <span>{t('SettingModal.gift_for_me')}</span>
                </Grid>
                <Grid item xs={12} spacing={5}>
                  <Grid container alignItems="center">
                    <Grid item>{t('SettingModal.hide')}</Grid>
                    <Grid item>
                      <Switch
                          checked={showGift}
                          onChange={(e) => {setShowGift(e.target.checked)}}
                          color="secondary"
                          name="gift_movie"
                          inputProps={{ 'aria-label': 'gift checkbox' }}
                      />
                    </Grid>
                    <Grid item>{t('SettingModal.show')}</Grid>
                  </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
export default MessageSetting;