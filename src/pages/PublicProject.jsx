import React from 'react'
import {Card, Chip} from "@mui/material";
import {usePagePublicProject} from "../store/rq/reactQueryStore";
import {useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/projectStore";
import {addFavoriteProject} from "../api/dbApi";
import {useMutation, useQueryClient} from "@tanstack/react-query";



export default function PublicProject() {

    const publicProjects = usePagePublicProject()


    const [project, setProject] = useAtom(activeProjectAtom)
    const navigate = useNavigate()

    const handleClickEnterProject = () => {
        setProject(it)
        navigate(`/header/home/${it.id}`)
    }

    const queryClient = useQueryClient()

    const addFavoriteProjectMutation = useMutation(addFavoriteProject, {
        onSuccess: data => {
            queryClient.invalidateQueries(['favoriteProjects'])
        }
    })

    const handleClickCollectProject = (data) => {

        addFavoriteProjectMutation.mutate({
            projectId: data.id
        })
    }

    if (publicProjects.isLoading) {
        return <div>加载中</div>
    }
    return <div>
        <div className={" flex flex-row flex-wrap gap-10 mb-10"}>
            {
                publicProjects.data.data.data.dataList.map(
                    it => (
                        <Card className={"w-52 h-80 flex flex-col justify-between"} key={it.id}>
                            <div className={"h-1/2 bg-purple-300"}>
                                <img className={'w-full h-full object-cover'}
                                     src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/pexels-pixabay-326012.jpg"}/>
                            </div>
                            <div className={"pl-2 pt-2 pb-1 flex-col flex "}>
                                <div className={" font-bold "}>
                                    {it.name}
                                </div>
                                <div className={'text-sm text-slate-400'}>
                                    {it.note}
                                </div>
                                <div className={'mt-2 flex flex-row flex-wrap gap-1 '}>
                                    {
                                        !!it.tags && it.tags.map(tag => (
                                            <Chip label={tag} size={'small'}/>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={'mt-2 w-full flex-row flex justify-end gap-1 mb-2'}>
                                <Button onClick={() => handleClickCollectProject(it)}>收藏</Button>
                                <Button onClick={handleClickEnterProject}>进入项目</Button>
                            </div>
                        </Card>
                    )
                )
            }
        </div>

    </div>
}
