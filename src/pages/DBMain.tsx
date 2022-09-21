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
            {/* @ts-expect-error TS(2322) FIXME: Type '{ projectId: string; }' is not assignable to... Remove this comment to see the full error message */}
            <Outlet projectId={projectId}/>
        </div>
    )
}
