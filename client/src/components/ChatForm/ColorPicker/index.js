import React, { useState } from 'react';
import useStyles from './styles'
import { useEffect } from 'react';
import ColorSnap from './ColorSnap'

const colorPanels = [
    'default',
    'color1',
    'color2',
    'color3',
    'color4',
    'color5',
    'color6',
    'color7',
    'color8',
    'color9',
    'color10',
    'color11',
    'color12',
    'color13',
    'color14',
    'color15',
    'color16',
    'color17',
    'color18',
    'color19',
    'color20',
    'color21',
    'color22',
    'color23',
    'color24',
    'color25',
    'color26',
    'color27',
];

const ColorPicker = ({userColor, setUserColor, backgroundColor, defaultColor}) => {
    // my code start
    const classes = useStyles({userColor, backgroundColor});
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
            <div className={classes.userColor}>&nbsp;</div>
                {colorPanel && <div className={classes.colorPanel}>
                    {colorPanels.map((color, key) => {
                        return (
                            <ColorSnap color={color} active={(userColor === color)}
                                onClick={() => onSelectColor(color)}
                                key={key}
                            />
                        );
                    })}
            </div>}
        </div>
        </>
    )
}

export default ColorPicker;

  {/* <div className={`${classes.colorSnap} ${userColor === color ? 'active' : ''}`}
                            style={{backgroundColor: color? (color==='default' ? defaultColor: color): '#fff' }}
                                key={key} onClick={() => onSelectColor(color)}>
                            </div> */}