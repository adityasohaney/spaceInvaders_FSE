import pygame
import random

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 600, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Space Invaders")

# Colors
WHITE = (255, 255, 255)
RED = (255, 0, 0)
BLACK = (0, 0, 0)
BLUE = (20, 20, 100)
DARK_RED = (100, 0, 0)

# Global variables
player = None
bullets = []
invaders = []
astroids = []
stars = []

# Game settings
invader_width = 40
invader_height = 20
invader_speed = 1
direction = 1

# Game state variables
score = 0
lives = 3
game_state = 'menu'
difficulty = 1
shooting = False
shoot_interval = 15
frame_since_last_shot = 0
level = 1
game_over_played = False

# Load assets
spaceship_img = pygame.image.load('Spaceship.jpg')
alien_img = pygame.image.load('Alien.jpg')
shoot_sound = pygame.mixer.Sound('shoot.wav')
explosion_sound = pygame.mixer.Sound('explosion.wav')
asteroid_hit_sound = pygame.mixer.Sound('asteroidHit.wav')
game_over_sound = pygame.mixer.Sound('gameover.wav')

# Blend white background function
def blend_white_background(img):
    img = img.convert_alpha()
    for x in range(img.get_width()):
        for y in range(img.get_height()):
            r, g, b, a = img.get_at((x, y))
            if r > 200 and g > 200 and b > 200:
                img.set_at((x, y), (r, g, b, 0))
    return img

spaceship_img = blend_white_background(spaceship_img)
alien_img = blend_white_background(alien_img)

# Game objects
def create_player():
    return {"x": WIDTH // 2, "y": HEIGHT - 40, "width": 40, "height": 40, "speed": 5}

def create_invader():
    return {
        "x": random.randint(50, WIDTH - 50),
        "y": random.randint(10, HEIGHT // 2),
        "width": invader_width,
        "height": invader_height,
        "is_alive": True
    }

# Draw menu
def draw_menu():
    screen.fill(BLUE)
    font = pygame.font.Font(None, 50)
    title = font.render("SPACE INVADERS", True, WHITE)
    screen.blit(title, (WIDTH // 2 - title.get_width() // 2, HEIGHT // 4))

    font = pygame.font.Font(None, 30)
    options = ["Press 1 for Easy", "Press 2 for Medium", "Press 3 for Hard"]
    for i, option in enumerate(options):
        text = font.render(option, True, WHITE)
        screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - 20 + i * 40))

# Game loop
running = True
clock = pygame.time.Clock()
player = create_player()

while running:
    screen.fill(BLACK)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if game_state == 'menu':
                if event.key == pygame.K_1:
                    difficulty = 1
                    game_state = 'playing'
                elif event.key == pygame.K_2:
                    difficulty = 2
                    game_state = 'playing'
                elif event.key == pygame.K_3:
                    difficulty = 3
                    game_state = 'playing'

    if game_state == 'menu':
        draw_menu()

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
