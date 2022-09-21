import {useGetProjectDetail, useListTables} from "../../../store/rq/reactQueryStore";
import {createColumnHelper} from "@tanstack/react-table";
import {Card} from "@mui/material";
import ZTable from "../../../components/table/ZTable";
import React from 'react';
import {GiSwordSpin} from "react-icons/gi";
import {IoLogoTableau} from "react-icons/io5";
import {AiOutlineConsoleSql} from "react-icons/ai";
import {BsTable} from "react-icons/bs";

export default function DBProjectInterface({projectId}) {


    const projectQuery = useGetProjectDetail({projectId: projectId}, {
        enabled: !!projectId
    })

    const tablesQuery = useListTables({projectId: projectId}, {
        enabled: !!projectId
    })


    const columnHelper = createColumnHelper();


    const tableHeader = [
        columnHelper.accessor("name", {
            cell: info => info.getValue(),
            header: () => <span className={'font-bold'}>表名</span>,

        }),
        columnHelper.accessor("note", {
            cell: info => info.getValue(),
            header: () => <span className={'font-bold'}>注释</span>,

        })
    ]

    if (projectQuery.isLoading || tablesQuery.isLoading) {
        return <div>加载中</div>
    }

    let projectData = projectQuery.data.data.data;

    return <div>
        <div className={'text-sm border-b pb-2'}>项目介绍</div>
        <div className={'mt-5 text-2xl font-bold'}>{projectData.projectInfo?.name}</div>
        <div className={'mt-3'}>
            <div className={'grid grid-rows-3 w-10/12 gap-2'}>
                <div className={'grid grid-cols-5 '}>
                    <div className={'col-span-1 text-slate-400 text-sm'}>创建人</div>
                    <div className={'col-span-1 text-sm'}>{projectData.createUser?.username}</div>
                    <div className={'col-span-1'}></div>
                    <div className={'col-span-1 text-slate-400 text-sm'}>创建时间</div>
                    <div className={'col-span-1 w-56 text-sm'}>{projectData.projectInfo?.createTime}</div>
                </div>
                <div className={'grid grid-cols-5 text-sm'}>
                    <div className={'col-span-1 text-slate-400'}>更新人</div>
                    <div className={'col-span-1'}>{projectData.updateUser?.username}</div>
                    <div className={'col-span-1'}></div>
                    <div className={'col-span-1 text-slate-400'}>更新时间</div>
                    <div className={'col-span-1 w-56'}>{projectData.updateUser?.updateTime}</div>
                </div>
                <div className={'grid grid-cols-5 text-sm'}>
                    <div className={'col-span-1 text-slate-400'}>备注</div>
                    <div className={'col-span-1'}>{projectData.projectInfo?.note}</div>
                    <div className={'col-span-3'}></div>
                </div>
            </div>

            <div
                className={'flex flex-row  w-10/12 p-3 flex flex-row justify-between gap-4 mt-8'}>
                <Card className={'w-44 h-24 flex flex-row justify-around items-center bg-blue-100'}>
                    <div className={'flex flex-col gap-2 pl-2'}>
                        <div className={'font-bold text-slate-500'}>
                            表
                        </div>
                        <div className={' font-bold text-3xl '}>
                            {projectData.tableCount}
                        </div>
                    </div>
                    <div className={'p-2'}>
                        <BsTable className={'text-4xl text-slate-500'}/>
                    </div>
                </Card>
                <Card className={'w-44 h-24 flex flex-row justify-around bg-blue-100 items-center'}>
                    <div className={'flex flex-col gap-2 pl-2'}>
                        <div className={' font-bold text-slate-500 '}>
                            索引
                        </div>
                        <div className={' font-bold text-3xl '}>
                            {projectData.indexCount}
                        </div>
                    </div>
                    <div className={'p-2'}>
                        <IoLogoTableau className={'font-bold text-4xl  text-slate-500'}/>
                    </div>
                </Card>
                <Card className={'w-44 h-24 flex flex-row justify-around bg-blue-100 items-center'}>
                    <div className={'flex flex-col gap-2 pl-2'}>
                        <div className={' font-bold text-slate-500'}>
                            字段
                        </div>
                        <div className={' font-bold text-3xl '}>
                            {projectData.columnCount}
                        </div>
                    </div>
                    <div className={'p-2'}>
                        <GiSwordSpin className={'font-bold text-4xl  text-slate-500'}/>
                    </div>
                </Card>
                <Card className={'w-44 h-24 flex flex-row items-center justify-around bg-blue-100'}>
                    <div className={'flex flex-col gap-2 pl-2'}>
                        <div className={' font-bold text-slate-500'}>
                            SQL
                        </div>
                        <div className={' font-bold text-3xl '}>
                            {projectData.sqlCount}
                        </div>
                    </div>
                    <div className={'p-2'}>
                        <AiOutlineConsoleSql className={' text-4xl  text-slate-500'}/>
                    </div>
                </Card>
            </div>
        </div>
        <div className={'mt-8'}>
            <div className={'font-bold mt-4'}>项目表</div>
            <ZTable columns={tableHeader} data={tablesQuery.data.data.data} canSelect={false}/>
        </div>
    </div>
}
