import {DefaultPortModel, NodeModel as StormNodeModel} from "@projectstorm/react-diagrams";


export class NodeModel extends StormNodeModel {
    constructor(options) {
        super({
            ...options,
            type: "ts-custom-node"
        });
        // @ts-expect-error TS(2339) FIXME: Property 'color' does not exist on type 'NodeModel... Remove this comment to see the full error message
        this.color = options.color || "White";
        // @ts-expect-error TS(2339) FIXME: Property 'title' does not exist on type 'NodeModel... Remove this comment to see the full error message
        this.title = options.title || "Node";
        // @ts-expect-error TS(2339) FIXME: Property 'content' does not exist on type 'NodeMod... Remove this comment to see the full error message
        this.content = options.content || undefined;
        // @ts-expect-error TS(2339) FIXME: Property 'source' does not exist on type 'NodeMode... Remove this comment to see the full error message
        this.source = options.source || false;
        // @ts-expect-error TS(2339) FIXME: Property 'inputs' does not exist on type 'NodeMode... Remove this comment to see the full error message
        this.inputs = options.inputs || [];
        // @ts-expect-error TS(2339) FIXME: Property 'outputs' does not exist on type 'NodeMod... Remove this comment to see the full error message
        this.outputs = options.outputs || [];
        // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type 'NodeModel'.
        this.id = options.id || 0


        // @ts-expect-error TS(2339) FIXME: Property 'content' does not exist on type 'NodeMod... Remove this comment to see the full error message
        for (let i = 0 ; i < this.content.length; i++) {
            this.addPort(
                new DefaultPortModel({
                    in: true,
                    // @ts-expect-error TS(2339) FIXME: Property 'content' does not exist on type 'NodeMod... Remove this comment to see the full error message
                    name: "left_" + this.content[i].id
                })
            )
            this.addPort(
                new DefaultPortModel({
                    in: false,
                    // @ts-expect-error TS(2339) FIXME: Property 'content' does not exist on type 'NodeMod... Remove this comment to see the full error message
                    name: "right_"+  this.content[i].id
                })
            )
        }



    }

    serialize() {
        return {
            ...super.serialize(),
            // @ts-expect-error TS(2339) FIXME: Property 'color' does not exist on type 'NodeModel... Remove this comment to see the full error message
            color: this.color,
            // @ts-expect-error TS(2339) FIXME: Property 'title' does not exist on type 'NodeModel... Remove this comment to see the full error message
            title: this.title,
            // @ts-expect-error TS(2339) FIXME: Property 'content' does not exist on type 'NodeMod... Remove this comment to see the full error message
            content: this.content,
            // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type 'NodeModel'.
            id: this.id
        };
    }

    deserialize(event) {
        super.deserialize(event);
        // @ts-expect-error TS(2339) FIXME: Property 'color' does not exist on type 'NodeModel... Remove this comment to see the full error message
        this.color = event.data.color;
        // @ts-expect-error TS(2339) FIXME: Property 'title' does not exist on type 'NodeModel... Remove this comment to see the full error message
        this.title = event.data.title;
        // @ts-expect-error TS(2339) FIXME: Property 'content' does not exist on type 'NodeMod... Remove this comment to see the full error message
        this.content = event.data.content;
        // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type 'NodeModel'.
        this.id = event.data.id
    }
}
