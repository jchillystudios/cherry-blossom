import { Option } from "./Option"

export class Message {
    id: number
    text: string
    emotion: string
    to_event_id: number
    options: Array<Option>
    speaker: string
    sound_path: string
    input_required: string
    
    constructor(id: number, text: string, emotion: string, to_event_id: number, options: Array<Option>, speaker: string, sound_path: string = '', input_required: string = '') {
        this.id = id  // message ID
        this.text = text  // message text displayed
        this.emotion = emotion  // characters' emotions as the message is played
        this.to_event_id = to_event_id  // event to go to after this message plays
        this.options = options  // if options is not empty, instead of message having button to go to next message, message displays list of options for user to select
        this.speaker = speaker  // text to describe who is saying this message. Use "System" to display message as system message.
        this.sound_path = sound_path  // sound at this path plays once (oneshot) on message play
        this.input_required = input_required  // input "?" as wild card to allow any text
        
        this.init()
    }
    
    init() {
        
    }
    
    has_options() {
        // console.log(this.options, this.options.length, this.options.length > 0)
        return this.options.length > 0
    }
    
    has_sound() {
        return this.sound_path !== ""
    }
    
    is_input_required() {
        return this.input_required !== ""
    }
}