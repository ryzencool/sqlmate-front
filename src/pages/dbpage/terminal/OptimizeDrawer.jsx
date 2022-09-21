import Box from "@mui/material/Box";
import {Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import {CodeResult} from "../../../components/drawer/TemporaryDrawer";
import React from "react";

export function OptimizeDrawer({data}) {

    if (data === null) {
        return <Box>加载中</Box>
    }

    console.log("穿越", data)


    let indexes = data.indexRecommend.map(it => it.alterIndex).reduce((a, b) => a + b, "");

    let explain = data.explain

    return <Box sx={{
        width: "1000px",
        padding: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "30px"
    }}>
        <Box sx={{
            width: "580px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <Card sx={{
                width: "100%",
                height: "100px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "50px"
            }}>
                <Box>
                    <Typography sx={{
                        fontWeight: 'bold',
                        fontSize: '3rem'
                    }}>{data.score}</Typography>

                </Box>
                <Box>
                    <Box>
                        索引建议: {data.indexRecommend.length}条
                    </Box>
                    <Box>
                        SQL检查: {data.checks.length}条
                    </Box>
                </Box>
            </Card>
            {data.indexRecommend.length > 0 &&
                <Card>
                    <Box sx={{
                        fontWeight: "bold",
                        padding: "10px",
                        borderBottomWidth: "2px",
                        borderBottomColor: "grey",
                    }}>索引建议</Box>

                    <Box>
                        <CodeResult
                            content={indexes}
                            format={"sql"}/>
                    </Box>
                </Card>
            }
            <Card>
                <Box sx={{
                    fontWeight: "bold",
                    padding: "10px",
                    borderBottomWidth: "2px",
                    borderBottomColor: "grey",
                    display: "flex",
                    flexDirection: "row"
                }}>Explain解析</Box>

                <Box sx={{
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'row',

                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width: "240px",
                        borderRightWidth: "2px",
                        borderRightColor: "grey"
                    }}>
                        {
                            !!explain.explainTable && explain.explainTable.map(it =>
                                <Box sx={{display: "flex", flexDirection: "row", gap: "10px"}}>
                                    <Box sx={{width: "110px"}}>{it.key}</Box>
                                    <Box sx={{width: "100px"}}>{it.value}</Box>
                                </Box>)
                        }
                    </Box>
                    <Box sx={{paddingLeft: '15px', display: 'flex', flexDirection: "column", gap: '20px'}}>
                        <Box>
                            <Box sx={{fontWeight: "bold"}}>
                                查询类型
                            </Box>
                            <Box>{explain.selectType === null ? '无' : explain.selectType.value}</Box>
                        </Box>
                        <Box>
                            <Box sx={{fontWeight: "bold"}}>
                                表扫描情况
                            </Box>
                            <Box>{explain.type === null ? '无' : explain.type.value}</Box>
                        </Box>
                        <Box>
                            <Box sx={{fontWeight: "bold"}}>
                                额外信息
                            </Box>
                            <Box>{explain.extra === null ? '无' : explain.extra.value}</Box>
                        </Box>

                    </Box>
                </Box>

            </Card>
        </Box>

        <Box sx={{
            width: "380px",
        }}>
            <Card sx={{
                width: "100%",
            }}>
                <Box sx={{
                    fontWeight: "bold",
                    padding: "15px",
                    borderBottomWidth: "2px",
                    borderBottomColor: "grey"
                }}>SQL检查</Box>

                <Box sx={{
                    padding: '20px',
                    display: "flex",
                    flexDirection: "column",
                    gap: '15px'
                }}>
                    {data.checks.length > 0 && data.checks.map(it =>
                        <Box sx={{
                            // borderBottomWidth: "2px",
                            // borderBottomColor: "grey",
                            paddingBottom: '15px'
                        }}>
                            <Box sx={{
                                fontWeight: "bold"
                            }}>{it.key}</Box>
                            <Box sx={{
                                paddingTop: "5px"
                            }}>{it.value}</Box>
                        </Box>)
                    }
                </Box>


            </Card>
        </Box>
    </Box>
}
