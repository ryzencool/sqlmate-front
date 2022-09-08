import React, {useEffect, useState} from 'react'
import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import DBDoc from "./DBDoc";
import DBEr from "./DBEr";
import DBConsole from "./DBConsole";
import DBData from "./DBData";
import DBDml from "./DBDml";
import DBSql from "./DBSql";
import DBCode from "./DBCode";
import {activeTableAtom} from "../../store/tableListStore";
import DBSnapshot from "./DBSnapshot";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/projectStore";
import {useGetProject} from "../../store/rq/reactQueryStore";
import {a11yProps, ZTabPanel} from "../../components/tab/ZTabPanel";
import DBProjectInterface from "./DBProjectInterface";


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


function DBTableTab() {
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (<React.Fragment>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs size={"small"} value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="文档" {...a11yProps(0)} />
                <Tab label="ER图" {...a11yProps(1)} />
                <Tab label="控制台" {...a11yProps(2)} />
                <Tab label="数据" {...a11yProps(3)} />
                <Tab label="DML" {...a11yProps(4)} />
                <Tab label="代码" {...a11yProps(5)} />
                <Tab label="快照" {...a11yProps(6)} />
                <Tab label="SQL库" {...a11yProps(7)} />
            </Tabs>
        </Box>
        <Box className={"h-[calc(100vh-9rem)] overflow-auto"}>
            <ZTabPanel value={value} index={0}>
                <DBDoc/>
            </ZTabPanel>
            <ZTabPanel value={value} index={1}>
                <DBEr/>
            </ZTabPanel>
            <ZTabPanel value={value} index={2}>
                <DBConsole/>
            </ZTabPanel>
            <ZTabPanel value={value} index={3}>
                <DBData/>
            </ZTabPanel>
            <ZTabPanel value={value} index={4}>
                <DBDml/>
            </ZTabPanel>
            <ZTabPanel value={value} index={5}>
                <DBCode/>
            </ZTabPanel>
            <ZTabPanel value={value} index={6}>
                <DBSnapshot/>
            </ZTabPanel>
            <ZTabPanel value={value} index={7}>
                <DBSql/>
            </ZTabPanel>
        </Box>
    </React.Fragment>)

}
