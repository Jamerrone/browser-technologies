var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d', { alpha: true })

var up = document.getElementById('up')
var down = document.getElementById('down')
var left = document.getElementById('left')
var right = document.getElementById('right')
var voice = document.getElementById('voice')

var cellSize = canvas.width / 20

var snake = {
  x: 10 * cellSize,
  y: 10 * cellSize,
  xSpeed: 0,
  ySpeed: 0,
  tail: [],

  move: function (x, y) {
    this.xSpeed = x
    this.ySpeed = y
  },

  update: function () {
    for (var i = 0; i < this.tail.length - 1; i++) {
      this.tail[i].x = this.tail[i + 1].x || this.x
      this.tail[i].y = this.tail[i + 1].y || this.y
    }

    if (this.tail.length > 0) {
      this.tail[this.tail.length - 1].x = this.x
      this.tail[this.tail.length - 1].y = this.y
    }

    this.x = this.x + this.xSpeed * cellSize
    this.y = this.y + this.ySpeed * cellSize

    if (
      this.x > canvas.width - cellSize ||
      this.x < 0 ||
      this.y > canvas.height - cellSize ||
      this.y < 0
    ) {
      // snake.death()
      this.xSpeed = this.xSpeed * -1
      this.ySpeed = this.ySpeed * -1
    }
  },

  death: function () {
    this.x = 10 * cellSize
    this.y = 10 * cellSize
    this.xSpeed = 0
    this.ySpeed = 0
    this.tail = []
    fruit.getNewPos()
  },

  show: function () {
    for (var i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, cellSize, cellSize)
    }
    ctx.fillRect(this.x, this.y, cellSize, cellSize)
    ctx.fillStyle = 'tomato'
  }
}

var fruit = {
  x: Math.floor(Math.random() * 20 + 1) * cellSize - cellSize,
  y: Math.floor(Math.random() * 20 + 1) * cellSize - cellSize,

  getNewPos: function () {
    this.x = Math.floor(Math.random() * 20 + 1) * cellSize - cellSize
    this.y = Math.floor(Math.random() * 20 + 1) * cellSize - cellSize
  },

  show: function () {
    ctx.fillRect(this.x, this.y, cellSize, cellSize)
    ctx.fillStyle = '#000000'
  }
}

function setup () {
  canvas.width = 300
  canvas.height = 300
}

function draw () {
  setTimeout(function () {
    window.requestAnimationFrame(draw)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (
      !(
        snake.x > fruit.x ||
        snake.x < fruit.x ||
        snake.y > fruit.y ||
        snake.y < fruit.y
      )
    ) {
      snake.tail.push({ x: snake.x, y: snake.y })
      fruit.getNewPos()
    }
    snake.update()
    snake.show()
    fruit.show()
  }, 1000 / 5)
}

up.addEventListener('click', function () {
  snake.move(0, -1)
})

down.addEventListener('click', function () {
  snake.move(0, 1)
})

left.addEventListener('click', function () {
  snake.move(-1, 0)
})

right.addEventListener('click', function () {
  snake.move(1, 0)
})

function keyPressed (e) {
  if (e.keyCode === 38) {
    snake.move(0, -1)
  } else if (e.keyCode === 40) {
    snake.move(0, 1)
  } else if (e.keyCode === 37) {
    snake.move(-1, 0)
  } else if (e.keyCode === 39) {
    snake.move(1, 0)
  }
}

document.onkeyup = keyPressed

setup()
draw()

if ('webkitSpeechRecognition' in window) {
  var grammar =
    '#JSGF V1.0; grammar directions; public <direction> = top | down | left | right ;'

  var recognition = new webkitSpeechRecognition()
  var speechRecognitionList = new webkitSpeechGrammarList()

  speechRecognitionList.addFromString(grammar, 1)
  recognition.grammars = speechRecognitionList
  recognition.interimResults = true
  recognition.continuous = true
  recognition.lang = 'en-US'

  voice.onclick = function () {
    recognition.start()
  }

  recognition.onresult = function (event) {
    var last = event.results.length - 1
    var guess = event.results[last][0].transcript.trim().toLowerCase()

    console.log(guess.trim())
    if (guess === 'top') {
      snake.move(0, -1)
    } else if (guess === 'down') {
      snake.move(0, 1)
    } else if (guess === 'left') {
      snake.move(-1, 0)
    } else if (guess === 'right') {
      snake.move(1, 0)
    }
  }

  recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error)
  }
}
