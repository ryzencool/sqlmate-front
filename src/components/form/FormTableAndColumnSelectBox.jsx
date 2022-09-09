import React, {useEffect, useState} from 'react'
import {useListColumn, useListTables} from "../../store/rq/reactQueryStore";
import FormSelect from "./FormSelect";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/jt/projectStore";


export default function FormTableAndColumnSelectBox({nameTable, nameColumn, control, watch, index}) {

    const [project] = useAtom(activeProjectAtom)

    console.log("当前的项目", project)

    const listTable = useListTables({projectId: project.id}, {
        enabled: !!project.id
    })


    const [search, setSearch] = useState()

    useListColumn(search, {
        enabled: !!search,
        onSuccess: (data) => {
            setColumnData(data.data.data.map(it => (
                {
                    key: it.id,
                    value: it.name
                }
            )))
        }
    })

    const [columnData, setColumnData] = useState([])

    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (listTable.status === 'success') {
            setTableData(listTable.data.data.data.map(it => ({
                key: it.id,
                value: it.name
            })))
        }
    }, [])

    React.useEffect(() => {
        const subscription = watch((value) => {

            setSearch(
                {tableId: value.relationShip[index].tableId})
        });
        return () => subscription.unsubscribe();
    }, [watch]);


    return <>
        <FormSelect name={nameTable} label={"关联表"} control={control}
                    choices={tableData}/>
        <FormSelect name={nameColumn} label={"关联字段"} control={control}
                    choices={columnData}/>
    </>

}
