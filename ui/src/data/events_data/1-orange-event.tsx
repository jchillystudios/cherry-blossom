
export const ORANGE_EVENT_1 = {
    "id": 1,
    "description": "Orange Event - Entry Event",
    "location": "Orange Background",
    "characters": ["Blue Cherry"],
    "messages": [
        {
            "id": 1,
            "speaker": "System",
            "text": "Welcome to Cherry Blossom!",
            "emotion": "bold",
            "to_event_id": -1,
            "options": [],
            "sound_path": "",
            "input_required": ""
        },
        {
            "id": 2,
            "speaker": "Blue Cherry",
            "text": "Hi, I'm the Blue Cherry. This is the entry event in the Cherry Blossom example game.",
            "emotion": "",
            "to_event_id": -1,
            "options": [],
            "sound_path": "",
            "input_required": ""
        },
        {
            "id": 3,
            "speaker": "Blue Cherry",
            "text": "This event has an orange background image, so I'm going to call this event the Orange Event.",
            "emotion": "",
            "to_event_id": -1,
            "options": [],
            "sound_path": "",
            "input_required": ""
        },
        {
            "id": 4,
            "speaker": "Blue Cherry",
            "text": "Which event should we go to?",
            "emotion": "",
            "to_event_id": -1,
            "options": [
                {
                    "id": 1,
                    "text": "Red Event",
                    "to_event_id": 2
                },
                {
                    "id": 2,
                    "text": "Purple Event",
                    "to_event_id": 3
                },
            ],
            "sound_path": "",
            "input_required": ""
        },
    ]
}