import React, { useState } from 'react';
import useStyles from './styles'
import { useEffect } from 'react';

const colorPanels = [
    'default',
    '#656565',
    '#0400E6',
    '#6f4341',
    '#990703',
    '#ca226b',
    '#f778a1',
    '#f32f2f',
    '#FF6600',
    '#FF9900',
    '#f1c85e',
    '#006666',
    '#2F4F4F',
    '#6633CC',
    '#47b617',
    '#5cd87e',
    '#6db4e9',
    '#CC0066',
    '#077104',
    '#0a40f5',
    '#1a61e3',
    '#800080',
    '#993399',
    '#009900',
    '#33CC66',
    '#660000',
    '#6666FF',
    '#20264d',
];

const ColorPicker = ({userColor, setUserColor, backgroundColor, defaultColor}) => {
    // my code start
    const classes = useStyles({backgroundColor});
    const [colorPanel, setColorPanel] = useState(false);
    
    // end
    useEffect(() => {
        let colorMem = localStorage.getItem('input_color');
        if(colorMem) {
            setUserColor(colorMem);
        } else {
            setUserColor(colorPanels[0]);
        }
    }, [])
    // my code start
    const openColorArea = () => {
        setColorPanel((prevColor) => !prevColor);
    };

    const onSelectColor = (color) => {
        setUserColor(color);
        localStorage.setItem('input_color', color);
    };
    // end

    return (
        <>
        <div className={classes.colorArea} onClick={openColorArea}>
            <div className={classes.userColor} style={{backgroundColor: userColor === 'default' ? defaultColor: userColor}}>&nbsp;</div>
                {colorPanel && <div className={classes.colorPanel}>
                    {colorPanels.map((color, key) => {
                        return (
                            <div className={`${classes.colorSnap} ${userColor === color ? 'active' : ''}`}
                            style={{backgroundColor: color? (color==='default' ? defaultColor: color): '#fff' }}
                                key={key} onClick={() => onSelectColor(color)}>
                            </div>
                        );
                    })}
            </div>}
        </div>
        </>
    )
}

export default ColorPicker;