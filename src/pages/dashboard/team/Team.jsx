import React, {useState} from 'react'
import {useListTeam, useListTeamUser} from "../../../store/rq/reactQueryStore";
import Button from "@mui/material/Button";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTeam} from "../../../api/dbApi";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Card, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router";

export default function Team() {

    const teams = useListTeam()

    const [teamAddOpen, setTeamAddOpen] = useState(false)
    const [teamAddData, setTeamAddData] = useState({})
    const [selectedTeam, setSelectedTeam] = useState({});
    const queryClient = useQueryClient()
    const teamAdd = useMutation(createTeam, {
        onSuccess: () => {
            queryClient.invalidateQueries(['teams'])
        }
    })
    const teamUsers = useListTeamUser(selectedTeam, {enabled: !!selectedTeam})
    const navigate = useNavigate()
    console.log("团队列表", teamUsers)
    return <div>
        <div className={'flex flex-row gap-10'}>
            {!teams.isLoading && teams.data.data.data.map(it => (

                <Card className={"w-52 h-72"} key={it.id} >
                    <div className={"h-1/2 bg-purple-300"} >
                    </div>
                    <div className={"p-3 flex-col flex justify-between h-1/2"}>
                        <div className={" font-bold text-xl"}>
                            {it.name}
                        </div>
                        <div className={'mt-2'}>
                            {it.note}
                        </div>
                        <div className={'mt-2 w-full flex-row flex justify-end'}>
                            <Button onClick={() => navigate(`/header/dashboard/teamDetail/${it.id}`)}>进入团队</Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>


    </div>
}
