import {IndeterminateCheckbox} from "../../../components/table/ZTable";
import {Chip} from "@mui/material";
import {useNavigate} from "react-router";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {activeTableAtom} from "../../../store/jt/tableListStore";
import React from 'react'

export const columnHeader =
    [
        {
            accessorKey: "name",
            header: () => <div>名称</div>,
            footer: (props) => props.column.id
        },
        {
            accessorKey: "type",
            header: () => <div>类型</div>,
            footer: (props) => props.column.id
        },
        {
            accessorKey: "note",
            header: () => <div>备注</div>,
            footer: (props) => props.column.id
        },
        {
            accessorKey: "settings",
            header: () => <div>配置</div>,
            footer: (props) => props.column.id

        },
        {
            accessorKey: "defaultValue",
            header: () => <div>默认值</div>,
            footer: (props) => props.column.id

        },

        {
            accessorKey: "action",
            header: () => <div>操作</div>,
            footer: (props) => props.column.id

        },
    ];


export const indexHeader =
    [
        {
            accessorKey: "name",
            header: () => <div>名称</div>,
            footer: (props) => props.column.id
        },
        {
            accessorKey: "type",
            header: () => <div>类型</div>,
            footer: (props) => props.column.id
        },
        {
            accessorKey: "columns",
            header: () => <div>索引字段</div>,
            footer: (props) => props.column.id
        },
        {
            accessorKey: "action",
            header: () => <div>操作</div>,
            footer: (props) => props.column.id

        },
    ];
