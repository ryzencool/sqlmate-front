import React, {useState} from "react";
import createEngine, {DefaultLinkModel, DiagramModel,} from "@projectstorm/react-diagrams";

import DiagramWidget from "../../components/graph/DiagramWidget";
import {NodeFactory} from "../../components/graph/NodeFactory";
import {NodeModel} from "../../components/graph/NodeModel";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/projectStore";
import {useListTableDetail, useListTableRel} from "../../store/rq/reactQueryStore";
import Button from "@mui/material/Button";

function DBEr() {

    const [project] = useAtom(activeProjectAtom)
    const [tableList, setTableList] = useState(null);
    const [tableRels, setTableRels] = useState(null);
    const tableListQuery = useListTableDetail({projectId: project.id}, {
        enabled: false
    });
    const tableRelsQuery = useListTableRel({projectId: project.id}, {
        enabled: false
    })

    return (
        <div>
            <Button onClick={() => {
                tableListQuery.refetch().then(
                    res => {
                        console.log("数据是", res.data.data.data)
                        setTableList(res.data.data.data)
                    }
                )

                tableRelsQuery.refetch().then(
                    res => {
                        setTableRels(res.data.data.data)
                    }
                )
            }}>刷新</Button>
            {!!tableList && !!tableRels && <Graph tableList={tableList} tableRels={tableRels}/>}
        </div>
    )
}

function Graph({tableList, tableRels}) {
    const engine = createEngine();
    engine.getNodeFactories().registerFactory(new NodeFactory());

    const model = new DiagramModel();

    let nodes = []

    tableList.forEach((it, index) => {
        let node = new NodeModel(
            {
                color: "LightCyan",
                ...it
            })
        node.setPosition((index + 1) * 300, 100)
        model.addNode(node);
        nodes.push(node)
    });

    if (tableRels.length > 0) {
        tableRels.forEach((it, index) => {
            const link = new DefaultLinkModel();
            let leftNode = nodes.find(n => n.id === it.leftTableId)
            let rightNode = nodes.find(n => n.id === it.rightTableId)
            link.setSourcePort(leftNode.getPort("right_" + it.leftColumnId))
            link.setTargetPort(rightNode.getPort("left_" + it.rightColumnId))
            model.addLink(link)
        })
    }

    engine.setModel(model)

    return <DiagramWidget engine={engine}/>;
}

export default DBEr;
