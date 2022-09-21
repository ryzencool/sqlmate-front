import React, {useState} from 'react'
import {Controller} from 'react-hook-form'
import {FormControl, InputLabel, ListItemText, MenuItem, Select} from "@mui/material";

const MenuProps = {
    variant: "menu",
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "left"
    },
    getContentAnchorEl: null
};

export default function FormMultiSelect({control, name, label, choices}) {

    const [isOpen, setOpen] = useState(false);
    return <Controller
        control={control}
        name={name}
        render={({field: {onChange, value, onBlur, ...otherOptions}}) => {
            console.log(value);
            return (
                <FormControl size={'small'} variant="standard" sx={{width: "100% ", marginTop: "10px" }}>
                    <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>

                    <Select variant={"standard"}
                        style={{width: "100%"}}
                        multiple
                        value={value === undefined ? [] : value}

                        onClose={(event) => {
                            // @ts-expect-error TS(2554) FIXME: Expected 0 arguments, but got 1.
                            onBlur(event);
                            setOpen(false);
                        }}
                        onChange={onChange}
                        onOpen={() => setOpen(true)}
                        open={isOpen}
                        displayEmpty={true}
                        // @ts-expect-error TS(2322) FIXME: Type '{ variant: string; anchorOrigin: { vertical:... Remove this comment to see the full error message
                        MenuProps={MenuProps}

                        renderValue={(selected) => {
                            console.log("表达", selected)
                            console.log(selected?.map((option) => option.value).join(", "))
                            return (
                                selected === undefined ? "":  choices.filter(it => selected.includes(it.key)).map(it => it.value).join(", ")
                            );
                        }}
                        {...otherOptions}
                >
                    {choices.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                            <ListItemText primary={option.value}/>
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
            );
        }}
    />
}
