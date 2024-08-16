import React, { useState, useRef } from "react";
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";
import { EventPlayer } from '../lib/EventPlayer'

// https://colorhunt.co/palettes/pink-brown
// https://colorhunt.co/palettes/brown-green
// https://colorhunt.co/palettes/pink-gold

cytoscape.warnings(false);

const SHOW_SOLUTION_PATH = true;
const SHOW_NODE_LABELS = true;

const NODE_COLOR = '#F3C5C5'; // pink
const NODE_BORDER_COLOR = '#C89595'
const CURRENT_NODE_COLOR = '#C1F6E7'; // blue
const SOLUTION_PATH_COLOR = '#FFD384'; // gold
const NODE_LABEL_TEXT_COLOR = '#000000';
const NODE_LABEL_BACKGROUND_COLOR = '#FFFFFF';
const EDGE_COLOR = '#694E4E'; // brown
const BACKGROUND_COLOR = '#9FC088'; // 647E68, 76BA99

interface Props {
    event_player: EventPlayer
}

function LightenDarkenColor(col: string, amt: number) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

export const Visualizer: React.FC<Props> = ({ event_player }) => {

    // https://js.cytoscape.org/#layouts
    const layout = { name: 'cose', nodeDimensionsIncludeLabels: true, animate: false}; // , idealEdgeLength: 32};
    // const layout = {name: 'grid'};
    // const layout = {name: 'concentric'};
    // const layout = {name: 'breadthfirst'};
    // const layout = {name: 'circle'};

    // example graph format
    // const elements = [
    //     { data: { id: 'one', label: 'Node 1' }, position: {x: 0, y: 0}},
    //     { data: { id: 'two', label: 'Node 2' }, position: {x: 100, y: 0}},
    //     { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    // ];

    function getElements(): cytoscape.ElementDefinition[] {
        var events = event_player.event_graph.events;
        var edges = event_player.event_graph.allEdges();
        var elements: cytoscape.ElementDefinition[] = [];
        var solutionPath = event_player.event_graph.getIdsFromEvents(event_player.event_graph.getDijkstraShortestPath());
        
        // console.log(edges);
        // console.log(solutionPath);

        // push nodes to elements data
        events.map((e) => {
            // get color of node
            var nodeColor = NODE_COLOR;
            if (e.id === event_player.current_event.id) {
                nodeColor = CURRENT_NODE_COLOR;
            } else if (SHOW_SOLUTION_PATH && solutionPath.includes(e.id)) {
                nodeColor = SOLUTION_PATH_COLOR;
            }
            // get n incoming connections to size the graph
            // (an incoming edge is an edge pointing to this node)
            var nIncoming = edges.filter((ed) => ed[1] === e.id).length;
            var scaleFactor = nIncoming;
            if (nIncoming === 0) {
                scaleFactor = 1; // if no incoming edges, this is an entrance event; don't set node area to 0, otherwise it will disappear
            }
            var nodeSize = Math.sqrt(scaleFactor * 2000); // have to take square root because circle area grows faster than diameter (if let to grow linearly then circle sizes will look very disproportionate)
            // finally, push node data to Cytoscape graph elements list
            elements.push(
                {
                    data: {
                        id: e.id.toString(),
                        name: e.id.toString(),
                        label: SHOW_NODE_LABELS ? `{${e.id}} ${e.description}`: ''
                    },
                    style: {
                        'background-color': nodeColor,
                        'border-color': LightenDarkenColor(nodeColor, -60),
                        'width': nodeSize,
                        'height': nodeSize
                    }
                }
            );
        });

        // push edges to elements data
        edges.map((ed) => {
            // get color of edge
            var edgeColor = EDGE_COLOR;
            if (SHOW_SOLUTION_PATH && solutionPath.includes(ed[0]) && solutionPath.includes(ed[1])) {
                edgeColor = SOLUTION_PATH_COLOR;
            }
            // push edge data to Cytoscape graph elements list
            elements.push(
                {
                    data: { source: ed[0].toString(), target: ed[1].toString(), width: 3 },
                    style: { "line-color": edgeColor, "target-arrow-color": edgeColor }
                }
            );
        });
        
        // console.log(elements);
        return elements;
    }

    return (
        <div style={{display: 'inline'}}>
            <div style={{float: 'left', padding: '20px', width: "20%", color: 'white'}}>
                <h1>Visualizer</h1>
                <p>Use the visualizer to debug your game.</p>
                <h2>Legend</h2>
                <div>
                    <div><div style={{float: 'left', height: '25px', width: '25px', marginRight: '10px', backgroundColor: CURRENT_NODE_COLOR, border: 'solid', borderColor: LightenDarkenColor(CURRENT_NODE_COLOR, -60)}}></div>Entry event node. This is the event that starts the game.</div>
                    <br />
                    <div><div style={{float: 'left', height: '25px', width: '25px', marginRight: '10px', backgroundColor: SOLUTION_PATH_COLOR, border: 'solid', borderColor: LightenDarkenColor(SOLUTION_PATH_COLOR, -60)}}></div>Solution event node. This is an event node which is part of the solution path.</div>
                    <br />
                    <div><div style={{float: 'left', height: '25px', width: '25px', marginRight: '10px', backgroundColor: NODE_COLOR, border: 'solid', borderColor: LightenDarkenColor(NODE_COLOR, -60)}}></div>General event node. This is an event node in the game accessible by the player that is not part of the solution path.</div>
                </div>
            </div>
            <div style={{float: 'left'}}>
                <CytoscapeComponent
                    elements={getElements()}
                    layout={layout}
                    wheelSensitivity={0.2}
                    style={
                        {
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            'backgroundColor': BACKGROUND_COLOR
                        }
                    }
                    stylesheet={[
                        {
                            selector: 'node',
                            style: {
                                width: 50,
                                height: 50,
                                shape: 'ellipse',
                                label: 'data(label)',
                                "overlay-color": NODE_LABEL_TEXT_COLOR,
                                // "text-outline-color": NODE_LABEL_BACKGROUND_COLOR,
                                "text-background-color": NODE_LABEL_BACKGROUND_COLOR,
                                "text-background-opacity": 0.5,
                                "text-background-shape": 'roundrectangle',
                                'text-background-padding': '5px',
                                'text-wrap': 'wrap',
                                'text-max-width': '200px',
                                // 'text-valign': 'center',
                                'border-color': NODE_BORDER_COLOR,
                                "border-width": 3
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                width: 5,
                                "line-color": EDGE_COLOR, //"#ccc",
                                "target-arrow-color": EDGE_COLOR, //"#ccc",
                                "target-arrow-shape": "triangle",
                                "target-arrow-fill": "filled",
                                "curve-style": "bezier"
                            }
                        }
                    ]}
                />
            </div>
        </div>
    );
}


