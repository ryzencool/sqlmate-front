import {useForm} from "react-hook-form";
import {useListDefaultColumnTemplate} from "../../../store/rq/reactQueryStore";
import React, {useEffect} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import FormInputText from "../../../components/form/FormInputText";
import FormSelect from "../../../components/form/FormSelect";
import Button from "@mui/material/Button";

export function TableCreateDialog({value, open, closeDialog, submitForm}) {

    const {control, handleSubmit, reset} = useForm()
    const defaultColumTemplateQuery = useListDefaultColumnTemplate({})

    useEffect(() => {
        reset(value)
    }, [])

    if (defaultColumTemplateQuery.isLoading) {
        return <div>加载中</div>
    }
    const defaultColumnTemplates = defaultColumTemplateQuery.data.data.data.map(it => (
        {
            key: it.id,
            value: it.name
        }
    ))


    return <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>创建表</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            submitForm(data, reset)
        })}>
            <DialogContent>

                <FormInputText
                    control={control}
                    name={"name"}
                    label={"表名称"}
                />

                <FormInputText
                    control={control}
                    name={"note"}
                    label={"备注"}
                />

                <FormSelect name={"defaultColumnTemplateId"}
                            control={control}
                            label={"默认字段模版"}
                            hasDefaultNull={true}
                            choices={defaultColumnTemplates}/>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    closeDialog();
                    reset({})
                }}>取消</Button>
                <Button type={"submit"}>确定</Button>
            </DialogActions>
        </form>

    </Dialog>
}
