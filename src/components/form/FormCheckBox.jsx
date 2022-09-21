import React from 'react'
import {Controller} from 'react-hook-form'
import {Checkbox, FormControlLabel} from "@mui/material";

export default function FormCheckBox({control, name, label}) {

    return <Controller
        render={({field: {onChange, value}}) => {
            return <FormControlLabel control={<Checkbox checked={value} onChange={onChange}/>} label={label}/>
        }}
        control={control}
        name={name}/>
}
