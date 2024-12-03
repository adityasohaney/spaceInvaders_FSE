// Global variables for player, bullets, invaders, and asteroids
let player;
let bullets = [];
let invaders = [];
let invaderBullets = [];
let asteroids = [];
let stars = [];

// Global settings for invaders
let invaderWidth = 40;
let invaderHeight = 20;
let invaderSpeed = 1;
let direction = 1;

// Game variables
let score = 0;
let lives = 3;
let gameState = 'menu'; // Can be 'menu', 'playing', or 'gameover'
let difficulty = 1; // Difficulty level: 1 (Easy), 2 (Medium), 3 (Hard)
let shooting = false;
let shootInterval = 15;
let frameSinceLastShot = 0;
let level = 1;
let gameOverPlayed = false; // Flag to ensure game-over sound plays only once

// Images and sound variables
let spaceshipImg, alienImg, shootSound, explosionSound, asteroidHitSound, gameOverSound;

// Preload assets (images and sounds)
function preload() {
  spaceshipImg = loadImage('Spaceship.jpg'); // Spaceship image
  alienImg = loadImage('Alien.jpg'); // Alien image

  // Load sound effects
  shootSound = loadSound('shoot.wav');
  explosionSound = loadSound('explosion.wav');
  asteroidHitSound = loadSound('asteroidHit.wav');
  gameOverSound = loadSound('gameover.wav'); // Game-over sound
}

// Setup function initializes the canvas and other game elements
function setup() {
  createCanvas(600, 400);
  userStartAudio(); // Ensure sound works after user interaction
  initializeStars(); // Initialize the starry background

  // Blend spaceship and alien images to remove white background
  spaceshipImg = blendWhiteBackground(spaceshipImg);
  alienImg = blendWhiteBackground(alienImg);

  // Start at the menu screen
  startMenu();
}

// Draw function to handle game states
function draw() {
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'playing') {
    drawGame();
  } else if (gameState === 'gameover') {
    drawGameOver();
  }
}

// Function to blend white background of images for transparency
function blendWhiteBackground(img) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    if (r > 200 && g > 200 && b > 200) {
      img.pixels[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }
  img.updatePixels();
  return img;
}

// Menu screen with options for difficulty selection
function drawMenu() {
  background(20, 20, 100); // Dark blue background
  fill(255);
  textSize(50);
  textAlign(CENTER);
  text('SPACE INVADERS', width / 2, height / 4); // Title

  textSize(30);
  text('Press 1 for Easy', width / 2, height / 2 - 20);
  text('Press 2 for Medium', width / 2, height / 2 + 20);
  text('Press 3 for Hard', width / 2, height / 2 + 60);

  textSize(15);
  fill(200);
  text('Use Left/Right Arrows to Move', width / 2, height - 70);
  text('Press Spacebar to Shoot', width / 2, height - 50);
}

// Starts the menu state and resets necessary flags
function startMenu() {
  gameState = 'menu';
  gameOverPlayed = false; // Reset game over sound flag
}

// Main game screen
function drawGame() {
  background(0); // Black background
  displayStars(); // Display animated stars
  drawGUI(); // Display score, lives, and level

  movePlayer();
  drawPlayer();

  shootBullets();
  moveBullets();
  drawBullets();

  moveInvaders();
  drawInvaders();

  createAsteroids();
  moveAsteroids();
  drawAsteroids();

  checkCollisions();

  // If all invaders are defeated, progress to the next level
  if (invaders.every((invader) => !invader.isAlive)) {
    nextLevel();
  }
}

// Game over screen with the final score and restart instructions
function drawGameOver() {
  background(100, 0, 0); // Dark red background
  fill(255);
  textSize(50);
  textAlign(CENTER);
  text('GAME OVER', width / 2, height / 3);

  textSize(30);
  text(`Score: ${score}`, width / 2, height / 2);

  textSize(20);
  text('Press R to Restart', width / 2, height / 2 + 50);

  // Play game-over sound once
  if (!gameOverPlayed) {
    gameOverSound.play();
    gameOverPlayed = true;
  }
}

// Displays GUI elements: score, lives, and level
function drawGUI() {
  fill(255);
  textSize(20);
  text(`Score: ${score}`, 10, 10);
  text(`Lives: ${lives}`, width - 100, 10);
  text(`Level: ${level}`, width / 2 - 30, 10);
}

// Handles key inputs for menu and restart
function keyPressed() {
  if (gameState === 'menu') {
    if (key === '1') {
      difficulty = 1;
      startGame();
    } else if (key === '2') {
      difficulty = 2;
      startGame();
    } else if (key === '3') {
      difficulty = 3;
      startGame();
    }
  } else if (gameState === 'gameover' && key === 'r') {
    resetGame();
  }
}

// Starts the game and initializes variables
function startGame() {
  gameState = 'playing';
  level = 1;
  setupGameObjects();
}

// Resets the game to the menu state
function resetGame() {
  startMenu();
  lives = 3;
  score = 0;
}

// Sets up player, bullets, invaders, and asteroids
function setupGameObjects() {
  player = { x: width / 2, y: height - 40, width: 40, height: 40, speed: 5 };
  bullets = [];
  invaderBullets = [];
  asteroids = [];
  createInvaders();
}

// Creates invaders at random positions
function createInvaders() {
  invaders = [];
  let numInvaders = level * 5 * difficulty; // Number of invaders scales with difficulty
  for (let i = 0; i < numInvaders; i++) {
    invaders.push({
      x: random(50, width - 50), // Random x position
      y: random(10, height / 2), // Random y position within the top half
      width: invaderWidth,
      height: invaderHeight,
      isAlive: true,
    });
  }
}

// Progresses to the next level
function nextLevel() {
  level++;
  invaderSpeed += 0.5 + difficulty * 0.2; // Increase speed with difficulty
  createInvaders(); // Generate new invaders
}

// Draws the player spaceship
function drawPlayer() {
  image(spaceshipImg, player.x, player.y, player.width, player.height);
}

// Moves the player horizontally
function movePlayer() {
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
  }
  player.x = constrain(player.x, 0, width - player.width);
}

// Fires bullets from the player
function shootBullets() {
  if (keyIsDown(32) && frameSinceLastShot >= shootInterval) {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
    shootSound.play(); // Play shooting sound
    frameSinceLastShot = 0;
  }
  frameSinceLastShot++;
}

// Moves player bullets upward
function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= 7;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
}

// Draws player bullets
function drawBullets() {
  fill(255, 0, 0);
  bullets.forEach((bullet) => {
    rect(bullet.x, bullet.y, 4, 10);
  });
}

// Moves invaders and adjusts their positions
function moveInvaders() {
  invaders.forEach((invader) => {
    if (invader.isAlive) {
      invader.y += invaderSpeed * 0.1; // Move slightly downward
      invader.x += random(-1, 1); // Random horizontal movement
    }
  });
}

// Draws invaders
function drawInvaders() {
  invaders.forEach((invader) => {
    if (invader.isAlive) {
      image(alienImg, invader.x, invader.y, invader.width, invader.height);
    }
  });
}

// Handles asteroid creation, movement, and drawing
function createAsteroids() {
  if (frameCount % (120 - difficulty * 10) === 0) {
    asteroids.push({
      x: random(width),
      y: 0,
      size: random(20, 50),
      speed: random(1 + difficulty, 3 + difficulty),
    });
  }
}

function moveAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].y += asteroids[i].speed;
    if (asteroids[i].y > height) {
      asteroids.splice(i, 1);
    }
  }
}

function drawAsteroids() {
  fill(150);
  asteroids.forEach((asteroid) => {
    ellipse(asteroid.x, asteroid.y, asteroid.size);
  });
}

// Initializes background stars
function initializeStars() {
  for (let i = 0; i < 100; i++) {
    stars.push({ x: random(width), y: random(height), size: random(1, 3), speed: random(0.5, 2) });
  }
}

// Displays and animates background stars
function displayStars() {
  fill(255);
  noStroke();
  stars.forEach((star) => {
    ellipse(star.x, star.y, star.size);
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
  });
}

// Checks for collisions between bullets, invaders, and player
function checkCollisions() {
  // Check for bullet collisions with invaders
  bullets = bullets.filter((bullet) => {
    return !invaders.some((invader) => {
      if (
        invader.isAlive &&
        bullet.x > invader.x &&
        bullet.x < invader.x + invader.width &&
        bullet.y > invader.y &&
        bullet.y < invader.y + invader.height
      ) {
        invader.isAlive = false;
        explosionSound.play(); // Play explosion sound
        score += 10;
        return true;
      }
      return false;
    });
  });

  // Check for asteroid collisions with the player
  asteroids.forEach((asteroid, index) => {
    if (
      asteroid.x < player.x + player.width &&
      asteroid.x + asteroid.size > player.x &&
      asteroid.y < player.y + player.height &&
      asteroid.y + asteroid.size > player.y
    ) {
      asteroidHitSound.play(); // Play asteroid hit sound
      asteroids.splice(index, 1);
      lives -= 1;
      if (lives <= 0) {
        gameState = 'gameover';
      }
    }
  });
}
