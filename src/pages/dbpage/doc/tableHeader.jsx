import {IndeterminateCheckbox} from "../../../components/table/ZTable";
import {Chip} from "@mui/material";
import {useNavigate} from "react-router";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {activeTableAtom} from "../../../store/jt/tableListStore";
import React from 'react'

export const indexHeader = [
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


export const columnHeader = [
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
