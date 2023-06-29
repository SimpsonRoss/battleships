<a name="readme-top"></a>
# Battleships

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About

This application is a space themed Battleships game, where the player represents the human race in a fight against an ‘alien’ AI opponent. It’s a twist on the original Battleships game, but it incorporates some new features such as cannon, laser and nuclear weapons and an animated alien mascot.

This was project one of my General Assembly Software Engineering Immersive bootcamp.

## Game

![Battleships product image](https://github.com/SimpsonRoss/battleships/blob/main/resources/game-done-gif.gif)

### Built With

For this project we were tasked to choose and game and complete it using these tools:

- ![HTML5](https://img.shields.io/badge/-HTML5-05122A?style=flat&logo=html5)
- ![CSS3](https://img.shields.io/badge/-CSS-05122A?style=flat&logo=css3)
- ![JavaScript](https://img.shields.io/badge/-JavaScript-05122A?style=flat&logo=javascript)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## How to Play

[PLAY NOW](https://simpsonross.github.io/battleships/) There's no set-up required and the game is device responsive.

<!-- USAGE EXAMPLES -->

## Usage

How to play the Battleships Game.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Planning

Rules:
- Two opposing teams
- Each have a fleet of ships, of equal strength
- Neither side can see each other’s fleet
- They take turns back and forth, selecting a grid square to bomb
- If they manage to hit an enemy ship they get another go immediately
- Once one player’s fleet is completely destroyed, they lose.

Pseudocode:

* Define required constants:
  * Define the row and columns amount, incase I want to change the board size
  * Define a colors object with: 
    * keys of 'null' (when the square is empty)
    * 1 : the square is occupied by a ship 
    * -1 : the square is occupied and bombed
    * -2: the square is empty and bombed

* Define required variables used to track the state of the game:
  * The Boards: Use two 2D board arrays:
    * One for the computer 
    * One for the player
  * The Fleets: Use two 2D fleet arrays, each containing 5 ships:
    * One for the computer 
    * One for the player
  * Use a turn state variable to determine who’s turn it is
  * Use a winner state variable to represents a win or loss for the player, there should be no tie scenario

* Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant:
  * Computer board divs
  * Player board divs 
  * Message element 
  * Play Again button 
  Note: For MVP this might be all I need

* Upon loading the app should:
  * Initialise the state variables:
    * Iniatilise both the computer and player board array to 60 nulls/0s each, each index representing a cell on the respective game board
    * Initialise the turn variable to determine that it’s the Player’s turn first (always)
    * Initialise winner to null to represent that neither the player or computer has won yet, and the game is in play
  * Render state variables to the page:
    * Loop over each cell of each board
      * Use the index of the iteration to access the mapped value from the board array.
      * Set the color (for MVP) of the current element by using the value as a key on the colors lookup object (constant).
  * Render a message:
    * If winner has a value other than null (game still in progress)
    * Otherwise, render a congratulatory message to which player has won
  * Wait for the user to click a square

* Handle a player clicking a square:
  * Obtain the index of the square that was clicked by the id of the div element
  * Subtract 2 from the value of that array square:
    * -2 = Safe,
    * -1 = Bombed Ship,
    * 0 = Empty Square,
    * 1 =  Healthy Ship,

## Wireframe

![Wireframe of my Battleships game](https://github.com/SimpsonRoss/battleships/blob/main/resources/game-done-gif.gif)

## Aesthetic Inspiration

I wanted to give the game a retro arcade feel, with a simple neon heads up display. I was inspired by Arcade games such as Luna Lander, and movies like Tron. Similar to car restoration projects, I wanted to give the retro feel but with the modern conveniences (like tool tips for usability).
![Neon blue heads up display](https://github.com/SimpsonRoss/battleships/blob/main/resources/game-done-gif.gif)
![Computer screen from the Tron remake](https://github.com/SimpsonRoss/battleships/blob/main/resources/game-done-gif.gif)

## MVP - Minimum Viable Product

- [x] A working game board
- [x] Basic gameplay functionality
- [x] An AI opponent
- [x] A way to register a win
- [x] Media responsiveness
- [x] Live and playable online

## NTH - Nice to have

- [x] Special weapons
- [x] Dynamic animated effects
- [x] Basic tool-tips & tutorial
- [x] Competitive AI
- [x] Ship dynamic classes and shaping
- [x] Health Counters

## Sprint Planning

To keep my project on track I built a product backlog and worked through the cards all week. I approached the MVP items first and once they were completed I approached the nice to have items. I also met with tutors and conducted user research and took any user stories that popped up and added them in the backlog.

![Gif of my Trello Sprint Board](https://github.com/SimpsonRoss/battleships/blob/main/resources/game-done-gif.gif)

## Timeline

This diagram shows the iterations my game went through as I worked through the project week.

![Graphic timeline of my battleships project](https://github.com/SimpsonRoss/battleships/blob/main/resources/game-done-gif.gif)



<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Biggest Challenge
The biggest challenge and time sink of the creation process was developing the functions to control the 'AI' opponent. 
I broke them down into four stages so that I could attempt them at different stages of the project, depending on how much other vital functionality had been built out. 

Evolutions of the AI:
- Randomly picks squares
- Chooses squares around last hit
- Learns direction if subsequent last hits are in a line
- Sneaky… Accesses the unsunk ships of the player, towards endgame

I'd like to wipe out step four and amend the AI opponent so that it can remember possible ship locations and return to hunt them. For now though it makes the opponent challenging and from feedback it encourages people to continue playing.

## Mistakes

## User Feedback

## Next Steps

## Key Learnings
- Consider classes and object more in planning
- Take breaks and tidy up code, keep it DRY
- Code CSS for mobile first
- Assign time to unit testing
- Getting user feedback is key
- Maintain a healthy project/life balance, even if you're hooked on making a dancing alien.


<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Ross Simpson - [My LinkedIn](https://www.linkedin.com/in/simpsonre/) - thisisrosssimpson@gmail.com

Project Link: [https://github.com/SimpsonRoss/battleships](https://github.com/SimpsonRoss/battleships)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

These resources helped me greatly in the completion of my game, especially when it came to CSS styling and creating animated loops for my little alien mascot.

- [CSS Tricks](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [htmlcheatsheet.com](https://htmlcheatsheet.com/)
- [Img Shields](https://shields.io)
- [Trello] (https://trello.com/)
- [GitHub Pages](https://pages.github.com)
- [Photopea](https://www.photopea.com/)
- [EZ gif](https://ezgif.com/)
- [Animated Drawings](https://sketch.metademolab.com/canvas)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
