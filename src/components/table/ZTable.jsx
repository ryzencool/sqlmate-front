import React, {useEffect} from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";

export default function ZTable({data, columns, getSelectedRows, canSelect}) {


    const [rowSelection, setRowSelection] = React.useState({});

    if (canSelect) {
        useEffect(() => {
            getSelectedRows(rowSelection)
        }, [rowSelection])

    }

    const getRowId = (row, relativeIndex, parent) => {
        return row.id;
    };

    const table = useReactTable({
        data: data,
        columns: columns,
        getRowId,
        state: {
            rowSelection
        },
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true
    })


    return (
        <div>
            <table className={"w-full mt-2"}>
                <thead>
                {table.getHeaderGroups().map(group => (
                    <tr key={group.id} className={"border-b-2 border-neutral-100 "}>
                        {group.headers.map(header => (
                            <th key={header.id} className={"text-left p-2 text-sm font-normal font-bold"}>
                                {header.isPlaceholder ? null : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => {
                    return <tr key={row.id} className={"border-b-2 border-neutral-100 text-sm"}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className={"text-left p-2 "}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                })}

                </tbody>
            </table>
        </div>
    )

}


export function IndeterminateCheckbox({
                                          indeterminate = false,
                                          className = "",
                                          ...rest
                                      }) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + " cursor-pointer"}
            {...rest}
        />
    );
}
