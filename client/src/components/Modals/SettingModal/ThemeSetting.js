import React, {useState, useContext, useEffect} from 'react';
import {
    Switch,
    Grid
} from '@material-ui/core';
import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
const ThemeSetting = () => {
    const {currentTheme, setTheme} = useContext(CustomThemeContext);
    const [checked, setChecked] = useState((currentTheme !== 'normal'));

    useEffect(() => {
        if(currentTheme) {
            if(currentTheme === 'normal') {
                setChecked(false);
            } else {
                setChecked(true);
            }
        }
    }, [currentTheme]);
    const handleChange = (event) => {
        if(setTheme) {
            if(event.target.checked) {
                setTheme('dark');
            } else {
                setTheme('normal');
            }
        }
    }
    return (
        <div>
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Normal</Grid>
                <Grid item>
                    <Switch
                        checked={checked}
                        onChange={handleChange}
                        color="secondary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </Grid>
                <Grid item>Dark</Grid>
            </Grid>
        </div>
    )
}
export default ThemeSetting;