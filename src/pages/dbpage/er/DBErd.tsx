import React from "react";
import createEngine, {DefaultLinkModel, DiagramModel,} from "@projectstorm/react-diagrams";

import DiagramWidget from "../../../components/graph/DiagramWidget";
import {NodeFactory} from "../../../components/graph/NodeFactory";
import {NodeModel} from "../../../components/graph/NodeModel";
import {useAtom} from "jotai";
import {projectTableDetailsAtom, projectTableRelationsAtom} from "../../../store/jt/tableListStore";
import Button from "@mui/material/Button";

export default function DBErd() {

    const [tableDetails] = useAtom(projectTableDetailsAtom)
    const [tableRelations] = useAtom(projectTableRelationsAtom)

    const engine = createEngine();
    // @ts-expect-error TS(2345) FIXME: Argument of type 'NodeFactory' is not assignable t... Remove this comment to see the full error message
    engine.getNodeFactories().registerFactory(new NodeFactory());

    const model = new DiagramModel();

    let nodes = []

    tableDetails.forEach((it, index) => {
        let node = new NodeModel(
            {
                color: "LightCyan",
                ...it
            })
        node.setPosition((index + 1) * 300, 100)
        model.addNode(node);
        nodes.push(node)
    });

    if (tableRelations.length > 0) {
        tableRelations.forEach((it, index) => {
            const link = new DefaultLinkModel();
            let leftNode = nodes.find(n => n.id === it.leftTableId)
            let rightNode = nodes.find(n => n.id === it.rightTableId)
            link.setSourcePort(leftNode.getPort("right_" + it.leftColumnId))
            link.setTargetPort(rightNode.getPort("left_" + it.rightColumnId))
            model.addLink(link)
        })
    }

    engine.setModel(model)

    return <div>
        <Button onClick={() => engine.zoomToFit()}>自适应大小</Button>
        <DiagramWidget engine={engine}/></div>
}


