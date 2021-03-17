import React, {useState, useContext, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        padding: 20
    }
}))

const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);
const SoundSetting = ({enablePokeSound, setEnablePokeSound, enablePrivateSound, setEnablePrivateSound,
    enablePublicSound, setEnablePublicSound}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const handleChangePublic = (event) => {
        setEnablePublicSound(event.target.checked);
    };
    const handleChangePrivate = (event) => {
        setEnablePrivateSound(event.target.checked);
    };
    const handleChangePoke = (event) => {
        setEnablePokeSound(event.target.checked);
    };

    return (
        <div className={classes.root}>
            <FormGroup column="true">
                <FormControlLabel
                    control={<GreenCheckbox checked={enablePublicSound} onChange={handleChangePublic} name="publicSound" />}
                    label={t('SettingModal.public_message')}
                />
                <FormControlLabel
                    control={<GreenCheckbox checked={enablePrivateSound} onChange={handleChangePrivate} name="privateSound" />}
                    label={t('SettingModal.private_message')}
                />
                <FormControlLabel
                    control={<GreenCheckbox checked={enablePokeSound} onChange={handleChangePoke} name="publicSound" />}
                    label={t('SettingModal.poke_message')}
                />
                
            </FormGroup>
        </div>
    )
}
export default SoundSetting;