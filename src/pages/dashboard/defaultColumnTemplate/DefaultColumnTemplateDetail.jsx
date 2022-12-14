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
        return <div>?????????</div>
    }

    return (
        <div>
            <div className={'flex flex-col gap-2'}>
                <div className={'flex flex-row gap-2'}>
                    <Button size={'small'} variant={'contained'} onClick={() => setAddColumnOpen(true)}>??????</Button>
                    <Button size={'small'} variant={'contained'}>??????</Button>
                    <Button size={'small'} variant={'contained'}>??????</Button>
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
        <DialogTitle>{mode === 1 ? "????????????" : "????????????"}</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            submitForm(data)
            reset({})
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"????????????"}/>
                <FormInputText name={"type"} control={control} label={"??????"}/>
                <FormInputText name={"note"} control={control} label={"??????"}/>
                <FormInputText name={"defaultValue"} control={control} label={"?????????"}/>
                <FormCheckBox name={"isPrimaryKey"} control={control} label={"??????"}/>
                <FormCheckBox name={"isNotNull"} control={control} label={"??????"}/>
                <FormCheckBox name={"isAutoIncrement"} control={control} label={"??????"}/>
                <FormCheckBox name={"isUniqueKey"} control={control} label={"??????"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    closeDialog();
                    reset({});
                }}>??????</Button>
                <Button type={"submit"}>??????</Button>
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
        header: () => <div>??????</div>,
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "type",
        header: () => <div>??????</div>,
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "note",
        header: () => <div>??????</div>,
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "settings",
        header: () => <div>??????</div>,
        cell: (info) => {
            return (<div className={"flex flex-row gap-1"}>
                {info.row.original.isPrimaryKey && <Chip label={"pk"} size={"small"}/>}
                {info.row.original.isAutoIncrement && <Chip size={"small"} label={"auto inc"}/>}
                {info.row.original.isNotNull && <Chip size={"small"} label={"not null"}/>}
                {info.row.original.isUniqueKey && <Chip size={"small"} label={"unique"}/>}
            </div>)
        },

    },

    {
        accessorKey: "comment",
        header: () => <div>??????</div>,
        cell: (info) => info.getValue(),
    },
]

