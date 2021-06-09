import React from 'react'
import {
    Tooltip,
} from '@material-ui/core';

const CustomTooltip = ({disabled, children, ...props}) => {
    if (disabled) {
        return (
            <>
                {children}
            </>
        )
    } else {
        return (
            <Tooltip {...props}>
                {children}
            </Tooltip>
        )
    }
}
export default CustomTooltip