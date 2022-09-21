import Button from "@mui/material/Button";
import React, {useRef} from 'react'
import {Menu, MenuItem} from "@mui/material";
import {exporter, importer} from "@dbml/core";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/jt/projectStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {importProjectDbml, syncDatabase} from "../../api/dbApi";
import {activeDbTypeAtom} from "../../store/jt/databaseStore";
import {useListTablesDetail, useProjectDBML} from "../../store/rq/reactQueryStore";
import {dbAtom} from "../../store/jt/sqlStore";
import toast from "react-hot-toast";
import TerminalIcon from '@mui/icons-material/Terminal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from "@mui/material/Box";
export default function ActionMenu() {

    const [project] = useAtom(activeProjectAtom)
    const [activeDbType] = useAtom(activeDbTypeAtom);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const fileInput = useRef()
    const showFile = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            console.log(text.toString())
            let dbType;
            if (activeDbType === 1) {
                dbType = 'mysql'
            } else if (activeDbType === 2){
                dbType = 'postgres'
            } else if (activeDbType === 3) {
                dbType ='mssql'
            }

            let dbml = importer.import(text.toString(), dbType)
            console.log(dbml)
            let sqlJson = exporter.export(dbml, 'json');
            console.log(sqlJson)
            importDbmlMutation.mutate({
                // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type '{}'.
                projectId: project.id,
                dbmlJson: sqlJson
            })
        };
        reader.readAsText(e.target.files[0]);
        handleClose()
    };

    const selectFile = () => {
        // @ts-expect-error TS(2532) FIXME: Object is possibly 'undefined'.
        fileInput.current.click()
    }

    const queryClient = useQueryClient()
    const importDbmlMutation = useMutation(importProjectDbml, {
        onSuccess: () => {
            queryClient.invalidateQueries(['projectTables'])
        }
    })

    // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type '{}'.
    const dbmlProjectQuery = useProjectDBML({projectId: project.id}, {
        enabled: false
    })

    const handleExportSql = () => {
        dbmlProjectQuery.refetch().then(res => {
            let data = res.data.data.data
            // exporter.export(res.)
        })
    }

    return (
        <div>
            <Box
                className={'bg-slate-200 rounded-lg p-1'}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon/>
            </Box>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {
                    selectFile();
                    // handleClose();
                }}>导入SQL</MenuItem>
                <input type={'file'} style={{display: "none"}} ref={fileInput} onChange={showFile}/>

                <MenuItem onClick={handleExportSql}>导出SQL</MenuItem>
            </Menu>


        </div>
    );
}
