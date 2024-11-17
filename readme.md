# Rumi - Roommate Finder [Backend]

:)

Rumi is a roommate finder we developed during the 7-hour Hackacat Nano hackathon organized by ACM AI @ TXST.

### Tasks
- POST: Login Endpoint
- POST: Signp Endpoint with user preferences
    + Check for .edu emails
    + Password, and Confirm Password, Hash password with bcrypt
    + Auto login
- GET: Logout Endpoint
- GET: Login Status
- GET: Own/ User Profile
- PUT: Update User Profile
- PUT: Update Preferences
- GET: Profile Completed or Not
- GET: Get Matches
    + Filter data based on the dropdown selection with JS
    + Send that data to OPENAI and get JSON responses of Matches and the match percentage with the person


## Profile
- ID
- Email
- Name
- Photo
- Short Bio
- Social Links
    + Linkedin
    + Facebook
    + Instagram
    + WhatsApp
    + Telephone
    + Discord
- Location (city, state, country)
- Major
- University
- Preferences
    + Question
        - Answer (true/false)

