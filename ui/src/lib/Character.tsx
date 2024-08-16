

export class Character {
    id: number
    name: string
    alignment: string
    description?: string
    img_path: string
    animations?: Array<String>

    constructor(id: number, name: string, alignment: string, description: string = '', img_path: string = '') { // , animations: Array<string> = []
        this.id = id
        this.name = name
        this.alignment = alignment // e.g. 'left', 'right' side of screen
        this.description = description
        this.img_path = img_path
        // this.animations = animations
        this.init();
    }

    init() {
        // console.log(`${this.name} registered!`)
    }

    // setImgPath(img_path: string) {
    //     this.img_path = img_path
    // }
}