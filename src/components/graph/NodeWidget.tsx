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
            <div >
                {/* @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
                {this.props.node.content.map(it => {
                    return <div className={"flex flex-row items-center justify-center relative"}>
                        <PortWidget
                            // @ts-expect-error TS(2339) FIXME: Property 'engine' does not exist on type 'Readonly... Remove this comment to see the full error message
                            engine={this.props.engine}
                            // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
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
                            // @ts-expect-error TS(2339) FIXME: Property 'engine' does not exist on type 'Readonly... Remove this comment to see the full error message
                            engine={this.props.engine}
                            // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
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
                    // @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                    style={{backgroundColor: this.props.node.color}}
                >
                    {/* @ts-expect-error TS(2339) FIXME: Property 'node' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
                    {this.props.node.title}
                </div>
                <NodeAbstractWidget
                    // @ts-expect-error TS(2322) FIXME: Type '{ node: any; engine: any; }' is not assignab... Remove this comment to see the full error message
                    node={this.props.node}
                    // @ts-expect-error TS(2339) FIXME: Property 'engine' does not exist on type 'Readonly... Remove this comment to see the full error message
                    engine={this.props.engine}
                />

            </div>
        );
    }
}
