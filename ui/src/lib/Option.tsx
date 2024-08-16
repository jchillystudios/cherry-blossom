

export class Option {
    id: number
    text: string
    to_event_id: number
    
    constructor(id: number, text: string, to_event_id: number) {
        this.id = id
        this.text = text
        this.to_event_id = to_event_id
    }
}