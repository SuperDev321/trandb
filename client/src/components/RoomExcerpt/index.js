/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import propTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardMedia, CardActions, Button } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 500,
    },
    media: {
        paddingTop: '70%',
        backgroundSize: '100% 100%'

    },
    content: {
        minHeight: 100
    },
    connect: {
        margin: 'auto'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 25,
        padding: 5
    },
    owner: {
        fontWeight: 400,
        display: 'flex',
        padding: 5
    },
    description: {
        padding: 5
    }
}))

const RoomExcerpt = ({ name, owner, icon, cover ,description, users }) => {
    const history = useHistory();
    const classes = useStyles();
    const {t} = useTranslation()
    return (
        <Card
            className={classes.root}
        >
            <CardMedia
                className={classes.media}
                image={cover? "/img/rooms/"+cover: "/img/public_chat.png"}
            />
            <CardContent className={classes.content}>
                <div className={classes.name}>{name}</div>
                <div className={classes.description}>{description}</div>
                <div className={classes.owner}><strong>Admin:&nbsp;</strong><span>{owner}</span></div>
            </CardContent>
            <CardActions>
                <div className={classes.connect}>
                    <Button
                        variant="contained"
                        onClick={() =>{history.push(`/rooms/${name}`)}}
                    >
                        {t('LandingPage.join')}
                    </Button>
                </div>
                <div>
                    <PeopleIcon fontSize="small" />
                    <span>{users}</span>
                </div>
            </CardActions>
        </Card>
    );
};

RoomExcerpt.propTypes = {
    name: propTypes.string.isRequired,
    users: propTypes.number.isRequired,
};

export default RoomExcerpt;
