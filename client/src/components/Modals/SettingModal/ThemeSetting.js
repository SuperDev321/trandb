import React, {useState, useContext, useEffect} from 'react';
import {
    Switch,
    Grid
} from '@material-ui/core';
import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
const ThemeSetting = () => {
    const contextValue = useContext(CustomThemeContext);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if(contextValue) {
            if(contextValue.currentTheme === 'normal') {
                setChecked(false);
            } else {
                setChecked(true);
            }
        }
    }, [contextValue]);
    const handleChange = (event) => {
        if(contextValue && contextValue.setTheme) {
            if(event.target.checked) {
                contextValue.setTheme('dark');
            } else {
                contextValue.setTheme('normal');
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