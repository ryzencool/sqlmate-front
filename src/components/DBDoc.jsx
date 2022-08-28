import React, {useEffect, useMemo, useState} from 'react'
import {activeTableAtom} from "../store/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addColumn, addIndex, deleteColumns, deleteIndex, updateColumn, updateIndex, updateTable} from "../api/dbApi";
import * as _ from 'lodash'
import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import ZTable, {IndeterminateCheckbox} from "./ZTable";
import {useGetProjectDetail, useGetTable, useListColumn, useListIndex} from "../store/rq/reactQueryStore";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import {useAtom} from "jotai";
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import AlertDialog from "./AlertDialog";
import {useFieldArray, useForm} from "react-hook-form";
import toast from "react-hot-toast";
import FormInputText from "./FormInputText";
import FormCheckBox from "./FormCheckBox";
import FormSelect from "./FormSelect";
import Box from "@mui/material/Box";
import FormTableAndColumnSelectBox from "./FormTableAndColumnSelectBox";
import {useNavigate} from "react-router";
import {activeProjectAtom} from "../store/projectStore";

function DBDoc() {
    const queryClient = useQueryClient()

    // state
    const [activeTableState, setActiveTableState] = useAtom(activeTableAtom)
    const [columnsSelectedState, setColumnsSelectedState] = useState([])
    const [indexesSelectedState, setIndexesSelectedState] = useState([])

    // dialog
    const [columnEditOpen, setColumnEditOpen] = useState(false)
    const [columnAddOpen, setColumnAddOpen] = useState(false)
    const [tableEditOpen, setTableEditOpen] = useState(false)
    const [indexEditOpen, setIndexEditOpen] = useState(false)
    const [indexAddOpen, setIndexAddOpen] = useState(false)
    const [indexDeleteOpen, setIndexDeleteOpen] = useState(false)
    const [deleteColumnOpen, setDeleteColumnOpen] = useState(false)


    // memo
    const indexesMemo = useMemo(() => indexHeader, [])
    const columnsMemo = useMemo(() => columnHeader, [])

    // query
    const tableQuery = useGetTable({tableId: activeTableState}, {
        enabled: !!activeTableState
    })
    const tableIndexesQuery = useListIndex({tableId: activeTableState}, {
        enabled: !!activeTableState
    })
    const projectQuery = useGetProjectDetail({projectId: 1})
    const tableColumnsQuery = useListColumn({tableId: activeTableState}, {
        enabled: !!activeTableState
    })



    // mutation
    const columnAddMutation = useMutation(addColumn, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tableColumns"])
        }
    })
    const columnsDeleteMutation = useMutation(deleteColumns, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tableColumns"])
        }
    })
    const columnUpdateMutation = useMutation(updateColumn, {
        onSuccess: () => {
            queryClient.invalidateQueries(['tableColumns'])
        }
    })
    const tableUpdateMutation = useMutation(updateTable, {
        onSuccess: () => {
            queryClient.invalidateQueries(['table'])
            queryClient.invalidateQueries(['projectTables'])
        }
    })
    const indexAddMutation = useMutation(addIndex, {
        onSuccess: () => {
            queryClient.invalidateQueries("tableIndexes")
        }
    })
    const indexUpdateMutation = useMutation(updateIndex, {
        onSuccess: () => {
            queryClient.invalidateQueries("tableIndexes")
        }
    })
    const indexDeleteMutation = useMutation(deleteIndex, {
        onSuccess: () => {
            queryClient.invalidateQueries("tableIndexes")
        }
    })


    const handleColumnSelected = (params) => {
        setColumnsSelectedState(_.keys(params))
    }

    const handleIndexSelected = (params) => {
        setIndexesSelectedState(_.keys(params))
    }

    if (tableQuery.isLoading || tableIndexesQuery.isLoading || projectQuery.isLoading || tableColumnsQuery.isLoading) {
        return <div>加载中</div>
    }
    return (
        <div className={"flex flex-col gap-5  "}>
            <div className={"flex-col flex gap-20"}>
                <div className={"flex flex-row gap-1"}>
                    <div className={'flex flex-row gap-2'}>
                        <TableViewOutlinedIcon/>
                        <div className={"text-base font-bold"}>
                            {tableQuery.data?.data.data.name}
                        </div>
                    </div>
                    <div onClick={() => {
                        setTableEditOpen(true)
                    }}>
                        <DriveFileRenameOutlineOutlinedIcon/>
                    </div>
                    <EditTableDialog
                        value={tableQuery.data?.data.data}
                        open={tableEditOpen}
                        closeDialog={() => setTableEditOpen(false)}
                        submitForm={(e) => {
                            tableUpdateMutation.mutate({
                                ...e,
                                tableId: activeTableState
                            })
                        }}/>

                </div>
            </div>
            <div className={"flex flex-col gap-1"}>

                <div className={"grid grid-cols-2 grid-rows-2 gap-1 text-sm w-1/6"}>
                    <div className={"text-gray-500 col-span-1 text-sm"}>创建人</div>
                    <div className={"col-span-1"}>zmy</div>
                    <div className={"text-gray-500"}>备注</div>
                    <div>{tableQuery.data.data.data.note}</div>
                </div>
            </div>
            <div>
                <div className={"text-base font-bold"}>字段</div>
                <div className={"mt-3"}>
                    <div className={"flex flex-row items-center gap-2"}>
                        <Button size={"small"} variant={"contained"} onClick={() => {
                            setColumnAddOpen(true)
                        }}>
                            新增
                        </Button>
                        <EditColumnDialog
                            closeDialog={() => {
                                setColumnAddOpen(false)
                            }}
                            open={columnAddOpen}
                            submitForm={data => {
                                columnAddMutation.mutate({
                                    ...data,
                                    tableId: activeTableState
                                })
                            }}/>
                        <Button size={"small"} variant={"contained"} onClick={() => {
                            console.log("选择的记录", columnsSelectedState)

                            if (columnsSelectedState.length === 0) {
                                toast.error("请至少选择一条记录", {position: 'top-center'})
                                return;
                            } else if (columnsSelectedState.length > 1) {
                                toast.error("同时只能编辑一条记录", {position: 'top-center'})
                                return;
                            }
                            setColumnEditOpen(true)

                        }}>
                            编辑
                        </Button>
                        <EditColumnDialog
                            value={tableColumnsQuery.data.data.data.filter(it => it.id.toString() === columnsSelectedState[0])[0]}
                            closeDialog={() => setColumnEditOpen(false)}
                            open={columnEditOpen}
                            submitForm={data => {
                                columnUpdateMutation.mutate({
                                    ...data,
                                    id: columnsSelectedState[0]
                                })
                            }}/>
                        <Button size={"small"} variant={"contained"} onClick={() => {
                            setDeleteColumnOpen(true)
                        }}>
                            删除
                        </Button>
                        <AlertDialog open={deleteColumnOpen} handleClose={() => setDeleteColumnOpen(false)}
                                     title={"是否确认删除当前选中的行？"}
                                     msg={""}
                                     confirm={() => {
                                         columnsDeleteMutation.mutate({
                                             columnIds: columnsSelectedState
                                         })
                                         setDeleteColumnOpen(false)
                                     }}/>
                    </div>
                    <div>
                        <ZTable data={tableColumnsQuery.data.data.data} columns={columnsMemo}
                                getSelectedRows={it => handleColumnSelected(it)} canSelect={true}/>

                    </div>
                </div>

            </div>

            <div>
                <div className={"text-base font-bold"}>索引</div>
                <div className={'mt-3'}>

                    <div className={'flex flex-row gap-2'}>
                        <Button size={"small"} variant={"contained"}
                                onClick={() => setIndexAddOpen(true)}>新增</Button>
                        <EditIndexDialog
                            mode={0}
                            open={indexAddOpen}
                            closeDialog={() => setIndexAddOpen(false)}
                            submitForm={data => {
                                console.log("添加index", data)
                                indexAddMutation.mutate({...data, tableId: activeTableState})
                            }}/>
                        <Button size={"small"} variant={"contained"}
                                onClick={() => {
                                    if (indexesSelectedState.length !== 1) {
                                        toast("同时仅仅能编辑一条记录", {
                                            position: "top-center"
                                        })
                                        return
                                    }
                                    setIndexEditOpen(true)
                                }}>编辑</Button>
                        <EditIndexDialog
                            mode={1}
                            value={
                                tableIndexesQuery.data.data.data.filter(it => it.id.toString() === indexesSelectedState[0])[0]}
                            open={indexEditOpen}
                            closeDialog={() => setIndexEditOpen(false)}
                            submitForm={data => {
                                indexUpdateMutation.mutate({
                                    ...data,
                                    tableId: activeTableState,
                                    id: indexesSelectedState[0]
                                })
                            }}

                        />
                        <Button size={"small"} variant={"contained"}
                                onClick={() => setIndexDeleteOpen(true)}>删除</Button>
                        <AlertDialog open={indexDeleteOpen} handleClose={() => setIndexDeleteOpen(false)}
                                     title={"确认删除当前选中的索引吗"} confirm={() => {
                            indexDeleteMutation.mutate({
                                indexesId: indexesSelectedState
                            })
                            setIndexDeleteOpen(false)
                        }}/>
                    </div>

                    <div>

                        <ZTable data={tableIndexesQuery?.data?.data?.data} columns={indexesMemo}
                                getSelectedRows={it => handleIndexSelected(it)} canSelect={true}/>
                    </div>
                </div>
            </div>


            <div>
                <div className={"text-base font-bold"}>关系图</div>
            </div>
        </div>
    )
}


const EditIndexDialog = ({
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


const EditColumnDialog = ({
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

    return <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>新增</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            submitForm(data)
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"字段名称"}/>
                <FormInputText name={"type"} control={control} label={"类型"}/>
                <FormInputText name={"note"} control={control} label={"备注"}/>
                <FormInputText name={"defaultValue"} control={control} label={"默认值"}/>
                <FormCheckBox name={"isPrimaryKey"} control={control} label={"主键"}/>
                <FormCheckBox name={"isNull"} control={control} label={"可空"}/>
                <FormCheckBox name={"isAutoIncrement"} control={control} label={"自增"}/>
                <FormCheckBox name={"isUniqueKey"} control={control} label={"唯一"}/>
                <Box sx={{display: "flex", flexDirection: "row", gap: "2", alignItems: "center"}}>
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
                <Button onClick={closeDialog}>取消</Button>
                <Button type={"submit"} onClick={closeDialog}>确定</Button>
            </DialogActions>
        </form>
    </Dialog>
}


const EditTableDialog = ({value, open, closeDialog, submitForm}) => {


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

const indexHeader = [
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
        accessorKey: "columns",
        header: () => <div>字段</div>,
        cell: (info) => info.getValue(),
    }, {
        accessorKey: "note",
        header: () => <div>备注</div>,
        cell: (info) => info.getValue(),
    },
]


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
        accessorKey: "columnRelationShip",
        header: () => <div>关联关系</div>,
        cell: info => {

            const navigate = useNavigate()
            const [project, setProject] = useAtom(activeProjectAtom)
            const [activeTable, setActiveTable] = useAtom(activeTableAtom)

            return <div>
                {!!info.getValue() && !!info.getValue().leftColumns && info.getValue().leftColumns.map(it =>
                    (<div onClick={() => {
                        setActiveTable(
                            it.rightTableId
                        )
                    }}>
                        -- {it.rightTableName}.{it.rightColumnName}
                    </div>))}
                {!!info.getValue() && !!info.getValue().rightColumns && info.getValue().rightColumns.map(it => (
                    <div onClick={() => {
                        setActiveTable(
                            it.leftTableId
                        )
                    }}>
                        -- {it.leftTableName}.{it.leftColumnName}</div>))}
            </div>
        }
    },
    {
        accessorKey: "comment",
        header: () => <div>注释</div>,
        cell: (info) => info.getValue(),
    },
]



export default DBDoc
