import { LOCATIONS } from "../data/Locations"
import { Location } from "./Location"

export class LocationParser {
    locations: Array<Location>
    
    constructor() {
        this.locations = []
        this.init()
    }
    
    init() {
        this.parse()
        // console.log(this.locations)
    }
    
    parse() {
        // console.log(LOCATIONS)
        for (var l of LOCATIONS) {
            var new_l = new Location(
                l['id'],
                l['name'],
                l['music_path'],
                l['background_image_path']
            )
            this.locations.push(new_l)
        }
    }
    
    get_location_by_name(name: string) {
        return this.locations.filter(l => l.name === name)[0];
    }
}


