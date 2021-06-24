import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@material-ui/core';
import GiftSelector from '../../common/GiftSelector';
import GiftForm from '../../common/GiftForm';
import SeparateLine from '../../SeparateLine';
import { socket } from '../../../utils';
import getGifts from '../../../utils/getGifts';
import config from '../../../config';
// const useStyles = makeStyles((theme) => ({
//     root: {
//       width: '100%',
//       minWidth: 400,
//       padding: '0 10px',
//       backgroundColor: theme.palette.background.paper,
//     },
//     button: {
//         margin: '0 10px',
//         // borderRadius: '0',
//         height: '30px'
//     },
// }));

// const gifts = [
//     {name: 'tree', src: '/gifts/tree.mp4'},
//     {name: 'female', src: '/gifts/female.mp4'}
// ]

export default function GiftModal({open, setOpen, username}) {
    // const classes = useStyles();]
    const [currentGift, setCurrentGift] = React.useState(null);
    const [gifts, setGifts] = React.useState([]);
    const [amount, setAmount] = React.useState(1);
    const changeGift = (giftName) => {
        const gift = gifts.find(({name}) => (name === giftName));
        setCurrentGift(gift)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if (currentGift) {
            socket.emit('send gift', {
                to: username,
                giftId: currentGift._id
            }, (res) => {
                console.log('callback of gift', res)
            })
        }
    }

    useEffect(() => {
        if (open) {
            getGifts((data) => {
                if (data && Array.isArray(data.gifts)) {
                    const gifts = data.gifts.map((item) => {
                        const src = config.gift_path + item.src;
                        return { ...item, src };
                    })
                    setGifts(gifts);
                    if (gifts.length) {
                        setCurrentGift(gifts[0])
                    }
                }
            }, () => {

            })
        }
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="gift-dialog-title"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="gift-dialog-title">Gifts</DialogTitle>
            <SeparateLine />
            <DialogContent>
                <GiftSelector gifts={gifts} onPick={(gift) => {changeGift(gift)}} />
                <SeparateLine />
                <GiftForm username={username} gift={currentGift} amount={amount} setAmount={setAmount}/>
            </DialogContent>
            <DialogActions>
                <Button color='primary' variant="contained" style={{marginRight: 4}}
                    onClick={() => handleSubmit()}
                >Submit</Button>
                <Button color='primary' variant="outlined" onClick={() =>handleClose()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}