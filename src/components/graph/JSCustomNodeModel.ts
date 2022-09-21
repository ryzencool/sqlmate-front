import { DefaultPortModel, NodeModel } from "@projectstorm/react-diagrams";
import * as _ from "lodash";
/**
 * Example of a custom model using pure javascript
 */
export class JSCustomNodeModel extends NodeModel {
  constructor(options = {}) {
    super({
      ...options,
      type: "js-custom-node",
    });
    // @ts-expect-error TS(2339) FIXME: Property 'color' does not exist on type 'JSCustomN... Remove this comment to see the full error message
    this.color = options.color || { options: "red" };

    // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
    this.portsIn = [];
    // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
    this.portsOut = [];
  }

  doClone(lookupTable, clone) {
    clone.portsIn = [];
    clone.portsOut = [];
    super.doClone(lookupTable, clone);
  }

  removePort(port) {
    super.removePort(port);
    if (port.getOptions().in) {
      // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
      this.portsIn.splice(this.portsIn.indexOf(port), 1);
    } else {
      // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
      this.portsOut.splice(this.portsOut.indexOf(port), 1);
    }
  }
  addPort(port) {
    super.addPort(port);
    if (port.getOptions().in) {
      // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
      if (this.portsIn.indexOf(port) === -1) {
        // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
        this.portsIn.push(port);
      }
    } else {
      // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
      if (this.portsOut.indexOf(port) === -1) {
        // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
        this.portsOut.push(port);
      }
    }
    return port;
  }

  addInPort(label, after = true) {
    const p = new DefaultPortModel({
      in: true,
      name: label,
      label: label,
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'PortModelAlignment'.
      alignment: PortModelAlignment.LEFT,
    });
    if (!after) {
      // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
      this.portsIn.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  addOutPort(label, after = true) {
    const p = new DefaultPortModel({
      in: false,
      name: label,
      label: label,
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'PortModelAlignment'.
      alignment: PortModelAlignment.RIGHT,
    });
    if (!after) {
      // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
      this.portsOut.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  deserialize(event) {
    super.deserialize(event);
    // @ts-expect-error TS(2339) FIXME: Property 'name' does not exist on type 'BasePositi... Remove this comment to see the full error message
    this.options.name = event.data.name;
    // @ts-expect-error TS(2339) FIXME: Property 'color' does not exist on type 'BasePosit... Remove this comment to see the full error message
    this.options.color = event.data.color;
    // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
    this.portsIn = _.map(event.data.portsInOrder, (id) => {
      return this.getPortFromID(id);
    });
    // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
    this.portsOut = _.map(event.data.portsOutOrder, (id) => {
      return this.getPortFromID(id);
    });
  }

  serialize() {
    return {
      ...super.serialize(),
      // @ts-expect-error TS(2339) FIXME: Property 'name' does not exist on type 'BasePositi... Remove this comment to see the full error message
      name: this.options.name,
      // @ts-expect-error TS(2339) FIXME: Property 'color' does not exist on type 'BasePosit... Remove this comment to see the full error message
      color: this.options.color,
      // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
      portsInOrder: _.map(this.portsIn, (port) => {
        return port.getID();
      }),
      // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
      portsOutOrder: _.map(this.portsOut, (port) => {
        return port.getID();
      }),
    };
  }

  getInPorts() {
    // @ts-expect-error TS(2551) FIXME: Property 'portsIn' does not exist on type 'JSCusto... Remove this comment to see the full error message
    return this.portsIn;
  }

  getOutPorts() {
    // @ts-expect-error TS(2339) FIXME: Property 'portsOut' does not exist on type 'JSCust... Remove this comment to see the full error message
    return this.portsOut;
  }
}
