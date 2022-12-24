const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.8


const background = new Sprite({
  position: {
    x: 0,
    y: 1
  },
  imageSrc: './images/city.png',
  scale: 2.1
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },  
  imageSrc: './images/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './images/Goblin/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 100,
    y: 100
  },
  sprites: {
    idle: {
      imageSrc: './images/Goblin/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './images/Goblin/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './images/Goblin/Idle.png',
      framesMax: 4
    },
    fall:{
      imageSrc: './images/Goblin/Idle.png',
      framesMax: 4
    },
    attack1:{
      imageSrc: './images/Goblin/Attack.png',
      framesMax: 8
    },
    takeHit:{
      imageSrc: './images/Goblin/Take Hit.png',
      framesMax: 4
    },
    death:{
      imageSrc: './images/Goblin/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 155,
    height: 50

  }
})

const enemy = new Fighter({
  position: {
    x: 900,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './images/skeleton/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 169
  },
  sprites: {
    idle: {
      imageSrc: './images/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './images/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './images/kenji/Jump.png',
      framesMax: 2
    },
    fall:{
      imageSrc: './images/kenji/Fall.png',
      framesMax: 2
    },
    attack1:{
      imageSrc: './images/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit:{
      imageSrc: './images/kenji/Take hit.png',
      framesMax: 3
    },
    death:{
      imageSrc: './images/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x:-170,
      y: 50
    },
    width: 170,
    height: 50

  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }

}



let timer = 60
let timerId

function decreaseTimer() {

  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer -= 1
    document.querySelector('.timer').innerHTML = timer
  }

  if (timer <= 0) {
    determineWinner({
      player,
      enemy,
      timerId
    })

  }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  // shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0 , canvas.width, canvas.height)
  player.update()
  enemy.update()


  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  }else{
      player.switchSprite('idle')
  }

// jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  }else if (player.velocity.y >0) {
player.switchSprite('fall')
  }
  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5
      enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else{
    enemy.switchSprite('idle')
  }

  // jumping
    if (enemy.velocity.y < 0) {
      enemy.switchSprite('jump')
    }else if (enemy.velocity.y >0) {
  enemy.switchSprite('fall')
    }
  // detect for collision && enemy is hit
  if (rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking && player.framesCurrent === 4) {
      enemy.takeHit()
    player.isAttacking = false
    // document.querySelector('.health-reduction').style.width = enemy.health + '%'
    gsap.to('.health-reduction', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if(player.isAttacking && player.framesCurrent === 4 ){
    player.isAttacking = false
  }

// this is where our player gets hit


  if (rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2 ) {
      player.takeHit()
    enemy.isAttacking = false
    // player.health -= 20
    // document.querySelector('.player-health-reduction').style.width = player.health + '%'
    gsap.to('.player-health-reduction', {
      width: player.health + '%'
    })
  }
  // if enemy misses
  if(enemy.isAttacking && enemy.framesCurrent === 2 ){
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({
      player,
      enemy,
      timerId
    })
  }
}
animate()

window.addEventListener('keydown', function(e) {
  if(!player.dead){

  switch (e.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break;

    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break;

    case 'w':
      player.velocity.y = -20
      lastKey = 'w'
      break;

    case ' ':
      player.attack();
      break;

  }
}
  if(!enemy.dead){
  switch (e.key){
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break;

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break;

    case 'ArrowUp':
      enemy.velocity.y = -20
      lastKey = 'ArrowUp'
      break;

    case 'ArrowDown':
      enemy.attack();
      break;

    default:

  }
}
})
window.addEventListener('keyup', function(e) {
  switch (e.key) {
    case 'd':
      keys.d.pressed = false
      break;

    case 'a':
      keys.a.pressed = false
      break;

    case 'w':
      keys.w.pressed = false
      break;
  }

  // enemy keys
  switch (e.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;

    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break;
  }
})
