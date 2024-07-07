sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: {content: "Single Page App ei tee turhia sivunlatauksia",date: "2019-01-03T15:11:22.123Z"}
    deactivate server

    Note left of server: Server sends the just added piece of data in JSON format