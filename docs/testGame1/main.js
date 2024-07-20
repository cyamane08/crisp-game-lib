title = "SNOW APPLE";
description = `
[Tap] Change direction
Collect apples
Avoid trees
`;

characters = [];

const G = {
	WIDTH: 100,
	HEIGHT: 150,
	PLAYER_SIZE: 5,
	TREE_WIDTH: 7,
	TREE_HEIGHT: 10,
	APPLE_RADIUS: 3
};

/** @type {{pos: Vector, swerveDirection: number, speed: number}} */
let player;

/** @type {{pos: Vector}[]} */
let trees;

/** @type {{pos: Vector}[]} */
let apples;

const swerveSpeed = 0.5;
const spawnDistance = 20;
let nextSpawnY;

function update() {
	if (!ticks) {
		player = {
			pos: vec(G.WIDTH / 2, G.HEIGHT - 10),
			swerveDirection: 1,
			speed: 1
		};
		trees = [];
		apples = [];
		nextSpawnY = -spawnDistance;
	}

	// Update player position
	player.pos.y -= player.speed;
	player.pos.x += player.swerveDirection * swerveSpeed;
	player.pos.x = clamp(player.pos.x, 0, G.WIDTH - 1);

	// Handle input
	if (input.isJustPressed) {
		player.swerveDirection *= -1;
		play("select");
	}

	// Spawn new objects
	while (player.pos.y < nextSpawnY + G.HEIGHT) {
		spawnObjects();
		nextSpawnY -= spawnDistance;
	}

	// Draw background
	color("light_cyan");
	rect(0, 0, G.WIDTH, G.HEIGHT);

	// Draw and check collisions
	color("blue");
	const playerCollision = box(player.pos, G.PLAYER_SIZE);

	color("green");
	trees = trees.filter(tree => {
		tree.pos.y += player.speed;
		if (box(tree.pos, G.TREE_WIDTH, G.TREE_HEIGHT).isColliding.rect.blue) {
			play("explosion");
			end();
		}
		return tree.pos.y < G.HEIGHT + G.TREE_HEIGHT;
	});

	color("red");
	remove(apples, (apple) => {
		apple.pos.y += player.speed;
		if (arc(apple.pos, G.APPLE_RADIUS).isColliding.rect.blue) {
			play("coin");
			addScore(1);
			return true;
		}
		return apple.pos.y > G.HEIGHT + G.APPLE_RADIUS;
	});

	// Increase difficulty
	player.speed += 0.0005;
}

function spawnObjects() {
	trees.push({ pos: vec(rnd(10, G.WIDTH - 10), nextSpawnY) });
	if (rnd() < 0.7) {
		apples.push({ pos: vec(rnd(10, G.WIDTH - 10), nextSpawnY) });
	}
}