import {AbstractReactFactory} from "@projectstorm/react-canvas-core";
import {NodeModel} from "./NodeModel";
import {NodeWidget} from "./NodeWidget";


export class NodeFactory extends AbstractReactFactory {

    constructor() {
        super("ts-custom-node");
    }

    generateModel(initialConfig) {
        return new NodeModel();
    }

    generateReactWidget(event) {
        return (
            <NodeWidget engine={this.engine} node={event.model} />
        );
    }

}
