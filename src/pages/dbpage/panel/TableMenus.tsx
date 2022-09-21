import {useAtom} from "jotai";
import {activeTableAtom} from "../../../store/jt/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTable, updateTable} from "../../../api/dbApi";
import React, {useState} from "react";
import {Menu, MenuItem} from "@mui/material";
import AlertDialog from "../../../components/dialog/AlertDialog";
import {EditTableDialog} from "./EditTableDialog";
import {useGetTable} from "../../../store/rq/reactQueryStore";

export function TableMenus({
                               tableId,
                               anchorEl,
                               open,
                               handleCloseMenu,
                           }) {

    const [activeTableId, setActiveTableId] = useAtom(activeTableAtom)

    const queryClient = useQueryClient();

    const {isLoading: tableIsLoading, data: tableData} = useGetTable({tableId: tableId}, {
        enabled: !!tableId
    })

    const tableDeleteMutation = useMutation(deleteTable, {
        onSuccess: () => {
            queryClient.invalidateQueries(["table"])
        }
    })

    const tableUpdateMutation = useMutation(updateTable, {
        onSuccess: () => {
            queryClient.invalidateQueries(['table'])
            queryClient.invalidateQueries(['projectTables'])
            queryClient.invalidateQueries(["projectTablesDetail"])

        }
    })

    const handleDeleteTable = () => {
        tableDeleteMutation.mutate({
            tableId: tableId
        }, {
            onSuccess: res => {
                setDeleteDialogOpen(false)
                setActiveTableId(0)
                handleCloseMenu()
            }
        })
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editTableDialogOpen, setEditTableDialogOpen] = useState(false)


    const submitEditTable = (data, reset) => {
        tableUpdateMutation.mutate({
            ...data,
            tableId: activeTableId
        }, {
            onSuccess: res => {
                reset()
                handleCloseMenu()
            }
        })
    };

    return <Menu
        // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; size: string; id: str... Remove this comment to see the full error message
        size={'small'}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}
        sx={{marginTop: "3px"}}
    >
        <MenuItem sx={{fontSize: "12px"}} onClick={() => {
            setDeleteDialogOpen(true)
        }}>删除</MenuItem>
        <AlertDialog open={deleteDialogOpen}
                     handleClose={() => {
                         setDeleteDialogOpen(false)
                         handleCloseMenu()
                     }}
                     confirm={handleDeleteTable}
                     title={"删除"}
                     msg={"确认删除当前表吗"}/>

        <MenuItem sx={{fontSize: "12px"}} onClick={() => {
            setEditTableDialogOpen(true)
        }}>编辑</MenuItem>
        {!tableIsLoading &&
            <EditTableDialog
                value={tableData?.data?.data}
                open={editTableDialogOpen}
                closeDialog={() => setEditTableDialogOpen(false)}
                submitForm={submitEditTable}/>
        }
    </Menu>
}

