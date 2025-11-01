# ANTicipated

ANTicipated compiles free learning resources on valuable skills in a specific field to prepare job seekers for their dream job with help from an AI AssistANT. As a recent graduate, when viewing numerous job postings and repeatedly seeing valued skills that I did not have, my feeling of competence began to slide into doubt. ANTicipated will strengthen job seekers confidence by rewarding them as they actively learn valuable skills relevant to their field of interest.

## API's Used
* AI
    * [Google's Built-In AI Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)
* Search
    * [Google's Custom Search JSON API](https://developers.google.com/custom-search/v1/overview)
    * [YouTube Data API v3](https://developers.google.com/youtube/v3)
* Authentication & Authorization
    * [Identity Toolkit API](https://cloud.google.com/security/products/identity-platform?hl=en_US)
    * [Token Service API](https://cloud.google.com/identity-platform/docs/use-rest-api#section-refresh-token)
* Firebase
    * [Firebase Management API](https://firebase.google.com/)
    * [Cloud Firestore API](https://cloud.google.com/products/firestore?hl=en_US)
    * [Firebase Installations API](https://firebase.google.com/)

Users authenticated with Google's [OAuth](https://developers.google.com/identity/protocols/oauth2)

## ANTicipated Features & Functionality
The following is organized following the repositories file structure.
### api (Node.js)
* learningPath.js
    * Contains the an API that retrieves and returns a JSON object from Firebase representing the user's Learning Journey for the day.
    * If the user does not have a Learning Journey stored, then the Custom Search and YouTube API's are used to generate a learning journey for the course of a week based on the user's dream job and skills to learn.
* learningRecap.js
    * Contains the API that retrieves and returns text extracted from the web pages for that day's learning journey.
    * This text is used to provide the information necessary for Google's Built-In API to generate a learning recap.
* utils
    * firebaseAdmin.cjs
        * Creates a back-end connection to the Firestore database.
        * Is used by learningPath.js
    * performSearch.js
        * Searches both Google and YouTube using the provided search query and returns the JSON results.
        * Is used by learningPath.js
### public
* Contains the images to display:
    * ant_005.png - Picture of an ant found on [Vecteezy](https://www.vecteezy.com/vector-art/546797-cartoon-ant-insect-bug)
    * Edit.svg - Edit svg obtained from Figma
    * Progress_0-Progress_100 - Circular progress bars obtained from Figma
### src
* Components
    * Card (css & jsx)
        * Displays a skill's title and progress.
    * Grid Container (css & jsx)
        * Provides a two column layout for "Completed" skills and "In Progress" skills.
            * Places skills in rows of three columns
        * Implements the Card component
    * Header (css & jsx)
        * Displays the ant picture and name of the application "ANTicipated" along with a tagline.
    * Hero (css & jsx)
        * Implements the Header
        * Card
            * Displays the user's name saying "Hello (User's Display Name)"
            * Displays top skills & skills in progress. 
                * NOTE: These are currently static and are placeholders until the logic to load the data is implemented.
            * Displays a progress bar showing the user either how many hours they have spent learning or the number of pages/videos they have visited in their daily journey.
                * NOTE: This is static and is a placeholder until it's logic is implemented.
        * Displays a highlighted Video and Web Page of the Day.
    * Journey (css & jsx)
        * Displays a list of steps in an engaging fun flowing design that includes ants walking along a path.
        * Is the container for the User's Learning Journey.
    * Learning_Recap (css & jsx)
        * Implements Google's Built-In AI Summarizer to provide the user with daily key points regarding the skills relevant to their dream job.
    * LogOut.jsx
        * Contains the button and functionality to log a user out of the application.
    * ProtectedRoute.jsx
        * Ensures User's are logged-in before displaying the main page.
    * Skills (css & jsx)
        * Loads the skills and implements the Grid Container and Card components.
* Contexts
    * AuthContext.jsx
        * Tracks the user's state and identification while interacting with the app.
* Pages
    * Home.jsx
        * Obtains the learning path information to pass on to the Learning Journey component.
            * Implements the learningPath.js API
            * Implements the firestoreServices.js Service
        * Obtains the text from the web pages in the learning path to use later for the learning recap generation.
        * Implements the following components:
            * Hero
            * Journey
            * Skills
            * LogOut
        * Provides attribution to Vecteezy for the ant pictures.
    * Setup (css & jsx)
        * Provides the field's for new User's to enter their dream job(s) and their current skill(s).
    * SignIn (css & jsx)
        * Authenticates the user and creates a unique profile upon authentication to connect the user to their content stored in Firestore.
* Services
    * firestoreServices.js
        * Retrieves the skills associated with the current user from Firestore.
* App (jsx & css)
    * Controls the web routing.
* firebase.js
    * Connects the front-end to the Firestore database.
* main.jsx
    * Renders the app.
    * Implements AuthContext
