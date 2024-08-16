import { EventsParser } from "./EventsParser";
import { Event } from "../lib/Event";
import { EventGraph } from "./EventGraph";
import { warnings } from "cytoscape";


export class EventPlayer {
    events_parser: EventsParser
    current_event: Event
    event_queue: Array<Number>
    checks: { [key: string]: boolean }
    event_graph: EventGraph
    
    constructor() {
        this.events_parser = new EventsParser();
        // initialize the event player with the first event!
        this.current_event = this.events_parser.get_event_by_id(1)
        // console.log(this.current_event)
        this.event_queue = []
        this.checks = {
            'duplicateWarning': true,
            'cyclesWarning': true,
            'disconnectedWarning': true,
            'multipleEntrancesWarning': true,
            'multipleExitsWarning': true,
            'shortestPathWarning': true
        };
        this.event_graph = new EventGraph(this.events_parser.events);
        this.init()
    }
    
    init() {
        // console.log(this.events_parser.events)
        // console.log(this.events_parser.character_parser.characters)
        // console.log(this.events_parser.character_parser.get_char_by_name("Blue Cherry"))
        // console.log(this.current_event)
        
        this.doChecks();
    }
    
    set_current_event_by_id(new_event_id: number) {
        this.current_event = this.events_parser.get_event_by_id(new_event_id)
    }
    
    set_next_event() {
        // play next event in event queue?
    }
    
    doChecks() {
        // do checks on this graph
        if (this.checks['duplicateWarning'] === true) {
            this.checkDuplicates();
        }
        if (this.checks['cyclesWarning'] === true) {
            this.checkCycles();
        }
        if (this.checks['disconnectedWarning'] === true) {
            this.checkDisconnected();
        }
        if (this.checks['multipleEntrancesWarning'] === true) {
            this.checkEntranceEvents();
        }
        if (this.checks['multipleExitsWarning'] === true) {
            this.checkExitEvents();
        }
        if (this.checks['shortestPathWarning'] === true) {
            this.checkShortestPath();
        }
    }
    
    getMaxId() {
        return this.events_parser.events.reduce((previousValue, thisEvent) => {
            return Math.max(previousValue, thisEvent.id);
        }, 0);
    }
    
    checkDuplicates() {
        
        var duplicatesCount: { [id: number]: number } = {};
        this.events_parser.events.map((e) => {
            // console.log(e.id);
            if (e.id in duplicatesCount) {
                duplicatesCount[e.id] += 1;
            } else {
                duplicatesCount[e.id] = 1;
            }
            
        });
        // console.log(duplicatesCount);
        
        var duplicateEvents = new Array<string>();
        for (var eventId in duplicatesCount) {
            if (duplicatesCount[eventId] > 1) {
                duplicateEvents.push(eventId);
            }
        }
        
        if (duplicateEvents.length > 0) {
            
            var maxId = this.getMaxId();
            // console.log(`Max ID: ${maxId}`);
            
            console.warn(`EventGraph warning: duplicate event IDs found: ${duplicateEvents}. Make sure to give each Event its own unique ID. Currently, the max ID of your graph is ${maxId}, and so we suggest your next event's ID to be ${maxId + 1} to avoid duplicates. You can shut off this warning by setting 'checks['duplicateWarning'] = false' in the EventPlayer.`);
        }
    }
    
    checkCycles() {
        var cyclesFound = this.event_graph.getSimpleCycles();
        if (cyclesFound.size > 0) {
            var warningStr: string = `EventGraph warning: {${cyclesFound.size}} cycles were found in the event graph. This means that some events in your event graph make circular story lines possible, which may or may not be desired behavior. You can shut off this warning by setting 'checks['cyclesWarning'] = false' in the EventPlayer. Cycles found:`
            cyclesFound.forEach((c) => {
                // append the start node as the end node for displaying the full cycle path explicitly
                c.push(c[0]);
                warningStr += `\n${this.event_graph.getPathStrFromEvents(c)}`;
            })
            console.warn(warningStr);
        }
    }
    
    checkDisconnected() {
        var subGraphs = this.event_graph.getSubGraphs();
        // this.event_graph.printSubGraphIds();
        if (subGraphs.length > 1) {
            var warningStr: string = `EventGraph warning: the event graph was found to have multiple (${subGraphs.length}) sub-graphs. This means that not all events may be reachable from the initial event. See below for the following sub-graphs found, each node in sub-graph represented by its event ID. You can shut off this warning by setting 'checks['disconnectedWarning'] = false' in the EventPlayer.\n`;
            console.warn();
            var i = 0;
            subGraphs.map((g) => {
                // console.warn(`Sub Graph #${i} {${g.events.length} node(s)}: ${g.getEventIds()}`)
                // g.printEdges();
                warningStr += `\nSub Graph #${i} {${g.events.length} node(s)}: ${g.getEventIds()}`;
                i ++;
            });
            console.warn(warningStr);
        }
    }
    
    checkEntranceEvents() {
        var entranceEvents = this.event_graph.getEntranceEvents();
        if (entranceEvents.length !== 1) {
            console.log(`EventGraph warning: (${entranceEvents.length}) entrance events found: ${this.event_graph.getIdsFromEvents(entranceEvents)}. An entrance event is an event which has a message or message option pointing to another event, but has no events pointing to it. There should only exist exactly one (1) entrance event. You can shut off this warning by setting 'checks['multipleEntrancesWarning'] = false' in the EventPlayer.`)
        }
    }
    
    checkExitEvents() {
        var exitEvents = this.event_graph.getExitEvents();
        // console.log(exitEvents);
        if (exitEvents.length !== 1) {
            console.warn(`EventGraph warning: (${exitEvents.length}) exit events found: ${this.event_graph.getIdsFromEvents(exitEvents)}. An exit event is an event which does not have a message or a message option which leads to another event. 0 exit events means the game never ends, 1 exit event means the game can only end in one way, and multiple exit events means that the game can have multiple different endings. You can shut off this warning by setting 'checks['multipleExitsWarning'] = false' in the EventPlayer.`);
        }
    }
    
    checkShortestPath() {
        var pathNodes = this.event_graph.getDijkstraShortestPath();
        // console.log(pathNodes);
        console.warn(`EventGraph warning: the shortest path solution to an exit event was found to be {${pathNodes.length}} event nodes long. Consider if this number is too short of a possible solution for the time duration that you intend players to play your story. You can shut off this warning by setting 'checks['findShortestPath'] = false' in the EventPlayer. Shortest path nodes: ${this.event_graph.getPathStrFromEvents(pathNodes)}.`);
    }
    
}