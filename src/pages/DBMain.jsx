import React, {useEffect} from 'react'
import DBTablePanel from "./dbpage/DBTablePanel";
import DBContent from "./dbpage/DBContent";
import {useParams} from "react-router-dom";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/projectStore";
import {listTableRel, listTablesDetail} from "../api/dbApi";
import {tableListDetailAtom, tableRelsAtom} from "../store/tableListStore";
import {useGetProject} from "../store/rq/reactQueryStore";


export default function DBMain() {

    // projectId
    const {id} = useParams()

    const [project, setProject] = useAtom(activeProjectAtom)

    const [tableList, setTableList] = useAtom(tableListDetailAtom)

    const [tableRels, setTableRels] = useAtom(tableRelsAtom)

    useGetProject({id: id}, {
        enabled: !!id,
        onSuccess: res => {
            setProject(res.data.data)
        }
    })

    return (
        <div className="grid grid-cols-[280px_1fr] h-full">
            <DBTablePanel projectId={id}/>

            <DBContent projectId={id}/>
        </div>
    )
}
