import { LOCATIONS } from "../data/Locations"

export class Location {
    id: number
    name: string
    music_path: string
    background_image_path: string
    
    constructor(id: number, name: string, music_path: string, background_image_path: string) {
        this.id = id
        this.name = name
        this.music_path = music_path
        this.background_image_path = background_image_path
        this.init()
    }
    
    init() {
        
    }
}