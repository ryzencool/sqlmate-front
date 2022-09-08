import React, {useEffect, useMemo, useState} from 'react'
import {activeTableAtom, projectTableDetailsAtom, projectTableRelationsAtom} from "../../store/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    addColumn,
    addIndex,
    deleteColumns,
    deleteIndex,
    deleteTable,
    updateColumn,
    updateIndex,
    updateTable
} from "../../api/dbApi";
import * as _ from 'lodash'
import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import ZTable, {IndeterminateCheckbox} from "../../components/table/ZTable";
import {
    useGetProjectDetail,
    useGetTable,
    useListColumn,
    useListIndex,
    useListTableDetail,
    useListTableRel
} from "../../store/rq/reactQueryStore";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import {useAtom} from "jotai";
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import AlertDialog from "../../components/dialog/AlertDialog";
import {useFieldArray, useForm} from "react-hook-form";
import toast from "react-hot-toast";
import FormInputText from "../../components/form/FormInputText";
import FormCheckBox from "../../components/form/FormCheckBox";
import FormSelect from "../../components/form/FormSelect";
import Box from "@mui/material/Box";
import FormTableAndColumnSelectBox from "../../components/form/FormTableAndColumnSelectBox";
import {useNavigate} from "react-router";
import {activeProjectAtom} from "../../store/projectStore";
import FormFaker from "../../components/form/FormFaker";
import DeleteIcon from '@mui/icons-material/Delete';

function DBDoc() {
    const queryClient = useQueryClient()
    const [tableDetails, setTableDetails] = useAtom(projectTableDetailsAtom)
    const [tableRelations, setTableRelations] = useAtom(projectTableRelationsAtom)
    // state
    const [activeTableId, setActiveTableId] = useAtom(activeTableAtom)
    const [activeProject] = useAtom(activeProjectAtom)
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
    const [deleteTableOpen, setDeleteTableOpen] = useState(false)

    // memo
    const indexesMemo = useMemo(() => indexHeader, [])
    const columnsMemo = useMemo(() => columnHeader, [])

    // query
    const tableQuery = useGetTable({tableId: activeTableId}, {
        enabled: !!activeTableId
    })
    const tableIndexesQuery = useListIndex({tableId: activeTableId}, {
        enabled: !!activeTableId
    })
    const projectQuery = useGetProjectDetail({projectId: activeProject.id})

    const tableColumnsQuery = useListColumn({tableId: activeTableId}, {
        enabled: !!activeTableId
    })

    useListTableDetail({projectId: activeProject.id}, {
        enabled: !!activeProject.id,
        onSuccess: res => {
            setTableDetails(res.data.data)
        }
    });

    useListTableRel({projectId: activeProject.id}, {
        enabled: !!activeProject.id,

        onSuccess: res => {
            setTableRelations(res.data.data)
        }
    })


    // mutation
    const columnAddMutation = useMutation(addColumn, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tableColumns"])
            queryClient.invalidateQueries(["projectTablesDetail"])
        }
    })
    const columnsDeleteMutation = useMutation(deleteColumns, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tableColumns"])
            queryClient.invalidateQueries(["projectTablesDetail"])
        }
    })
    const columnUpdateMutation = useMutation(updateColumn, {
        onSuccess: () => {
            queryClient.invalidateQueries(['tableColumns'])
            queryClient.invalidateQueries(["projectTablesDetail"])

        }
    })
    const tableUpdateMutation = useMutation(updateTable, {
        onSuccess: () => {
            queryClient.invalidateQueries(['table'])
            queryClient.invalidateQueries(['projectTables'])
            queryClient.invalidateQueries(["projectTablesDetail"])

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


    const tableDeleteMutation = useMutation(deleteTable, {
        onSuccess: () => {
            queryClient.invalidateQueries(["table"])
        }
    })



    const handleColumnSelected = (params) => {
        setColumnsSelectedState(_.keys(params))
    }

    const handleIndexSelected = (params) => {
        setIndexesSelectedState(_.keys(params))
    }

    const handleDeleteTableOpen = () => {
        setDeleteTableOpen(true)
    }

    const handleDeleteTable = () => {
        tableDeleteMutation.mutate({
            tableId: activeTableId
        }, {
            onSuccess: res => {
                setActiveTableId(0)
            }
        })
    }

    if (tableQuery.isLoading || tableIndexesQuery.isLoading || projectQuery.isLoading || tableColumnsQuery.isLoading) {
        return <div>加载中</div>
    }
    return (
        <div className={"flex flex-col gap-5  "}>
            <div className={"flex-col flex gap-20"}>
                <div className={"flex flex-row gap-6"}>
                    <div className={'flex flex-row gap-2'}>
                        <TableViewOutlinedIcon/>
                        <div className={"text-base font-bold"}>
                            {tableQuery.data?.data.data.name}
                        </div>
                    </div>
                    <div className={'flex flex-row gap-2'}>
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
                                    tableId: activeTableId
                                })
                            }}/>

                        <div onClick={handleDeleteTableOpen}>
                            <DeleteIcon/>
                        </div>
                        <AlertDialog open={deleteTableOpen}
                                     handleClose={() => setDeleteTableOpen(false)}
                                     title={"删除"}
                                     confirm={handleDeleteTable}
                                     msg={"确认删除当前数据表"}/>
                    </div>

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
                            mode={1}
                            closeDialog={() => {
                                setColumnAddOpen(false)
                            }}
                            open={columnAddOpen}
                            submitForm={(data, reset) => {
                                columnAddMutation.mutate({
                                    ...data,
                                    tableId: activeTableId
                                }, {
                                    onSuccess: () => {
                                        reset()
                                    }
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
                            mode={2}
                            value={tableColumnsQuery.data.data.data.filter(it => it.id.toString() === columnsSelectedState[0])[0]}
                            closeDialog={() => setColumnEditOpen(false)}
                            open={columnEditOpen}
                            submitForm={(data, reset) => {
                                columnUpdateMutation.mutate({
                                    ...data,
                                    id: columnsSelectedState[0]
                                }, {
                                    onSuccess: () => {
                                        reset()
                                    }
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
                                indexAddMutation.mutate({...data, tableId: activeTableId})
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
                                    tableId: activeTableId,
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


            {/*<div>*/}
            {/*    <div className={"text-base font-bold"}>关系图</div>*/}
            {/*</div>*/}
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
                {info.row.original.isNotNull && <Chip size={"small"} label={"not null"}/>}
                {info.row.original.isUniqueKey && <Chip size={"small"} label={"unique"}/>}
            </div>)
        },

    },
    {
        accessorKey: "defaultValue",
        header: () => <div>默认值</div>,
        cell: (info) => info.getValue(),
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
