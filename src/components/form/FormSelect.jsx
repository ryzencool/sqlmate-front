import React from 'react'
import {Controller} from 'react-hook-form'
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function FormSelect({control, name, label, choices, hasDefaultNull = false}) {
    let tempChoice
    if (hasDefaultNull) {
        tempChoice = [{key: 0, value: "空"}, ...choices]
    } else {
        tempChoice = choices
    }

    return <Controller render={
        ({field: {onChange, value}}) => {
            return <FormControl size={'small'} variant="standard" sx={{width: "100%", marginTop: "10px"}}>
                <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
                <Select
                    fullWidth
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={value === null ? {key: 0, value: ""} : value}
                    onChange={onChange}
                    label={label}
                >
                    {tempChoice.map(choice => <MenuItem key={choice.key} value={choice.key}>{choice.value}</MenuItem>)}
                </Select>
            </FormControl>
        }
    } control={control} name={name}/>
}
