import React, {useState} from "react";
import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import {a11yProps, ZTabPanel} from "../../../components/tab/ZTabPanel";
import DBDoc from "../doc/DBDoc";
import DBData from "../data/DBData";
import DBDml from "../dml/DBDml";
import DBCode from "../code/DBCode";

export default  function DBTableTab() {
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (<div>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            {/* @ts-expect-error TS(2769) FIXME: No overload matches this call. */}
            <Tabs size={"small"} value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="文档"  {...a11yProps(0)} />
                <Tab label="数据" {...a11yProps(1)} />
                <Tab label="DML" {...a11yProps(2)} />
                <Tab label="代码" {...a11yProps(3)} />
            </Tabs>
        </Box>
        <Box className={"h-[calc(100vh-9rem)] overflow-auto"}>
            <ZTabPanel value={value} index={0}>
                <DBDoc/>
            </ZTabPanel>
            <ZTabPanel value={value} index={1}>
                <DBData/>
            </ZTabPanel>
            <ZTabPanel value={value} index={2}>
                <DBDml/>
            </ZTabPanel>
            <ZTabPanel value={value} index={3}>
                <DBCode/>
            </ZTabPanel>
        </Box>
    </div>)

}
