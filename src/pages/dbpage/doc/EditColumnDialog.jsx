import {useFieldArray, useForm} from "react-hook-form";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import FormInputText from "../../../components/form/FormInputText";
import Box from "@mui/material/Box";
import FormFaker from "../../../components/form/FormFaker";
import FormCheckBox from "../../../components/form/FormCheckBox";
import FormSelect from "../../../components/form/FormSelect";
import FormTableAndColumnSelectBox from "../../../components/form/FormTableAndColumnSelectBox";
import React, {useEffect} from "react";

export const EditColumnDialog = ({
                                     value, open, closeDialog, submitForm, resetValue
                                 }) => {

    const {handleSubmit, control, watch, reset, getValues} = useForm({
        defaultValues: value
    })

    const {fields, append} = useFieldArray({
        control,
        name: "relationShip"
    });


    useEffect(() => {
        if (value != null) {
            reset(value)
        }
    }, [value])

    return <Dialog open={open} onClose={() => {
        closeDialog();
        reset();
    }
    }>
        <DialogTitle>新增</DialogTitle>
        <form onSubmit={handleSubmit((data) => {
            submitForm(data, reset)
            closeDialog()
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"字段名称"}/>
                <FormInputText name={"type"} control={control} label={"类型"}/>
                <FormInputText name={"note"} control={control} label={"备注"}/>
                <FormInputText name={"defaultValue"} control={control} label={"默认值"}/>
                <Box sx={{display: "flex", flexDirection: "row", gap: "30px"}}>
                    <FormFaker control={control}
                               nameKind={"kindKey"}
                               nameCate={"cateKey"}
                               watch={watch}
                               getValues={getValues}/>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row", gap: "20px", marginTop: "20px"}}>
                    <FormCheckBox name={"isPrimaryKey"} control={control} label={"主键"}/>
                    <FormCheckBox name={"isNotNull"} control={control} label={"非空"}/>
                    <FormCheckBox name={"isAutoIncrement"} control={control} label={"自增"}/>
                    <FormCheckBox name={"isUniqueKey"} control={control} label={"唯一"}/>
                </Box>

                <Box sx={{display: "flex", flexDirection: "row", gap: "2", marginTop: "20px", alignItems: "center"}}>
                    <Button size={"small"} variant={"contained"}
                            onClick={() => append({type: "", tableId: "", columnId: ""})}>添加关系</Button>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1, marginTop: '4px'}}>
                    {
                        fields.map(
                            (item, index) =>
                                <Box key={index}
                                     sx={{display: "flex", flexDirection: "row", gap: 2, width: '100%'}}>
                                    <FormSelect name={`relationShip.${index}.type`}
                                                label={"关系类型"}
                                                control={control}
                                                choices={[
                                                    {key: 1, value: "一对一"},
                                                    {key: 2, value: "一对多"},
                                                    {key: 3, value: "多对多"},
                                                ]}/>
                                    <FormTableAndColumnSelectBox nameTable={`relationShip.${index}.tableId`}
                                                                 nameColumn={`relationShip.${index}.columnId`}
                                                                 control={control}
                                                                 watch={watch}
                                                                 index={index}
                                    />
                                </Box>
                        )
                    }

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    closeDialog();
                    reset();
                }
                }>取消</Button>
                <Button type={"submit"}>确定</Button>
            </DialogActions>
        </form>
    </Dialog>
}
