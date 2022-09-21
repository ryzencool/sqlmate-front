import React from 'react'
import {TextField} from "@mui/material";
import {Controller} from 'react-hook-form'

export default function FormInputText({control, name, label}) {
    return <Controller
        name={name}
        control={control}
        render={({field: {onChange, value}}) => (
            <TextField autoFocus
                       margin="dense"
                       fullWidth
                       variant="standard"
                       onChange={onChange}
                       value={value}
                       label={label}/>
        )}
    />
}
