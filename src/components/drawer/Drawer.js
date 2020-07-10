import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

export default function TemporaryDrawer(props) {
    const {open, content, onClose} = props;

    return (
        <React.Fragment key={"left"}>
            <Drawer
                anchor={"left"}
                    open={open}
                    onClose={onClose}
            >
            </Drawer>
        </React.Fragment>
    );
}