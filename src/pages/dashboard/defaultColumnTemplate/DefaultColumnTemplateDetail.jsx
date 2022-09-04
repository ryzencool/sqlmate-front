import React, {useEffect, useMemo, useState} from 'react'
import {useParams} from "react-router-dom";
import {useListDefaultColumn} from "../../../store/rq/reactQueryStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addDefaultColumn, updateDefaultColumn} from "../../../api/dbApi";
import ZTable, {IndeterminateCheckbox} from "../../../components/table/ZTable";
import * as _ from "lodash";
import {Chip, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import FormInputText from "../../../components/form/FormInputText";
import FormCheckBox from "../../../components/form/FormCheckBox";

export default function DefaultColumnTemplateDetail() {

    const {id: templateId} = useParams()

    const queryClient = useQueryClient()
    const [columnsSelectedState, setColumnsSelectedState] = useState([])
    const [addColumnOpen, setAddColumnOpen] = useState(false)
    const [updateColumnOpen, setUpdateColumnOpen] = useState(false)
    const columnsMemo = useMemo(() => columnHeader, [])

    const defaultColumnsQuery = useListDefaultColumn({
        templateId: templateId
    })
    const columnAddMutation = useMutation(addDefaultColumn, {
        onSuccess: data => {
            queryClient.invalidateQueries(['defaultColumns'])
        }
    })

    const columnUpdateMutation = useMutation(updateDefaultColumn, {
        onSuccess: data => {
            queryClient.invalidateQueries(['defaultColumns'])
        }
    })

    const handleColumnSelected = (params) => {
        setColumnsSelectedState(_.keys(params))
    }

    const submitAddColumn = (data) => {
        columnAddMutation.mutate({
            ...data,
            templateId: templateId
        })
        setAddColumnOpen(false)
    }

    const submitUpdateColumn = (data) => {
        columnUpdateMutation.mutate({
            ...data,
        })
    }

    const handleUpdateColumnDialogOpen = () => {
        setUpdateColumnOpen(false)
    }


    const handleCloseAddColumnDialog = () => {
        setAddColumnOpen(false)
    }

    if (defaultColumnsQuery.isLoading) {
        return <div>加载中</div>
    }

    return (
        <div>
            <div className={'flex flex-col gap-2'}>
                <div className={'flex flex-row gap-2'}>
                    <Button size={'small'} variant={'contained'} onClick={() => setAddColumnOpen(true)}>新增</Button>
                    <Button size={'small'} variant={'contained'}>编辑</Button>
                    <Button size={'small'} variant={'contained'}>删除</Button>
                </div>
                <ZTable data={defaultColumnsQuery.data.data.data} columns={columnsMemo}
                        getSelectedRows={it => handleColumnSelected(it)} canSelect={true}/>
                <EditColumnDialog mode={1} closeDialog={handleCloseAddColumnDialog} open={addColumnOpen}
                                  submitForm={submitAddColumn}/>
                <EditColumnDialog mode={2} closeDialog={handleUpdateColumnDialogOpen} open={updateColumnOpen}
                                  submitForm={submitUpdateColumn}/>
            </div>
        </div>
    )
}

const EditColumnDialog = ({
                              mode, value, open, closeDialog, submitForm
                          }) => {

    const {handleSubmit, control, watch, reset, getValues} = useForm({
        defaultValues: value
    })

    useEffect(() => {
        if (value != null) {
            reset(value)
        }
    }, [value])

    return <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{mode === 1 ? "新增字段" : "编辑字段"}</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            submitForm(data)
            reset({})
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"字段名称"}/>
                <FormInputText name={"type"} control={control} label={"类型"}/>
                <FormInputText name={"note"} control={control} label={"备注"}/>
                <FormInputText name={"defaultValue"} control={control} label={"默认值"}/>
                <FormCheckBox name={"isPrimaryKey"} control={control} label={"主键"}/>
                <FormCheckBox name={"isNull"} control={control} label={"非空"}/>
                <FormCheckBox name={"isAutoIncrement"} control={control} label={"自增"}/>
                <FormCheckBox name={"isUniqueKey"} control={control} label={"唯一"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    closeDialog();
                    reset({});
                }}>取消</Button>
                <Button type={"submit"}>确定</Button>
            </DialogActions>
        </form>
    </Dialog>
}


const columnHeader = [
    {
        id: "select",
        header: ({table}) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler()
                }}
            />
        ),
        cell: ({row}) => (
            <div>
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler()
                    }}
                />
            </div>
        )
    },
    {
        accessorKey: "name",
        header: () => <div>名称</div>,
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "type",
        header: () => <div>类型</div>,
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "note",
        header: () => <div>备注</div>,
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "settings",
        header: () => <div>配置</div>,
        cell: (info) => {
            return (<div className={"flex flex-row gap-1"}>
                {info.row.original.isPrimaryKey && <Chip label={"pk"} size={"small"}/>}
                {info.row.original.isAutoIncrement && <Chip size={"small"} label={"auto inc"}/>}
                {info.row.original.isNull && <Chip size={"small"} label={"not null"}/>}
                {info.row.original.isUniqueKey && <Chip size={"small"} label={"unique"}/>}
            </div>)
        },

    },

    {
        accessorKey: "comment",
        header: () => <div>注释</div>,
        cell: (info) => info.getValue(),
    },
]

