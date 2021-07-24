import React, {useState, useContext, useEffect} from 'react';
import {
    Switch,
    Grid
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';

const CameraSetting = ({ autoBroadcast, setAutoBroadcast }) => {
    const {t} = useTranslation();
  
    const handleChange = (event) => {
        setAutoBroadcast(event.target.checked)
    }

    return (
        <div>
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item xs={12}>
                    <span>{t('SettingModal.auto_broadcast')}</span>
                </Grid>
                <Grid item>{t('SettingModal.off')}</Grid>
                <Grid item>
                    <Switch
                        checked={autoBroadcast}
                        onChange={handleChange}
                        color="secondary"
                        name="auto_broadcast"
                        inputProps={{ 'aria-label': 'auto_broadcast checkbox' }}
                    />
                </Grid>
                <Grid item>{t('SettingModal.on')}</Grid>
            </Grid>
        </div>
    )
}
export default CameraSetting;