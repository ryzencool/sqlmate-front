import {useForm} from "react-hook-form";
import React, {useEffect} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import FormInputText from "../../../components/form/FormInputText";
import FormSelect from "../../../components/form/FormSelect";

export const EditIndexDialog = ({
                             mode, value, open, closeDialog, submitForm
                         }) => {
    const {handleSubmit, control, reset} = useForm({
        defaultValues: value
    })

    useEffect(() => {
        if (value != null) {
            reset(value)
        }
    }, [value])

    return <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{mode === 0 ? "新增" : "编辑"}</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            submitForm(data)
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"索引名称"}/>
                <FormSelect
                    name={"type"}
                    control={control}
                    label={"索引类型"}
                    // @ts-expect-error TS(2322) FIXME: Type '{ name: string; control: Control<any, any>; ... Remove this comment to see the full error message
                    value={"unique_key"}
                    choices={[{
                        key: "unique_key",
                        value: "UNIQUE KEY"
                    }]}/>
                <FormInputText name={"columns"} control={control} label={"字段"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>取消</Button>
                <Button type={"submit"} onClick={closeDialog}>确定</Button>
            </DialogActions>
        </form>
    </Dialog>
}
