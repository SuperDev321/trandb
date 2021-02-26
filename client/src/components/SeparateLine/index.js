import React from 'react';
import {
    Divider
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const SeparateLine = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.separate.main
    },
}))((props) => (
    <Divider
        {...props}
    />
));

export default SeparateLine;