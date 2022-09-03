import React from "react";
import createEngine, {DefaultLinkModel, DiagramModel,} from "@projectstorm/react-diagrams";

import DiagramWidget from "../../components/graph/DiagramWidget";
import {NodeFactory} from "../../components/graph/NodeFactory";
import {NodeModel} from "../../components/graph/NodeModel";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/projectStore";
import {useListTableDetail, useListTableRel} from "../../store/rq/reactQueryStore";

function DBGraph() {

    const engine = createEngine();
    engine.getNodeFactories().registerFactory(new NodeFactory());
    const [project, setProject] = useAtom(activeProjectAtom)


    const tableListQuery = useListTableDetail({projectId: project.id});
    const tableRelsQuery = useListTableRel({projectId: project.id})


    if (tableListQuery.isLoading || tableRelsQuery.isLoading) {
        return <div>加载中</div>
    }

    let tableList = tableListQuery.data.data.data
    let tableRels = tableRelsQuery.data.data.data
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

export default DBGraph;
