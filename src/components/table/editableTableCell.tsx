import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addColumn, delColumn, updateColumn} from "../../api/dbApi";
import Select from "react-select";
import toast from "react-hot-toast";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import React from 'react'
const settingsOptions = [
    {value: 'isPrimaryKey', label: 'pk', color: '#FF5630'},
    {value: 'isNotNull', label: 'nn', color: '#FFC400'},
    {value: 'isUniqueKey', label: 'uk', color: '#36B37E'},
    {value: 'isAutoIncrement', label: 'inc', color: '#253858'},
]
export const columnDefaultColumn = {
    cell: ({getValue, row: {index}, column: {id}, table}) => {


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


        const initialValue = getValue();
        const [value, setValue] = React.useState(initialValue);


        const onChange = (newValue) => {
            table.options.meta?.updateData(index, id, newValue)
        }


        console.log("kakak传入数据", index, id, table.getRowModel().rows.length)

        React.useEffect(() => {
            console.log("初始数据", initialValue)
            setValue(initialValue);
        }, [initialValue]);

        let rowData = table.getRow(index).original

        console.log("行数据", rowData);

        let isDisabled = (rowData.name === null
            || rowData.name === undefined
            || rowData.name === '') && id !== 'name'
        if (isDisabled) {
            return <div className={'w-full h-full text-slate-300'}></div>
        }
        if (id === "settings") {
            return (
                <Select
                    value={settingsOptions.filter(it => {
                        return rowData[it.value]
                    })}
                    onChange={(newValue, mt) => {
                        let settings = settingsOptions.map(it => ({
                            [it.value]: newValue.map(itt => itt.value).includes(it.value)
                        })).reduce((a, b) => Object.assign(a, b), {});
                        onChange(settings)
                    }}
                    isDisabled={isDisabled}
                    isMulti
                    options={settingsOptions}
                    classNamePrefix={"react-select"}
                    placeholder={"选择配置"}
                />
            )
        }


        if (id === "action") {
            return <div className={'flex flex-row gap-3 p-2'}>
                <div onClick={() => {
                    console.log("更新", rowData)

                    if (index === table.getRowModel().rows.length - 1) {
                        columnInsertMutation.mutate({
                            ...rowData
                        }, {
                            onSuccess: data => {
                                // @ts-expect-error TS(2304) FIXME: Cannot find name 'setLastRowData'.
                                setLastRowData({})
                                toast.success("插入数据成功")
                            }
                        })
                    } else {

                        columnUpdateMutation.mutate({
                            ...rowData
                        }, {
                            onSuccess: res => {
                                toast.success("保存成功")
                            }
                        })
                    }
                }}>
                    <CheckIcon/>
                </div>
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
                        setValue(e.target.value)
                        onChange({[id]: e.target.value})
                    }}
                    placeholder={"输入..."}
                />
            </div>
        );


    }
};


export const indexDefaultColumn = {

    cell: ({getValue, row: {index}, column: {id}, table}) => {


        const initialValue = getValue();
        const [value, setValue] = React.useState(initialValue);


        const onChange = (newValue) => {
            table.options.meta?.updateData(index, id, newValue)
        }


        React.useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        let rowData = table.getRow(index).original


        let isDisabled = (rowData.name === null
            || rowData.name === undefined
            || rowData.name === '') && id !== 'name'
        if (isDisabled) {
            return <div className={'w-full h-full text-slate-300'}></div>
        }


        return (
            <div className={`w-full h-full`}>
                <input
                    disabled={isDisabled}
                    style={{width: "100%"}}
                    className={`pl-2 h-full p-3`}
                    value={value}
                    // onChange={(e) => {
                    //     setValue(e.target.value)
                    //     onChange({[id]: e.target.value})
                    // }}
                    placeholder={"输入..."}
                />
            </div>
        );


    }
}
