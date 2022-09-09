import React from 'react'
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import DBDmlDetail from "../DBMysqlDetail";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}



export default function DBDml() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return <div >

        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="mysql" {...a11yProps(0)} />
                <Tab label="postgres" {...a11yProps(1)} />
                <Tab label="sql server" {...a11yProps(2)} />

            </Tabs>
            <TabPanel value={value} index={0} className={"w-full"}>
                <DBDmlDetail dbType={"mysql"} />
            </TabPanel>
            <TabPanel value={value} index={1} className={"w-full"}>
                <DBDmlDetail dbType={"postgres"} />
            </TabPanel>
            <TabPanel value={value} index={2} className={"w-full"}>
                <DBDmlDetail dbType={"mssql"} />
            </TabPanel>
        </Box>

    </div>
}
