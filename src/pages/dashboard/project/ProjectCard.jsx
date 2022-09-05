import React from 'react'
import {FaRegClone, FaRegEye, FaRegHeart} from "react-icons/fa";
import {Card, Chip} from "@mui/material";
import Button from "@mui/material/Button";
export const colors = [
    "bg-gradient-to-l from-cyan-500 to-blue-500",
    "bg-gradient-to-l from-indigo-500 to-purple-500",
    "bg-gradient-to-l from-purple-500 to-pink-500",
    "bg-gradient-to-l from-yellow-500 to-pink-500",
    "bg-gradient-to-l from-blue-500 to-green-500",
    "bg-gradient-to-l from-indigo-500 to-yellow-500"
]

export default function ProjectCard({project, mode, operateArea}) {


    return (
        <Card className={"w-56 h-96 flex  flex-col  rounded-xl justify-between "} key={project.id}>
            <div>
                <div
                    className={`h-16 w-full ${colors[project.name.length % 6]} flex items-center pl-4`}>
                    <div className={"font-bold text-2xl overflow-hidden text-ellipsis whitespace-nowrap"}> {project.name}</div>
                </div>
                <div className={"flex-col flex  w-full pl-4 pr-4 pt-4 "}>
                    <div>
                        <div className={'flex-row flex justify-around gap-1 w-full'}>
                            <div className={'flex-col items-center flex gap-1'}>
                                <FaRegClone className={'text-lg'}/>
                                <div className={'text-sm'}>{project.cloneCount}</div>
                            </div>
                            <div className={'flex-col items-center flex gap-1'}>
                                <FaRegEye className={'text-lg'}/>
                                <div className={'text-sm'}>{project.openCount}</div>
                            </div>
                            <div className={'flex-col items-center flex gap-1'}>
                                <FaRegHeart className={'text-lg'}/>
                                <div className={'text-sm'}>{project.collectCount}</div>
                            </div>
                        </div>
                        <div className={'text-sm text-slate-400 mt-4'}>
                            {project.note}
                        </div>
                    </div>

                </div>
            </div>
            <div className={'pl-4 pr-4 relative mb-2 flex-col flex justify-between '}>
                <div>
                    <div className={'flex flex-row gap-4 mt-4'}>
                        <div className={'font-bold text-sm'}>数据库</div>

                        <div className={'text-sm'}>
                            {project.dbType === 0 && "Sqlite"}
                            {project.dbType === 1 && "Mysql"}
                            {project.dbType === 2 && "Postgresql"}
                            {project.dbType === 3 && "Sql Server"}
                        </div>
                    </div>

                    <div className={'flex flex-row gap-0.5 flex-wrap'}>
                        {
                            !!project.tags && project.tags.map(tag => (
                                <Chip label={tag} size={'small'} className={'mt-1'}/>
                            ))
                        }
                    </div>
                </div>
                <div className={'mt-2 w-full flex-row flex justify-end gap-1 mb-2'}>
                    {
                        operateArea
                    }
                    {/*<Button size={"small"} onClick={handleClickSetProject}>设置</Button>*/}
                    {/*<EditProjectDialog value={it} mode={2}*/}
                    {/*                   closeDialog={handleCloseProjectSetting}*/}
                    {/*                   open={projectUpdateOpen}*/}
                    {/*                   submitForm={(data) => submitUpdateProjectForm(data, it.id)}/>*/}
                    {/*<Button size={"small"} onClick={() => handleClickProjectDetail(it)}>详情</Button>*/}
                </div>
            </div>
        </Card>
    )
}
