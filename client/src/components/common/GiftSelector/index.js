import React from 'react';
import GiftSnap from '../GiftSnap';
import useStyles from './styles';

const GiftSelector = ({gifts, onPick}) => {
    const classes = useStyles();

    const onClickGift = (name) => {
        if (typeof onPick === 'function') {
            onPick(name); 
        }
    }

    if (!Array.isArray(gifts) || gifts.length === 0) {
        return null;
    }

    return (
        <div className={classes.root}>
        {
            gifts.map(({name, src}) => (
                <GiftSnap key={name} onClick={() => onClickGift(name)} src={src} name={name} />
            ))
        }
        </div>
    )
}

export default GiftSelector;