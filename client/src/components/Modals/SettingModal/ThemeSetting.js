import React, {useState, useContext, useEffect} from 'react';
import {
    Switch,
    Grid
} from '@material-ui/core';
import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
const ThemeSetting = () => {
    const contextValue = useContext(CustomThemeContext);
    console.log(CustomThemeContext,contextValue)
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if(contextValue) {
            if(contextValue.currentTheme === 'normal') {
                setChecked(true);
            } else {
                setChecked(false);
            }
        }
    }, [contextValue]);
    const handleChange = (event) => {
        
        if(contextValue && contextValue.setTheme) {
            if(event.target.checked) {
                contextValue.setTheme('normal');
            } else {
                contextValue.setTheme('dark');
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
                <Grid item>Dard</Grid>
            </Grid>
        </div>
    )
}
export default ThemeSetting;