
// load in click noises and set their volume
let typing_click_sounds_tmp = [
    new Audio(`sounds/click1.mp3`),
    new Audio(`sounds/click2.mp3`),
    new Audio(`sounds/click3.mp3`),
];

typing_click_sounds_tmp.map((a) => {
    a.volume = 0.05;
});

export const TYPING_CLICK_SOUNDS = typing_click_sounds_tmp;