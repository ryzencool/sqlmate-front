import React from 'react'
import {PortWidget} from "@projectstorm/react-diagrams";
import clsx from "clsx";
import './style.css'

class NodeAbstractWidget extends React.Component {


    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {


        return (
            <div>
                {this.props.node.content.map(it => {
                    return <div className={"flex flex-row items-center justify-center relative"}>
                        <PortWidget
                            engine={this.props.engine}
                            port={this.props.node.getPort("left_" + it.id)}
                            className={"absolute left-[-8px]"}
                        >
                            <div className={clsx("circle-port")}/>
                        </PortWidget>
                        <div className={'flex flex-row justify-between gap-4 w-full pl-4 pr-4'}>
                            <div>
                                {it.name}
                            </div>
                            <div>
                                {it.type}
                            </div>
                        </div>
                        <PortWidget
                            engine={this.props.engine}
                            port={this.props.node.getPort("right_" + it.id)}
                            className={"absolute right-[-8px]"}

                        >
                            <div className={clsx("circle-port")}/>
                        </PortWidget>
                    </div>
                })}

            </div>
        );
    }
}


export class NodeWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="custom-node">
                <div
                    className="custom-node-header"
                    style={{backgroundColor: this.props.node.color}}
                >
                    {this.props.node.title}
                </div>
                <NodeAbstractWidget
                    node={this.props.node}
                    engine={this.props.engine}
                />

            </div>
        );
    }
}
