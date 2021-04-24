import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

const useStyles = makeStyles({
    root: {
      width: 150,
      color: '#f5f5f5'
    },
    slider: {
        color: '#f5f5f5'
    },
    grid: {
        display: 'flex',
        alignItems: 'center'
    }
});

const VolumnControl = ({value, handleChange}) => {
    const classes = useStyles();
    // const [value, setValue] = React.useState(30);

    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };
    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item className={classes.grid}>
                    <VolumeDown />
                </Grid>
                <Grid item xs  className={classes.grid}>
                    <Slider className={classes.slider} value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
                </Grid>
                <Grid item  className={classes.grid}>
                    <VolumeUp />
                </Grid>
        </Grid>
      </div>
    );
};

export default VolumnControl;