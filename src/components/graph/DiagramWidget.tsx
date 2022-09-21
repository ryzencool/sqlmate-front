import * as React from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";

export function DiagramWidget(props) {
  const { engine } = props;

  return (
    <CanvasWidget
        className="rounded-md h-[calc(100vh-12rem)] w-full bg-slate-200 flex flex-row flex-wrap"
        engine={engine} />
  );
}

export default DiagramWidget;
