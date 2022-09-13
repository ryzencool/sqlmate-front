import React from 'react'
import DBTablePanel from "./dbpage/panel/DBTablePanel";
import {useParams} from "react-router-dom";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/jt/projectStore";
import {useGetProject} from "../store/rq/reactQueryStore";
import {Outlet} from "react-router";


export default function DBMain() {

    // projectId
    const {id: projectId} = useParams()

    const [project, setProject] = useAtom(activeProjectAtom)

    useGetProject({id: projectId}, {
        enabled: !!projectId,
        onSuccess: res => {
            setProject(res.data.data)
        }
    })

    return (
        <div className="grid grid-cols-[280px_1fr] h-full">
            <DBTablePanel projectId={projectId}/>
            <Outlet projectId={projectId}/>
        </div>
    )
}
