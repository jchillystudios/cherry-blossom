

export const PURPLE_EVENT_3 = {
    "id": 3,
    "description": "Purple Event",
    "location": "Purple Background",
    "characters": ["Blue Cherry", "Green Cherry"],
    "messages": [
        {
            "id": 1,
            "speaker": "Green Cherry",
            "text": "Welcome to the Purple Event! I'm Green Cherry.",
            "emotion": "",
            "to_event_id": -1,
            "options": [],
            "sound_path": "",
            "input_required": ""
        },
        {
            "id": 2,
            "speaker": "Green Cherry",
            "text": "Ask me a question, any question!",
            "emotion": "",
            "to_event_id": -1,
            "options": [],
            "sound_path": "",
            "input_required": "?"
        },
        {
            "id": 3,
            "speaker": "Green Cherry",
            "text": "Hahaha, you're so funny! Now where should we go?",
            "emotion": "",
            "to_event_id": -1,
            "options": [
                {
                    "id": 1,
                    "text": "Go to Orange Event",
                    "to_event_id": 1
                },
                {
                    "id": 2,
                    "text": "Go to Red Event",
                    "to_event_id": 2
                },
                {
                    "id": 3,
                    "text": "Go to Exit Event",
                    "to_event_id": 4
                }
            ],
            "sound_path": "",
            "input_required": ""
        },
    ]
}




