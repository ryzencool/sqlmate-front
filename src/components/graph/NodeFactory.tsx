import {AbstractReactFactory} from "@projectstorm/react-canvas-core";
import {NodeModel} from "./NodeModel";
import {NodeWidget} from "./NodeWidget";


export class NodeFactory extends AbstractReactFactory {

    constructor() {
        super("ts-custom-node");
    }

    generateModel(initialConfig) {
        // @ts-expect-error TS(2554) FIXME: Expected 1 arguments, but got 0.
        return new NodeModel();
    }

    generateReactWidget(event) {
        return (
            // @ts-expect-error TS(2322) FIXME: Type '{ engine: CanvasEngine<CanvasEngineListener,... Remove this comment to see the full error message
            <NodeWidget engine={this.engine} node={event.model} />
        );
    }

}
