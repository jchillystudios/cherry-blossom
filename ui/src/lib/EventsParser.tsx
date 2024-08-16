import { EVENTS } from "../data/Events"
import { CharacterParser } from "./CharacterParser"
import { Event } from "./Event"
import { Message } from "./Message"
import { Character } from "./Character"
import { LocationParser } from "./LocationParser"
import { Option } from "./Option"

// interface OptionsRecordInterface {
//     // help TypeScript determine Message Option data types
//     id: number,
//     text: string,
//     to_event_id: number
// }

export class EventsParser {
    events: Array<Event>
    character_parser: CharacterParser
    location_parser: LocationParser
    
    constructor() {
        this.events = []
        this.character_parser = new CharacterParser()
        this.location_parser = new LocationParser()
        this.init()
    }
    
    init() {
        this.parse()
    }
    
    parse() {
        // console.log(EVENTS);
        for (var e of EVENTS) {
            // console.log(e)
            var messages: Array<Message> = []
            for (var m of e['messages']) {
                // console.log(m)
                // console.log(m.options)
                var options = []
                for (var o of m['options']) {
                    var new_o = new Option(
                        o['id'],
                        o['text'],
                        o['to_event_id']
                    )
                    options.push(new_o)
                }
                var new_m = new Message(
                    m['id'],
                    m['text'],
                    m['emotion'],
                    m['to_event_id'],
                    options,
                    m['speaker'],
                    m['sound_path'],
                    m['input_required']
                )
                // console.log(options)
                messages.push(new_m)
            }
            var characters: Array<Character> = []
            for (var c of e['characters']) {
                // console.log(c)
                characters.push(this.character_parser.get_char_by_name(c))
            }
            var new_e = new Event(
                e['id'],
                e['description'],
                this.location_parser.get_location_by_name(e['location']),
                messages,
                characters
            )
            // console.log(new_e)
            this.events.push(new_e)
        }
        // console.log(this.events)
    }
    
    get_event_by_id(id: number) {
        return this.events.filter(e => e.id === id)[0];
    }
}