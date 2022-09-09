import React, {useState} from 'react'
import {useParams} from "react-router-dom";
import {Avatar, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemButton} from "@mui/material";
import {useGenerateTeamJoin, useListTeamUser} from "../../../store/rq/reactQueryStore";
import Button from "@mui/material/Button";
import {colors} from "../project/ProjectCard";
import Box from "@mui/material/Box";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import toast from "react-hot-toast";


export default function TeamDetail(props) {
    const {id} = useParams()
    const [shareOpen, setShareOpen] = React.useState(false);


    const [shareUrl, setShareUrl] = useState("")
    const teamUsers = useListTeamUser({
        teamId: id
    }, {enabled: !!id})

    const generateTeamJoinQuery = useGenerateTeamJoin({
        teamId: id,
    }, {
        enabled: false
    })

    const handleCloseShare = () => {
        setShareOpen(false)
    }


    const handleClickShareJoin = (evt) => {

        generateTeamJoinQuery.refetch().then(res => {
            console.log(res.data.data)
            setShareOpen(true)
            setShareUrl(`http://49.235.94.2/team/join?key=${res.data.data.data}`)
        })
    }

    return (<div>
        <div>
            <Button size={"small"} onClick={handleClickShareJoin}>
                生成邀请链接
            </Button>
            <ShareDialog link={shareUrl}
                         open={shareOpen}
                         handleClose={handleCloseShare}/>
        </div>

        <List className={'w-11/12'}>
            {!teamUsers.isLoading && teamUsers.data.data.data.map(it => {
                return <ListItem disablePadding>
                    <ListItemButton className={'rounded-md flex flex-row justify-between'}>
                        <Avatar
                            className={`p-2 ${colors[it.username.length % 6]}`}>{it.username.substring(0, 1)}</Avatar>
                        <div>
                            {it.joinTime} 加入
                        </div>
                    </ListItemButton>

                </ListItem>
            })}


        </List>
    </div>)
}


function ShareDialog({open, handleClose, link}) {


    return <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {"生成加入团队链接"}
        </DialogTitle>
        <DialogContent>
            <Box sx={{
                width: '800px',
            }}>
                {link}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <CopyToClipboard text={link}
                             onCopy={() => {
                                 toast("复制成功")
                                 handleClose()
                             }}>
                <Button>复制</Button>
            </CopyToClipboard>

        </DialogActions>
    </Dialog>
}
