import React, {useEffect} from 'react'
import DBTablePanel from "../components/DBTablePanel";
import DBContent from "../components/DBContent";
import {useParams} from "react-router-dom";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/projectStore";
import {listTableRel, listTablesDetail} from "../api/dbApi";
import {tableListDetailAtom, tableRelsAtom} from "../store/tableListStore";


export default function Home() {

    const {id} = useParams()

    const [project, setProject] = useAtom(activeProjectAtom)

    const [tableList, setTableList] = useAtom(tableListDetailAtom)

    const [tableRels, setTableRels] = useAtom(tableRelsAtom)

    useEffect(() => {
        setProject({id: id})
        listTablesDetail({projectId: id}).then(r => {
            setTableList(r.data.data)
        })

        listTableRel({projectId: id}).then( r => {
            setTableRels(r.data.data)
            }
        )
    }, [])
    return (
        <div className="grid grid-cols-[280px_1fr] h-full">
            <DBTablePanel projectId={id}/>

            <DBContent projectId={id}/>
        </div>
    )
}
