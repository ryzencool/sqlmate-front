import React from 'react'
import {useParams} from "react-router-dom";
import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useListTeamUser} from "../store/rq/reactQueryStore";
import Button from "@mui/material/Button";


export default function TeamDetail(props) {
    const {id} = useParams()

    const teamUsers = useListTeamUser({
        teamId: id
    }, {enabled: !!id})


    return (<div>
        <div>
            <Button>
                生成邀请链接
            </Button>
        </div>

        <List className={'w-11/12'}>
            {!teamUsers.isLoading && teamUsers.data.data.data.map(it => {
                return <ListItem disablePadding>
                    <ListItemButton className={'rounded-md'}>
                        <ListItemText primary={it.username}/>
                        <div>
                            {it.joinTime} 加入
                        </div>
                    </ListItemButton>

                </ListItem>
            })}


        </List>
    </div>)
}
