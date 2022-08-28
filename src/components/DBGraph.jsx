import React from "react";
import createEngine, {DefaultLinkModel, DiagramModel,} from "@projectstorm/react-diagrams";

import DiagramWidget from "./graph/DiagramWidget";
import {NodeFactory} from "./graph/NodeFactory";
import {NodeModel} from "./graph/NodeModel";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/projectStore";
import {tableListDetailAtom, tableRelsAtom} from "../store/tableListStore";

function DBGraph() {

    const engine = createEngine();
    engine.getNodeFactories().registerFactory(new NodeFactory());
    const [project, setProject] = useAtom(activeProjectAtom)
    const [tableList, useTableList] = useAtom(tableListDetailAtom)
    const [tableRels, setTableRels] = useAtom(tableRelsAtom)

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
