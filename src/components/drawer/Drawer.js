import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles({
    list: {
        width: 500,
    },
    fullList: {
        width: 'auto',
    },
});

export default function TemporaryDrawer(props) {
    const classes = useStyles();

    const {open, content, onClose} = props;

    return (
        <React.Fragment key={"left"}>
            <Drawer
                anchor={"left"}
                open={open}
                onClose={onClose}
            >
                <div
                    className={clsx(classes.list, {
                        [classes.fullList]: false,
                    })}
                    role="presentation"
                >
                    {content()}
                </div>
            </Drawer>
        </React.Fragment>
    );
}