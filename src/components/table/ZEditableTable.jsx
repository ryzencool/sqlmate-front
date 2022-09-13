import React from 'react'
import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import CreatableSelect from "react-select/creatable";
import './style.css'
import DeleteIcon from '@mui/icons-material/Delete';
import Select from "react-select";
import {addColumn, delColumn, updateColumn} from "../../api/dbApi";
import {useMutation, useQueryClient} from "@tanstack/react-query";


const settingsOptions = [
    {value: 'isPrimaryKey', label: 'pk', color: '#FF5630'},
    {value: 'isNotNull', label: 'nn', color: '#FFC400'},
    {value: 'isUniqueKey', label: 'uk', color: '#36B37E'},
    {value: 'isAutoIncrement', label: 'inc', color: '#253858'},
]

export const dataTypeOptions = [
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


export default function ZEditableTable({columns, data, setData}) {
    console.log("开源省事", data)

    const defaultColumn = {
        cell: ({getValue, row: {index}, column: {id}, table}) => {

            const initialValue = getValue();
            // We need to keep and update the state of the cell normally
            const [value, setValue] = React.useState(initialValue);

            // When the input is blurred, we'll call our table meta's updateData function
            const onBlur = () => {

                table.options.meta?.updateData(index, id, value);
            };

            const onBlurType = () => {

                table.options.meta?.updateData(index, id, value.value);
            };

            // const onBlurSettings = () => {
            //     table.options.meta?.updateData(index, )
            // }


            // If the initialValue is changed external, sync it up with our state
            React.useEffect(() => {
                console.log("初始数据", initialValue)
                setValue(initialValue);
            }, [initialValue]);

            let rowData = table.getRow(index).original
            let isDisabled = (rowData.name === null
                || rowData.name === undefined
                || rowData.name === '') && id !== 'name'
            if (id === "type") {
                console.log(value)
                let displayValue
                if (!!value) {
                    displayValue = dataTypeOptions.find(it => it.value === value)
                } else {
                    displayValue = {}
                }


                return (
                    <CreatableSelect className={'outline-none focus:outline-none p-0'}
                                     value={displayValue}
                                     onChange={(newValue, mt) => {
                                         setValue(newValue)
                                     }}
                                     isDisabled={isDisabled}
                                     onBlur={onBlurType}

                                     onInputChange={(inputValue, am) => {

                                         console.log("inputValue", inputValue)
                                     }}

                                     options={dataTypeOptions}
                                     classNamePrefix={"react-select"}
                                     placeholder={"选择类型"}
                    />
                )
            }

            if (id === "settings") {
                return (
                    <Select className={'outline-none focus:outline-none'}
                            value={settingsOptions.filter(it => {
                                return rowData[it.value]
                            })}
                            onChange={(newValue, mt) => {
                                let settings = settingsOptions.map(it => ({
                                    [it.value]: newValue.map(itt => itt.value).includes(it.value)
                                })).reduce((a, b) => Object.assign(a, b), {});
                                columnUpdateMutation.mutate({
                                    ...rowData,
                                    ...settings,
                                }, {
                                    onSuccess: res => {
                                        setValue(settings)
                                    }
                                })
                            }}
                            isDisabled={isDisabled}
                            isMulti
                            options={settingsOptions}
                            classNamePrefix={"react-select"}
                            placeholder={"选择配置"}
                    />
                )
            }

            if (id === "defaultValue") {
                if (!!rowData.type && rowData.isNotNull) {
                    return (
                        <CreatableSelect className={'outline-none focus:outline-none w-32'}
                                         onChange={(newValue, mt) => {
                                             setValue(newValue)
                                         }}
                                         onBlur={onBlurType}
                                         onInputChange={(inputValue, am) => {

                                         }}
                                         isDisabled={isDisabled}
                                         options={dataTypeOptions.find(it => it.value === rowData.type)
                                             .defaultValue.map(it => ({
                                                 value: it,
                                                 label: it
                                             }))}
                                         classNamePrefix={"react-select"}
                                         placeholder={"选择默认值"}
                        />
                    )
                } else {
                    return <div></div>
                }
            }

            if (id === "action") {
                return <div className={'w-20'}>
                    <div onClick={() => {
                        columnDeleteMutation.mutate({
                            columnId: rowData.id
                        })
                    }
                    }>
                        <DeleteIcon/>
                    </div>
                </div>
            }


            return (
                <div className={`w-full h-full`}>
                <input
                    disabled={isDisabled}
                    style={{width: "100%"}}
                    className={`pl-2 h-full p-3`}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    placeholder={"输入..."}
                    onBlur={onBlur}
                />
                </div>
            );


        }
    };

    const queryClient = useQueryClient()
    const columnUpdateMutation = useMutation(updateColumn, {
        onSuccess: res => {
            queryClient.invalidateQueries(['tableColumns'])
        }
    })

    const columnInsertMutation = useMutation(addColumn, {
        onSuccess: res => {
            queryClient.invalidateQueries(['tableColumns'])
        }
    })

    const columnDeleteMutation = useMutation(delColumn, {
        onSuccess: res => {
            queryClient.invalidateQueries(['tableColumns'])
        }
    })

    console.log("咔咔咔咔", data)
    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),

        // autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                console.log("更新数据", rowIndex, columnId, value)
                if (rowIndex !== data.length - 1) {
                    // 更新操作
                    columnUpdateMutation.mutate({...data[rowIndex], [columnId]: value})
                } else {
                    if (columnId === 'name' && value.trim() === '') {
                        return;
                    }
                    columnInsertMutation.mutate({...data[rowIndex], [columnId]: value})
                }


                setData((old) => {
                        return old.map((row, index) => {
                            if (index === rowIndex) {
                                return {
                                    ...old[rowIndex],
                                    [columnId]: value
                                };
                            }
                            return row;
                        })
                    }
                );
            }
        },
        debugTable: true
    });


    return <div>
        <div className={'rounded-lg border-2'}>
            <table className={'w-full'}>
                <thead className={'font-bold text-sm text-left bg-sky-100'}>
                {table.getHeaderGroups()
                    .map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th className={'p-2 border-r-2'} key={header.id} colSpan={header.colSpan}>
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
                        <tr className={'border-t-2 mt-1 mb-1 text-sm '} key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                                return (
                                    <td className={`border-r-2 text-center `} key={cell.id}>
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
        {/*<div className={'w-full bg-sky-100 text-center mt-2 rounded-lg p-2'} onClick={() => {*/}
        {/*    setData([*/}
        {/*            ...data, {}*/}
        {/*        ]*/}
        {/*    )*/}
        {/*}*/}
        {/*}>添加*/}
        {/*</div>*/}
    </div>

}
