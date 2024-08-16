import { Event } from "./Event"

export class EventGraph {
    events: Array<Event>
    
    constructor(E: Array<Event>) {
        this.events = E;
        this.init()
    }
    
    init() {
        
    }
    
    reset() {
        // reset nodes
        this.events.map((e) => {
            e.reset();
        });
    }
    
    getEventIds() {
        var eventIds: Array<number> = [];
        this.events.map((e) => {eventIds.push(e.id)});
        return eventIds;
    }
        
    getIdsFromEvents(es: Array<Event>) {
        var eventIds: Array<number> = [];
        es.map((e) => {eventIds.push(e.id)});
        return eventIds;
    }
    
    getPathStrFromEvents(es: Array<Event>): string {
        var eventIds: Array<number> = this.getIdsFromEvents(es);
        return eventIds.join(" -> ");
    }
    
    getUnvisitedEventNodes() {
        // console.log(this.events.filter((e) => !e.visited));
        return this.events.filter((e) => !e.visited);
    }
    
    getEdges(): Array<Array<number>> {
        var edges: Array<Array<number>> = [];
        this.events.map((e) => {
        //    e.messages.map((m) => {
        //     if (m.to_event_id >= 0) {
        //         var edge: Array<number> = [e.id, m.to_event_id];
        //         edges.push(edge);
        //     }
        //    });
            var eventEdges = this.adjacentEdges(e);
            edges.push(...eventEdges);
        });
        return edges;
    }
    
    getAdjacencyMatrix(): Array<Array<number>> {
        // adjacency matrix is an events.length by events.length matrix
        // where the entry is 1 if there is an edge between events and 0 if
        // there is not.
        // create events.length by events.length size matrix and fill with zeros
        var adjMatrix: Array<Array<number>> = Array(this.events.length).fill(0).map(() => Array(this.events.length).fill(0));
        // set adjMatrix entry to 1 at the location of each edge
        var edges = this.getEdges();
        edges.map((edge) => {
            adjMatrix[edge[0]][edge[1]] = 1;
        });
        return adjMatrix;
    }
    
    // getAdjacencyList(): Array<Array<number>> {
    //     // in an adjacency list, each element's index is the node index,
    //     // and each element is a list of nodes that it points to
    //     var adjList = new Array<Array<number>>();
        
    //     return adjList;
    // }
    
    printNodes() {
        this.events.map((e) => {
            console.log(e);
        });
    }
    
    printEdges() {
        this.getEdges().map((e) => {
            console.log(`${e[0]} -> ${e[1]}`);
        });
    }
    
    getEventNodeById(id: number) : Event|null {
        var filteredEvents = this.events.filter((e) => e.id == id);
        if (filteredEvents.length > 0) {
            return filteredEvents[0];
        }
        return null;
    }
    
    is_exit_event(event_id: number) : boolean {
        // returns "true" if this event does not link to any other events
        var e = this.getEventNodeById(event_id);
        if (e) {
            var edges = this.adjacentEdges(e);
            if (edges.length > 0) {
                return false;
            }
        }
        return true;
    }
    
    adjacentEdges(eventNode: Event) : Array<Array<number>> {
        // see Pseudocode section: https://en.wikipedia.org/wiki/Depth-first_search
        // return list of edges this eventNode points to,
        // i.e. edges from this eventNode to messages.to_event_id
        var edges: Array<Array<number>> = [];
        eventNode.messages.map((m) => {
            // if message itself transfers to another event, add an edge
            if (m.to_event_id !== -1) {
                var edge = [eventNode.id, m.to_event_id];
                // console.log(edge);
                // console.log(m.text);
                edges.push(edge);
            }
            // if message has options and an option transfers to another event,
            // add an edge
            m.options.map((o) => {
                if (o.to_event_id !== -1) {
                    var edge = [eventNode.id, o.to_event_id];
                    edges.push(edge);
                }
            })
        });
        // remove duplicate edges
        edges = [...new Set(edges)];
        return edges;
    }
    
    
    allEdges(): Array<Array<number>> {
        // get all edges in graph
        var finalEdges = new Array<Array<number>>();
        this.events.map((e) => {
            this.adjacentEdges(e).map((edge) => {
                finalEdges.push(edge);
            })
        })
        finalEdges = [...new Set(finalEdges)];
        return finalEdges;
    }
    
    dfsRecursive(eventNode: Event) {
        eventNode.visit();
        // console.log(`Visited node: ${eventNode.id}`);
        // console.log(`-->Edges: ${this.adjacentEdges(eventNode)}`);
        this.adjacentEdges(eventNode).map((edge) => {
            var toEventNode = this.getEventNodeById(edge[1]);
            if (toEventNode) {
                if (!toEventNode.visited) {
                    this.dfsRecursive(toEventNode);
                }
            }
        })
    }
    
    floodFillDfsRecursive(eventNode: Event, subGraphLabel: number) {
        // basically dfsRecursive, but as we visit the node, also label the node with subGraphLabel
        // console.log(`Visiting eventNode: ${eventNode.id}`);
        eventNode.label(subGraphLabel);
        eventNode.visit();
        this.adjacentEdges(eventNode).map((edge) => {
            // console.log(edge);
            var toEventNode = this.getEventNodeById(edge[1]);
            if (toEventNode) {
                if (!toEventNode.visited) {
                    this.floodFillDfsRecursive(toEventNode, subGraphLabel);
                }
            }
        })
    }
    
    getEventNodesByLabel(id: number): Array<Event> {
        return this.events.filter((e) => e.subGraphId == id);
    }
    
    printSubGraphIds() {
        this.events.map((e) => {
            console.log(`${e.id}: ${e.subGraphId}`);
        });
    }
    
    getSubGraphs(): Array<EventGraph> {
        // https://en.wikipedia.org/wiki/Flood_fill
        // assign the first sub graph as label 0
        var initialSubGraphLabel: number = 0;
        var subGraphLabel: number = initialSubGraphLabel;
        // call DFS on the node labeling each one, 
        while(true) {
            // call recursive DFS flood fill
            var unvisitedEvents = this.getUnvisitedEventNodes();
            if (unvisitedEvents.length == 0) {
                break;
            } else {
                this.floodFillDfsRecursive(unvisitedEvents[0], subGraphLabel);
            }
            // DFS has exhausted this subgraph; now increment the subGraphLabel
            // to go onto the next subgraph
            subGraphLabel += 1;
        }
        // get subgraphs
        var subgraphs: Array<EventGraph> = [];
        for (var i = initialSubGraphLabel; i < subGraphLabel; i ++) {
            var nodes = this.getEventNodesByLabel(i);
            var subGraph = new EventGraph(nodes);
            subgraphs.push(subGraph);
            // console.log(`Extracted subgraph with ${nodes.length} node(s): ${i}`);
        }
        // finally, clean up: mark all nodes as unvisited again
        this.reset();
        return subgraphs;
    }
    
    
    // strongConnect(e: Event, index: number, stack: Array<Event>, sccList: Array<Array<Event>>): Array<Array<Event>> {
    //     // see getCycles()
    //     // initialize this node to the smallest unused index
    //     e.index = index;
    //     e.lowlink = index;
    //     // console.log(`Assigned node #${e.id} the depth index of: ${index}`);
    //     stack.push(e);
    //     e.onStack = true;
    //     // increment the index (for the next node to use)
    //     index += 1;
        
    //     // consider successors of this node (using all edges in graph) looking for back edges
    //     // (a back edge is any edge which points from this node to a node added in the stack
    //     // previously, i.e. forming a cycle!)
    //     // this.getEdges().map((edge) => {
    //     this.allEdges().map((edge) => {
    //         var fromNode = this.getEventNodeById(edge[0]);
    //         var toNode = this.getEventNodeById(edge[1]);
    //         if ((fromNode !== null) && (toNode !== null)) {
    //             if (toNode.index == -1) {
    //                 // this successor has not been visited; recurse on it
    //                 sccList = this.strongConnect(toNode, index, stack, sccList);
    //                 toNode.lowlink = Math.min(fromNode.lowlink, toNode.lowlink);
    //             } else if (toNode.onStack) {
    //                 // if this successor is on the stack, then it must be in the current strongly connected component.
    //                 // The node's lowlink is therefore assigned to whichever node came first in the cycle (its parent)
    //                 fromNode.lowlink = Math.min(fromNode.lowlink, toNode.index);
    //             }
    //             // else if (!toNode.onStack) {
    //             //     // if successor is not on the stack, then this edge is pointing to a strongly
    //             //     // connected component that was already found and must be ignored
    //             //     // (so do nothing)
    //             // }
    //         }
    //     });
        
    //     // if this node is in fact a root node of a strongly connected component, then
    //     // create a strongly connected component to add all nodes with the same lowlink
    //     // and pop them off the stack (so the same node can't be added to two strongly
    //     // connected components)
    //     if (e.lowlink == e.index) {
    //         var scc: Array<Event> = [];
    //         while (sccNode != e) {
    //             var sccNode = stack.pop();
    //             if (sccNode) {
    //                 sccNode.onStack = false;
    //                 scc.push(sccNode);
    //             }
    //         }
    //         sccList.push(scc);
    //     }
    //     return sccList;
    // }
    
    // getStronglyConnectedComponents(): Array<Array<Event>> {
    //     // https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
    //     // cycles are found when the event is pointing to itself or there is a loop.
    //     // Tarjan's algorithm finds cycles (strongly connected components) by
    //     // keeping a node on the stack if the node has a path that exists
    //     // to a previous node on the stack.
    //     var index = 0;
    //     var stack: Array<Event> = [];
    //     var sccList: Array<Array<Event>> = [];
    //     this.events.map((e) => {
    //         // console.log(`Calling strongConnect on event #${e.id}`);
    //         // for each event node in graph, if index is not yet defined, then perform strongConnect
    //         // to check for strongly connected components (SCCs, i.e. cycles in graph)
    //         if (e.index == -1) {
    //             // var cycles = this.strongConnect(e, index, stack, sccList);
    //             // return cycles;
    //             sccList.push(...this.strongConnect(e, index, stack, sccList));
    //         }
    //     });
    //     this.reset();
    //     return sccList;
    // }
    
    
    
    // getCycles(): Array<Array<Event>> {
    //     // johnson's algorithm, "finding all the elementary circuits of a directed graph" paper
    //     var cyclesList = new Array<Array<Event>>();
        
    //     return cyclesList;
    // }
    
    // detectCycleDFS(eventNode: Event, eventsInCycle: Array<number>): Array<number> {
    //     if (eventNode.finished === true) {
    //         return eventsInCycle;
    //     }
    //     if (eventNode.visited === true) {
    //         console.log(`Cycle found with event node: ${eventNode.id}`);
    //         eventsInCycle.push(eventNode.id);
    //         return eventsInCycle;
    //     }
    //     eventNode.visited = true;
    //     this.adjacentEdges(eventNode).map((ed) => {
    //         // edge[0] is FROM node ID (current node)
    //         // edge[1] is TO node id (next node)
    //         var nextNode = this.getEventNodeById(ed[1]);
    //         if (nextNode) {
    //             var newEventsInCycle = this.detectCycleDFS(nextNode, eventsInCycle);
    //             eventsInCycle.push(...newEventsInCycle);
    //         }
    //     })
    //     eventNode.finished = true;
    //     return eventsInCycle;
    // }
    
    // getEventsInACycle(): Array<number> {
    //     // simple cycle detection algorithm: https://en.wikipedia.org/wiki/Cycle_(graph_theory)
    //     var eventsInCycle = new Array<number>();
        
    //     this.events.map((e) => {
    //         var newEventsInCycle = this.detectCycleDFS(e, eventsInCycle);
    //         eventsInCycle.push(...newEventsInCycle);
    //     })
        
    //     return eventsInCycle;
    // }
    
    getSimpleCycles(): Set<Array<Event>> {
        // https://en.wikipedia.org/wiki/Cycle_(graph_theory)
        
        // init
        var newNodes = new Set<Event>(this.events);
        var paths = new Set<Array<Event>>();
        
        // init a path for each node, where that node is start of path
        // and add the new path to list of paths
        Array.from(newNodes).map((n) => {
            var newPath = new Array<Event>();
            newPath.push(n);
            paths.add(newPath);
        });
        
        // init set of shortest cycles (elementary circuits)
        var shortestCycles = new Set<Array<Event>>();
        var cyclesFound = false;
        while (newNodes.size > 0) {  // this condition stops after finding 1 cycle: while (!cyclesFound && newNodes.size > 0) {
            newNodes.clear(); // empty the set of nodes to iterate on
            var newPaths = new Set<Array<Event>>(); // track paths found this iteration
            paths.forEach((path) => { // iterate through all the neighbors (adjacent edges) of the previous node
                var lastNode = path[path.length - 1];
                newNodes.add(lastNode); // 
                this.adjacentEdges(lastNode).map((ed) => {
                    var nextNode = this.getEventNodeById(ed[1]);
                    if (nextNode) {
                        if (path.length >= 3 && path[0] == nextNode) { // require cycle to be at least length 3
                            cyclesFound = true;
                            shortestCycles.add(path); // cycle was found; add this path to our list of cycles!
                        }
                        if (!path.includes(nextNode)) { // if the path doesn't contain the neighbor
                            newNodes.add(nextNode); // then add neighbor to set of vertices to iterate on to continue building path
                            var newPath = new Array<Event>();
                            newPath.push(...path); // add all nodes of existing path to new path
                            newPath.push(nextNode); // and additionally add the next node to new path
                            newPaths.add(newPath); // and finally, add new path to set of new paths
                        }
                    }
                });
            });
            // replace list of paths with new paths found from this iteration
            paths = newPaths;
        }
        
        // cycles searching complete, handle results
        // if (cyclesFound) {
        //     console.log(`${shortestCycles.size} cycles found:`);
        //     console.log(shortestCycles);
        // }
        
        
        // filter out duplicate cycles
        // iterate through shortestCycles storing the sorted path in newShortestCycles,
        // only adding the path to newShortestCycles if sorted path does not already exist in index,
        // effectively filtering out duplicates
        var newShortestCycles = new Set<Array<Event>>();
        var shortestCyclesAsSets = new Set<Set<Event>>();
        let areSetsEqual = (a: Set<Event>, b: Set<Event>) => a.size === b.size && [...a].every(value => b.has(value));
        shortestCycles.forEach((c) => {
            // get set of events in cycle
            // var sortedEventsInCycle = c.sort((a, b) => a.id > b.id ? 1 : -1);
            var cycleEventsSet = new Set(c);
            // if a cycle with these events isn't already in shortestCyclesAsSets,
            // push the set of cycles to the shortestCyclesAsSets as well
            // as the cycles event array to the final newShortestCycles list.
            // Remember, we want the Set for easily matching duplicates, but
            // we want the Array for keeping the order of events in the cycle
            // if (!shortestCyclesAsSets.has(cycleEventsSet)) {
            //     shortestCyclesAsSets.add(cycleEventsSet);
            //     newShortestCycles.add(c);
            // }
            var cycleAlreadyCaptured = false;
            shortestCyclesAsSets.forEach((cycleSet) => {
                if (areSetsEqual(cycleSet, cycleEventsSet)) {
                    cycleAlreadyCaptured = true;
                    // break;
                }
            });
            
            if (!cycleAlreadyCaptured) {
                shortestCyclesAsSets.add(cycleEventsSet);
                newShortestCycles.add(c);
            }
            
        });
        shortestCycles = newShortestCycles;
        
        return shortestCycles;
    }
    
    getEntranceEvents(): Array<Event> {
        // an entrance event is an event which points to nodes, but
        // has no nodes pointing to it
        var entranceEvents: Array<Event> = [];
        var allEdges = this.getEdges();
        
        this.events.map((e) => {
            var isEdgePointing = false;
            allEdges.map((edge) => {
                if (edge[1] == e.id) {
                    isEdgePointing = true;
                }
            });
            // if this is the first event in the game (id === 1, TODO: fix assumption),
            // or if there is no edge pointing to this event
            // and this event points to at least one other event, then
            // it is an entrance event
            if ( (e.id === 1) || ((!isEdgePointing) && (this.adjacentEdges(e).length > 0))) {
                if (!entranceEvents.includes(e)) {
                    entranceEvents.push(e);
                }
            }
        });
        
        return entranceEvents;
    }
    
    getExitEvents(): Array<Event> {
        // an event is an exit event if it has an edge pointing to it (incoming)
        // and no edges it is pointing to (outgoing)
        // must have an edge pointing to it to ensure it is not an unreachable node
        var exitEvents: Array<Event> = [];
        this.events.map((e) => {
            // edges outgoing
            var hasNoEdgesOutgoing = this.adjacentEdges(e).length === 0;
            // edges incoming
            var hasEdgesIncoming = false;
            this.getEdges().map((edge_ids: number[]) => {
                if (edge_ids[1] === e.id) {
                    hasEdgesIncoming = true;
                }
            })
            // add to list of exit events if both conditions are true (there can be multiple
            // exit events)
            if (hasNoEdgesOutgoing && hasEdgesIncoming) {
                exitEvents.push(e);
            }
        });
        return exitEvents;
    }
    
    
    getMinDistanceNode(nodes: Array<Event>): Event {
        var minNode: Event = nodes[0];
        nodes.map((n) => {
            if (n.dist < minNode.dist) {
                minNode = n;
            }
        });
        return minNode;
    }
    
    getDijkstraShortestPath(): Array<Event> {
        // see Pseudocode section: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
        // init search
        var pathNodes: Array<Event> = [];
        var unvisitedNodes: Array<Event> = [...this.events];
        var exitNodes = this.getExitEvents();
        var entranceNodes = this.getEntranceEvents();
        var sourceNode = entranceNodes[0];
        var destinationNode = exitNodes[0];
        if (exitNodes.length == 0) {
            console.warn("EventGraph shortestPathWarning: no exit events found. Unable to calculate shortest path. This means that there is no node found which by its messages or message option has no links to another event, and so the game has no end.");
            return [];
        } else if (exitNodes.length > 1) {
            console.warn(`EventGraph shortestPathWarning: multiple exit events found. Calculating shortest path using exit event by ID ${destinationNode.id} as destination node.`);
        }
        
        if (entranceNodes.length == 0) {
            console.warn("EventGraph shortestPathWarning: no entrance events found. Unable to calculate shortest path.");
            return [];
        } else if (entranceNodes.length > 1) {
            console.warn(`EventGraph shortestPathWarning: multiple entrance events found. Calculating shortest path using entrance event by ID ${sourceNode.id} as source node.`);
        }
        
        // initialize distances assigned to each node to Infinity, assign source node distance as 0
        this.events.map((e) => {
            if (e == sourceNode) {
                e.dist = 0;
            } else {
                e.dist = Infinity;
            }
            e.prev = null;
            unvisitedNodes.push(e);
        });
        
        // while unvisitedNodes still has nodes left to visit, visit a node
        // assigning it a distance from the source
        while (unvisitedNodes.length > 0) {
            // get the closest node that hasn't been visited yet
            // var testNode = unvisitedNodes.reduce((previousValue, thisEvent) => {
            //     return Math.min(previousValue, thisEvent.dist);
            // }, 0);
            var testNode = this.getMinDistanceNode(unvisitedNodes);
            // if we have reached the target node, then we found a path,
            // no need to continue so exit the while loop
            if (testNode == destinationNode) {
                break;
            }
            // mark this node as visited (remove it from unvisited list)
            var removeIndex: number = unvisitedNodes.findIndex(x => x.id === testNode.id);
            if (removeIndex > -1) {
                unvisitedNodes.splice(removeIndex, 1); // 2nd parameter: only remove the 1 item
            }
            // iterate through this node's neighbors
            this.adjacentEdges(testNode).map((edge) => {
                var toNode = this.getEventNodeById(edge[1]);
                if (toNode) {
                    if (unvisitedNodes.includes(toNode)) {
                        // if this neighbor hasn't been visited yet, 
                        var pathLength = testNode.dist + 1; // distance in this case is not weighted, so each node is distance of 1 from each other; otherwise, this 1 would instead be the distance from testNode to toNode
                        if (pathLength < toNode.dist) {
                            toNode.dist = pathLength;
                            toNode.prev = testNode;
                        }
                    }
                }
            })
        }
        
        // read the shortest path from destination to source,
        // inserting each node at the front of pathNodes so that
        // they can be read back in order of source -> destination
        pathNodes.push(destinationNode);
        var pathNode: Event|null = destinationNode.prev;
        if (pathNode != null) {
            while (pathNode != null) {
                pathNodes.unshift(pathNode);  // insert to front of array
                pathNode = pathNode.prev;
            }
        }
        
        this.reset();
        return pathNodes;
    }
    
}