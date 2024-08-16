import { Character } from "./Character"
import { CHARACTERS } from "../data/Characters"

export class CharacterParser {
    characters: Array<Character>
    
    constructor() {
        this.characters = []
        this.init();
    }
    
    init() {
        //console.log(CHARACTERS);
        for (var c of CHARACTERS) {
            var new_c = new Character(
                c['id'],
                c['name'],
                c['alignment'],
                c['description'],
                c['img_path'] //,
                // c['animations']
            )
            this.characters.push(new_c)
        }
    }
    
    get_char_by_name(name: string) {
        return this.characters.filter(c => c.name === name)[0];
    }
}