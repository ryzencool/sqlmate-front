import React from 'react'
import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import './style.css'



let dataTypeOptions = [
    {value: 'integer', label: 'int', color: '#FF5630', defaultValue: [0]},
    {value: 'float', label: 'float', color: '#FFC400', defaultValue: [0]},
    {value: 'double', label: 'double', color: '#36B37E', defaultValue: [0]},
    {value: 'varchar', label: 'varchar', color: '#253858', defaultValue: [0]},
    {value: 'text', label: 'text', color: '#666666', defaultValue: [0]},
    {value: 'blob', label: 'blob', color: '#666666', defaultValue: [0]},
    {value: 'datetime', label: 'datetime', color: '#666666', defaultValue: [0]},
    {value: 'timestamp', label: 'timestamp', color: '#666666', defaultValue: [0]},
    {value: 'tinyint', label: 'tinyint', color: '#00B8D9', defaultValue: [0]},
    {value: 'smallint', label: 'smallint', color: '#0052CC', defaultValue: [0]},
    {value: 'mediumint', label: 'mediumint', color: '#5243AA', defaultValue: [0]},
    {value: 'bigint', label: 'bigint', color: '#FF8B00', defaultValue: [0]},
    {value: 'decimal', label: 'decimal', color: '#00875A', defaultValue: [0]},
    {value: 'char', label: 'char', color: '#253858', defaultValue: [0]},
    {value: 'tinyblob', label: 'tinyblob', color: '#666666', defaultValue: [0]},
    {value: 'tinytext', label: 'tinytext', color: '#666666', defaultValue: [0]},
    {value: 'mediumblob', label: 'mediumblob', color: '#666666', defaultValue: [0]},
    {value: 'mediumtext', label: 'mediumtext', color: '#666666', defaultValue: [0]},
    {value: 'longblob', label: 'longblob', color: '#666666', defaultValue: [0]},
    {value: 'longtext', label: 'longtext', color: '#666666', defaultValue: [0]},
    {value: 'date', label: 'date', color: '#666666', defaultValue: [0]},
    {value: 'time', label: 'time', color: '#666666', defaultValue: [0]},
    {value: 'year', label: 'year', color: '#666666', defaultValue: [0]},
];






export default function ZEditableTable({columns, data, setData, setLastRowData, defaultColumn}) {


    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                console.log("更新护具", rowIndex, columnId, value)
                if (rowIndex !== data.length - 1) {
                    setData((old) => {
                            return old.map((row, index) => {
                                if (index === rowIndex) {
                                    return {
                                        ...old[rowIndex],
                                        ...value
                                    };
                                }
                                return row;
                            })
                        }
                    );
                } else {
                    setLastRowData({
                        ...data[data.length - 1],
                        ...value
                    })
                }
            }
        },
        debugTable: true
    });


    return <div>
        <div className={'overflow-x-auto'}>
            <table className={'table w-full table-compact'}>
                <thead>
                {table.getHeaderGroups()
                    .map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => {
                    console.log("便便琪琪", row)
                    return (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                                return (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}

                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

    </div>

}
