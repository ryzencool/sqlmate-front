import {DefaultPortModel, NodeModel as StormNodeModel} from "@projectstorm/react-diagrams";


export class NodeModel extends StormNodeModel {
    constructor(options) {
        super({
            ...options,
            type: "ts-custom-node"
        });
        this.color = options.color || "White";
        this.title = options.title || "Node";
        this.content = options.content || undefined;
        this.source = options.source || false;
        this.inputs = options.inputs || [];
        this.outputs = options.outputs || [];
        this.id = options.id || 0


        for (let i = 0; i < this.content.length; i++) {
            this.addPort(
                new DefaultPortModel({
                    in: true,
                    name: "left_" + this.content[i].id
                })
            )
            this.addPort(
                new DefaultPortModel({
                    in: false,
                    name: "right_" + this.content[i].id
                })
            )
        }


    }

    serialize() {
        return {
            ...super.serialize(),
            color: this.color,
            title: this.title,
            content: this.content,
            id: this.id
        };
    }

    deserialize(event) {
        super.deserialize(event);
        this.color = event.data.color;
        this.title = event.data.title;
        this.content = event.data.content;
        this.id = event.data.id
    }
}
