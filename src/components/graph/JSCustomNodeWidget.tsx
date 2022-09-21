import * as React from "react";
import {PortWidget} from "@projectstorm/react-diagrams";
import "./style.css";

export class JSCustomNodeWidget extends React.Component {
    render() {
        // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        console.log("port is:", this.props.node);

        let pack = [];
        // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        for (let i = 0; i < this.props.node.portsIn.length; i++) {
            pack.push({
                // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                in: this.props.node.portsIn[i],
                // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                out: this.props.node.portsOut[i],
            });
        }
        console.log("package is:", pack)
        return (
            <div className="flex flex-col flex-grow">
                <div className={'bg-purple-300 rounded-lg p-2'}>header</div>
                {/* @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
                {this.props.node.portsIn.length > 0 &&
                    pack.map((port) => {
                        // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                        console.log(this.props.node.getPort())

                        return (

                        <div className="flex flex-row">
                            <PortWidget
                                // @ts-expect-error TS(2339) FIXME: Property 'engine' does not exist on type 'Readonly... Remove this comment to see the full error message
                                engine={this.props.engine}
                                port={port.in}
                            >
                                <div className="circle-port"/>
                            </PortWidget>
                            {port.in.options.name + " " + port.out.options.name}
                            <PortWidget
                                // @ts-expect-error TS(2339) FIXME: Property 'engine' does not exist on type 'Readonly... Remove this comment to see the full error message
                                engine={this.props.engine}
                                // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                port={this.props.node.getPort(port.out.getName())}
                            >
                                <div className="circle-port"/>
                            </PortWidget>
                        </div>)
                })}

                {/* <div
          className="custom-node-color"
          style={{ backgroundColor: this.props.node.color }}
        /> */}
            </div>
        );
    }
}
