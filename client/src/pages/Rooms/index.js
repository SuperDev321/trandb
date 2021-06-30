import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { FormControlLabel, Checkbox, Container, Button } from '@material-ui/core';
import { RoomsList, PublicLayout } from '../../components';
import { makeStyles } from '@material-ui/styles';
import {UserContext} from '../../context';
import {useTranslation} from 'react-i18next';
import { getRooms } from '../../apis';
import './style.css';


const useStyles = makeStyles((theme) => ({
    action: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
    }
}));

const Rooms = () => {
    const classes = useStyles();
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [showEmpty, setShowEmpty] = useState(false);
    const history = useHistory();
    const {t} = useTranslation();
    const { auth, role, setLoading } = useContext(UserContext);

    useEffect(() => {
        getRooms((data) => {
            setLoading(false);
            if(Array.isArray(data)) {
                let sortedRooms = data.sort((roomA, roomB) => {
                    return roomB.users - roomA.users;
                });
                setRooms(sortedRooms);
            }
           
        },
        (err) => {
            setLoading(false);
            setError(err);
        }
        );
    }, [setRooms, setLoading, setError]);

    return (
        <div className="rooms__wrapper">
        <PublicLayout />
        {error ? (
            <p className="rooms__error">{error}</p>
        ) : (
            <Container>
            <div className={classes.action}>
            <FormControlLabel
                control={<Checkbox 
                    name="showEmpty"
                    onChange={(e)=> setShowEmpty(e.target.checked)}
                    color="primary"/>}
                    label={t('AddRoomModal.show_empty_room')}
            />
            { (role !=='guest') && (auth) &&
                <Button
                color="primary"
                component="button"
                variant="contained"
                className={classes.roomButton}
                onClick={() => { history.push('/room/create')}}
            >{t('AddRoomModal.create_room')}</Button>
            }
            </div>
            {rooms &&
                <RoomsList rooms={rooms} showEmpty = {showEmpty} />
            }
            </Container>
        )}
        </div>
    );
};

export default Rooms;
