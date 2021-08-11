import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Input } from '@material-ui/core';
import MaskedInput from 'react-text-mask';
import CustomTextField from '../../CustomTextField';
import GiftSnap from '../GiftSnap'
import useStyles from './styles';
import { UserContext } from '../../../context';

function NaturalNumberInput(props) {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={ value=> {
            const length = value.length;
            switch (length) {
            case 0:
                return [];
            case 1:
                return [/[1-9]/];
            case 2:
                return [/[1-9]/, /\d/, /\d/];
            case 3:
                return [/[1-9]/, /\d/, /\d/];
            default:
                return [/[1-9]/, /\d/, /\d/];
            }
        }}
        placeholderChar={'\u2000'}
        // showMask
      />
    );
}

const GiftForm = ({gift, username, amount, setAmount}) => {
    const classes = useStyles();
    const [neededMoney, setNeededMoney] = useState(0);
    const { point: myPoint } = useContext(UserContext);

    useEffect(() => {
        console.log(amount)
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

    const { name, src, imageSrc } = gift;
    
    return (
        <div className={classes.root}>
            <GiftSnap src={imageSrc} name={name} />
            <div className={classes.detail}>
                <TextField name="receiver" id="gift-receiver" value={username} type="text" />
                <Input  name="gift-amount" id="gift-amount"
                    value={amount}
                    // InputProps={{ inputProps: { min: 1 } }}
                    onChange={(e) => setAmount(Number(e.target.value)) }
                    inputComponent={NaturalNumberInput}
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