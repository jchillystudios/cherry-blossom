import { Message } from "./Message"
import { Character } from "./Character"
import { Location } from "./Location"

export class Event {
    id: number
    description: string
    location: Location
    messages: Array<Message>
    characters: Array<Character>
    
    // temp variables for graph traversal algorithms (for EventGraph checks in EventPlayer)
    visited: boolean
    subGraphId: number
    index: number
    lowlink: number
    onStack: boolean
    dist: number
    prev: Event|null
    finished: boolean
    
    constructor(id: number, description: string = '', location: Location, messages: Array<Message> = [], characters: Array<Character>) {
        this.id = id;
        this.description = description;
        this.location = location;
        this.messages = messages;
        this.characters = characters;
        
        this.subGraphId = -1;
        this.visited = false;
        this.index = -1;
        this.lowlink = -1;
        this.onStack = false;
        this.dist = Infinity;
        this.prev = null;
        this.finished = false;
        
        this.init()
    }
    
    init() {
        
    }
    
    reset() {
        this.subGraphId = -1;
        this.visited = false;
        this.index = -1;
        this.lowlink = -1;
        this.onStack = false;
        this.dist = Infinity;
        this.prev = null;
        this.finished = false;
    }
    
    label(id: number) {
        this.subGraphId = id;
    }
    
    get_message_by_id(id: number) {
        return this.messages.filter(m => m.id === id)[0];
    }
    
    visit() {
        this.visited = true;
    }
}