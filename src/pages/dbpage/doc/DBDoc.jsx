import React, {useMemo, useState} from 'react'
import {activeTableAtom, projectTableDetailsAtom, projectTableRelationsAtom} from "../../../store/jt/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addColumn, addIndex, deleteColumns, deleteIndex, updateColumn, updateIndex} from "../../../api/dbApi";
import * as _ from 'lodash'
import {Button} from "@mui/material";
import ZTable from "../../../components/table/ZTable";
import {
    useGetProjectDetail,
    useGetTable,
    useListColumn,
    useListIndex,
    useListTableDetail,
    useListTableRel
} from "../../../store/rq/reactQueryStore";
import {useAtom} from "jotai";
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import AlertDialog from "../../../components/dialog/AlertDialog";
import toast from "react-hot-toast";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {EditColumnDialog} from "./EditColumnDialog";
import {EditIndexDialog} from "./EditIndexDialog";
import {columnHeader, indexHeader, testHeader} from "./tableHeader";
import ZEditableTable from "../../../components/table/ZEditableTable";

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
    const [indexEditOpen, setIndexEditOpen] = useState(false)
    const [indexAddOpen, setIndexAddOpen] = useState(false)
    const [indexDeleteOpen, setIndexDeleteOpen] = useState(false)
    const [deleteColumnOpen, setDeleteColumnOpen] = useState(false)
    // memo
    const indexesMemo = useMemo(() => indexHeader, [])
    const columnsMemo = useMemo(() => columnHeader, [])
    const testMemo = useMemo(() => testHeader, [])
    const [testData, setTestData] = useState([])

    // query
    const tableQuery = useGetTable({tableId: activeTableId}, {
        enabled: !!activeTableId
    })
    const tableIndexesQuery = useListIndex({tableId: activeTableId}, {
        enabled: !!activeTableId
    })
    const projectQuery = useGetProjectDetail({projectId: activeProject.id})

    const tableColumnsQuery = useListColumn({tableId: activeTableId}, {
        enabled: !!activeTableId,
        onSuccess: res => {
            console.log("行数据", res.data.data)
            setTestData(res.data.data)
        }
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

    const indexAddMutation = useMutation(addIndex, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tableIndexes"])

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

    const closeDeleteIndexDialog = () => {
        setIndexDeleteOpen(false);
    }

    const confirmDeleteIndex = () => {
        indexDeleteMutation.mutate({
            indexesId: indexesSelectedState
        }, {
            onSuccess: res => {
                setIndexDeleteOpen(false)
            }
        })
    }

    const openDeleteIndexDialog = () => {
        setIndexDeleteOpen(true);
    }


    if (tableQuery.isLoading ||
        tableIndexesQuery.isLoading ||
        projectQuery.isLoading ||
        tableColumnsQuery.isLoading) {
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
                    {/*<div className={"flex flex-row items-center gap-2"}>*/}
                    {/*    <Button size={"small"} variant={"contained"} onClick={() => {*/}
                    {/*        setColumnAddOpen(true)*/}
                    {/*    }}>*/}
                    {/*        新增*/}
                    {/*    </Button>*/}
                    {/*    <EditColumnDialog*/}
                    {/*        mode={1}*/}
                    {/*        closeDialog={() => {*/}
                    {/*            setColumnAddOpen(false)*/}
                    {/*        }}*/}
                    {/*        open={columnAddOpen}*/}
                    {/*        submitForm={(data, reset) => {*/}
                    {/*            columnAddMutation.mutate({*/}
                    {/*                ...data,*/}
                    {/*                tableId: activeTableId*/}
                    {/*            }, {*/}
                    {/*                onSuccess: () => {*/}
                    {/*                    reset()*/}
                    {/*                }*/}
                    {/*            })*/}
                    {/*        }}/>*/}
                    {/*    <Button size={"small"} variant={"contained"} onClick={() => {*/}
                    {/*        terminal.log("选择的记录", columnsSelectedState)*/}

                    {/*        if (columnsSelectedState.length === 0) {*/}
                    {/*            toast.error("请至少选择一条记录", {position: 'top-center'})*/}
                    {/*            return;*/}
                    {/*        } else if (columnsSelectedState.length > 1) {*/}
                    {/*            toast.error("同时只能编辑一条记录", {position: 'top-center'})*/}
                    {/*            return;*/}
                    {/*        }*/}
                    {/*        setColumnEditOpen(true)*/}

                    {/*    }}>*/}
                    {/*        编辑*/}
                    {/*    </Button>*/}
                    {/*    <EditColumnDialog*/}
                    {/*        mode={2}*/}
                    {/*        value={tableColumnsQuery.data.data.data.filter(it => it.id.toString() === columnsSelectedState[0])[0]}*/}
                    {/*        closeDialog={() => setColumnEditOpen(false)}*/}
                    {/*        open={columnEditOpen}*/}
                    {/*        submitForm={(data, reset) => {*/}
                    {/*            columnUpdateMutation.mutate({*/}
                    {/*                ...data,*/}
                    {/*                id: columnsSelectedState[0]*/}
                    {/*            }, {*/}
                    {/*                onSuccess: () => {*/}
                    {/*                    reset()*/}
                    {/*                }*/}
                    {/*            })*/}
                    {/*        }}/>*/}
                    {/*    <Button size={"small"} variant={"contained"} onClick={() => {*/}
                    {/*        setDeleteColumnOpen(true)*/}
                    {/*    }}>*/}
                    {/*        删除*/}
                    {/*    </Button>*/}
                    {/*    <AlertDialog open={deleteColumnOpen} handleClose={() => setDeleteColumnOpen(false)}*/}
                    {/*                 title={"是否确认删除当前选中的行？"}*/}
                    {/*                 msg={""}*/}
                    {/*                 confirm={() => {*/}
                    {/*                     columnsDeleteMutation.mutate({*/}
                    {/*                         columnIds: columnsSelectedState*/}
                    {/*                     })*/}
                    {/*                     setDeleteColumnOpen(false)*/}
                    {/*                 }}/>*/}
                    {/*</div>*/}
                    <div>
                        {/*<ZTable data={tableColumnsQuery.data.data.data} columns={columnsMemo}*/}
                        {/*        getSelectedRows={it => handleColumnSelected(it)} canSelect={true}/>*/}

                        <ZEditableTable
                            data={[...testData, {tableId: activeTableId, name: "", note: ""}]}
                            columns={testMemo}
                            setData={(res) => {
                            // terminal.log("结果是", res)
                            setTestData(res)
                        }}/>

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
                                onClick={openDeleteIndexDialog}>删除</Button>
                        <AlertDialog open={indexDeleteOpen}
                                     handleClose={closeDeleteIndexDialog}
                                     title={"确认删除当前选中的索引吗"}
                                     confirm={confirmDeleteIndex}/>
                    </div>

                    <div>
                        <ZTable data={tableIndexesQuery?.data?.data?.data} columns={indexesMemo}
                                getSelectedRows={it => handleIndexSelected(it)} canSelect={true}/>

                    </div>
                </div>
            </div>

        </div>
    )
}


export default DBDoc
