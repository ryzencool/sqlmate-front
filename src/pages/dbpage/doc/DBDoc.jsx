import React, {useMemo, useState} from 'react'
import {activeTableAtom, projectTableDetailsAtom, projectTableRelationsAtom} from "../../../store/jt/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addIndex, deleteIndex, updateIndex} from "../../../api/dbApi";
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
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {columnHeader, indexHeader} from "./tableHeader";
import ZEditableTable from "../../../components/table/ZEditableTable";
import {columnDefaultColumn, indexDefaultColumn} from "../../../components/table/editableTableCell";

function DBDoc() {
    const queryClient = useQueryClient()
    const [tableDetails, setTableDetails] = useAtom(projectTableDetailsAtom)
    const [tableRelations, setTableRelations] = useAtom(projectTableRelationsAtom)
    // state
    const [activeTableId, setActiveTableId] = useAtom(activeTableAtom)
    const [activeProject] = useAtom(activeProjectAtom)
    const [columnsSelectedState, setColumnsSelectedState] = useState([])
    const [indexesSelectedState, setIndexesSelectedState] = useState([])
    const [addEmptyRow, setAddEmptyRow] = useState([])
    const [addIndexEmptyRow, setAddIndexEmptyRow] = useState([])
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
    const [columnData, setColumnData] = useState([])
    const [indexData, setIndexData] = useState([])

    // query
    const tableQuery = useGetTable({tableId: activeTableId}, {
        enabled: !!activeTableId
    })
    const tableIndexesQuery = useListIndex({tableId: activeTableId}, {
        enabled: !!activeTableId,
        onSuccess: res => {
            setIndexData(res.data.data)
        }
    })
    const projectQuery = useGetProjectDetail({projectId: activeProject.id})

    const tableColumnsQuery = useListColumn({tableId: activeTableId}, {
        enabled: !!activeTableId,
        onSuccess: res => {
            setColumnData(res.data.data)
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
                    <div>
                        <ZEditableTable
                            data={[...columnData,
                                {...addEmptyRow, tableId: activeTableId}]}
                            columns={columnsMemo}
                            defaultColumn={columnDefaultColumn}
                            setLastRowData={setAddEmptyRow}
                            setData={(res) => {
                                setColumnData(res)
                            }}/>

                    </div>
                </div>

            </div>

            <div>
                <div className={"text-base font-bold"}>索引</div>
                <div className={'mt-3'}>

                    <ZEditableTable data={[...indexData, {...addIndexEmptyRow, tableId: activeTableId}]}
                                    columns={indexesMemo}
                                    defaultColumn={indexDefaultColumn}
                                    setData={(data) => {
                                        setIndexData(data)
                                    }}
                                    setLastRowData={setAddIndexEmptyRow}/>
                </div>
            </div>

        </div>
    )
}


export default DBDoc
