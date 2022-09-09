import {useForm} from "react-hook-form";
import React, {useEffect} from "react";

import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import FormInputText from "../../../components/form/FormInputText";

export const EditTableDialog = ({value, open, closeDialog, submitForm}) => {


    const {handleSubmit, control, reset} = useForm({
        defaultValues: value
    })


    useEffect(() => {
        reset(value)
    }, [value])

    return <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>修改表信息</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            console.log("内部提交", data)
            submitForm(data)
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"表名"}/>
                <FormInputText name={"note"} control={control} label={"备注"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>取消</Button>
                <Button type={"submit"} onClick={closeDialog}>确定</Button>
            </DialogActions>
        </form>
    </Dialog>;
}
