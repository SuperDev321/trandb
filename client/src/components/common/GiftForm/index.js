import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import CustomTextField from '../../CustomTextField';
import GiftSnap from '../GiftSnap'
import useStyles from './styles';
import { UserContext } from '../../../context';

const GiftForm = ({gift, username, amount, setAmount}) => {
    const classes = useStyles();
    const [neededMoney, setNeededMoney] = useState(0);
    const { point: myPoint } = useContext(UserContext);

    useEffect(() => {
        if (gift) {
            const {cost} = gift;
            setNeededMoney(cost*amount);
        } else {
            setNeededMoney(0)
        }
    }, [gift, amount])

    if (!gift) {
        return null;
    }

    const { name, src } = gift;
    
    return (
        <div className={classes.root}>
            <GiftSnap src={src} name={name} />
            <div className={classes.detail}>
                <TextField name="receiver" id="gift-receiver" value={username} type="text" />
                <TextField name="gift-amount" id="gift-amount" value={amount}
                    type="number"
                    onChange={(e) => setAmount(e.target.value) }
                />
                <div>
                    <span>You need to pay:&nbsp;</span>
                    <span>{neededMoney}</span>
                </div>
                <div>
                    <span>Your Credits:&nbsp;</span>
                    <span>{myPoint}</span>
                </div>
            </div>
        </div>
    )
}

export default GiftForm;