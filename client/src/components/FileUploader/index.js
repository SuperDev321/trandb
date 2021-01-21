import React, {useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
    Button,
    Input
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        marginBottom: 10
    },
    name: {
        flexGrow: 1
    },
    uploadButton: {
        marginRight: 5 
    }
}))

const FileUploader = props => {
  // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null);
    const [fileName, setFileName] = useState('');
    const classes = useStyles()
    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        if(fileUploaded) {
            setFileName(fileUploaded.name);
        }
        props.handleFile(fileUploaded);
    };
    return (
        <div className={classes.root}>
            <Button className={classes.uploadButton}
                type='button' onClick={handleClick} variant="contained" color="primary" component="span">
                {props.title}
            </Button>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{display: 'none'}} 
            />
            <Input className={classes.name}
            value={fileName} disabled inputProps={{ 'aria-label': 'file-name' }} />
        </div>
    );
}
export default FileUploader;