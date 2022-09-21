import * as React from "react";
import {PortWidget} from "@projectstorm/react-diagrams";
import "./style.css";

export class JSCustomNodeWidget extends React.Component {
    render() {
        console.log("port is:", this.props.node);

        let pack = [];
        for (let i = 0; i < this.props.node.portsIn.length; i++) {
            pack.push({
                in: this.props.node.portsIn[i],
                out: this.props.node.portsOut[i],
            });
        }
        console.log("package is:", pack)
        return (
            <div className="flex flex-col flex-grow">
                <div className={'bg-purple-300 rounded-lg p-2'}>header</div>
                {this.props.node.portsIn.length > 0 &&
                    pack.map((port) => {
                        console.log(this.props.node.getPort())

                        return (

                            <div className="flex flex-row">
                                <PortWidget
                                    engine={this.props.engine}
                                    port={port.in}
                                >
                                    <div className="circle-port"/>
                                </PortWidget>
                                {port.in.options.name + " " + port.out.options.name}
                                <PortWidget
                                    engine={this.props.engine}
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
