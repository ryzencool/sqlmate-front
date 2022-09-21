import * as React from "react";
import { JSCustomNodeModel } from "./JSCustomNodeModel";
import { JSCustomNodeWidget } from "./JSCustomNodeWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";

export class JSCustomNodeFactory extends AbstractReactFactory {
  constructor() {
    super("js-custom-node");
  }

  generateModel(event) {
    return new JSCustomNodeModel();
  }

  generateReactWidget(event) {
    // @ts-expect-error TS(2769) FIXME: No overload matches this call.
    return <JSCustomNodeWidget engine={this.engine} node={event.model} />;
  }
}
