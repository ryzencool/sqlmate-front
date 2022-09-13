import React, {useEffect, useState} from 'react'
import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import DBDoc from "./doc/DBDoc";
import DBErd from "./er/DBErd";
import DBTerminal from "./terminal/DBTerminal";
import DBData from "./data/DBData";
import DBDml from "./dml/DBDml";
import DBSql from "./sql/DBSql";
import DBCode from "./code/DBCode";
import {activeTableAtom} from "../../store/jt/tableListStore";
import DBSnapshot from "./snap/DBSnapshot";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/jt/projectStore";
import {useGetProject} from "../../store/rq/reactQueryStore";
import {a11yProps, ZTabPanel} from "../../components/tab/ZTabPanel";
import DBProjectInterface from "./project/DBProjectInterface";
import DBTableTab from "./table/DBTable";


function DBContent({projectId}) {

    const [activeTable] = useAtom(activeTableAtom)

    const [project, setProject] = useAtom(activeProjectAtom)


    useGetProject({
        id: projectId
    }, {
        enabled: !!projectId,
        refetchOnWindowFocus : false,
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


