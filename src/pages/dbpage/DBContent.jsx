import React, {useEffect} from 'react'
import Box from "@mui/material/Box";
import {activeTableAtom} from "../../store/jt/tableListStore";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/jt/projectStore";
import {useGetProject} from "../../store/rq/reactQueryStore";
import DBProjectInterface from "./project/DBProjectInterface";
import DBTableTab from "./table/DBTable";


function DBContent({projectId}) {

    const [activeTable] = useAtom(activeTableAtom)

    const [project, setProject] = useAtom(activeProjectAtom)


    useGetProject({
        id: projectId
    }, {
        enabled: !!projectId,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            setProject(res.data.data)
        }
    })

    useEffect(() => {
        setProject({id: projectId})
    }, [])


    console.log(activeTable)
    return (
        <Box sx={{width: '100%'}} className={"h-full"}>
            {
                activeTable === 0 ? <DBProjectInterface projectId={projectId}/> : <DBTableTab projectId={projectId}/>
            }
        </Box>
    )
}

export default DBContent


