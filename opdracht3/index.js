var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d', { alpha: true })
var up = document.getElementById('up')
var down = document.getElementById('down')
var left = document.getElementById('left')
var right = document.getElementById('right')
var voice = document.getElementById('voice')
var cellSize = canvas.width / 20
var voiceInput = false
var currentScore = 0
var highScore = 0
var fps = 10

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
      this.xSpeed = this.xSpeed * -1
      this.ySpeed = this.ySpeed * -1
    }
  },

  show: function () {
    for (var i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, cellSize, cellSize)
    }
    ctx.fillRect(this.x, this.y, cellSize, cellSize)
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
  }
}

function setup () {
  canvas.width = 300
  canvas.height = 300
  ctx.font = '20px monospace'
  if (document.cookie) {
    if (document.cookie[document.cookie.length - 1] === undefined) {
      document.cookie = `highScore=0; path=/`
    }
  }
}

function draw () {
  setTimeout(function () {
    window.requestAnimationFrame(draw)
    if (document.cookie) {
      highScore = document.cookie[document.cookie.length - 1]
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (
      !(
        snake.x > fruit.x ||
        snake.x < fruit.x ||
        snake.y > fruit.y ||
        snake.y < fruit.y
      )
    ) {
      currentScore++
      fruit.getNewPos()
      snake.tail.push({ x: snake.x, y: snake.y })
      if (document.cookie) {
        if (currentScore > highScore) {
          document.cookie = `highScore=${currentScore}; path=/`
        }
      }
    }
    ctx.fillStyle = '#EC412F'
    fruit.show()
    ctx.fillStyle = '#000000'
    snake.update()
    snake.show()
    if (document.cookie) {
      ctx.fillText(`Score: ${currentScore}`, 5, 50)
      ctx.fillText(`HighScore: ${highScore}`, 5, 25)
    } else {
      ctx.fillText(`Score: ${currentScore}`, 5, 25)
    }
  }, 1000 / fps)
}

up.addEventListener('click', function () {
  fps = 10
  snake.move(0, -1)
})

down.addEventListener('click', function () {
  fps = 10
  snake.move(0, 1)
})

left.addEventListener('click', function () {
  fps = 10
  snake.move(-1, 0)
})

right.addEventListener('click', function () {
  fps = 10
  snake.move(1, 0)
})

function keyPressed (e) {
  if (voiceInput === false) {
    switch (e.keyCode) {
      case 38:
        fps = 10
        snake.move(0, -1)
        break
      case 40:
        fps = 10
        snake.move(0, 1)
        break
      case 37:
        fps = 10
        snake.move(-1, 0)
        break
      case 39:
        fps = 10
        snake.move(1, 0)
        break
    }
  }
}

document.onkeyup = keyPressed

if ('webkitSpeechRecognition' in window) {
  var recognition = new webkitSpeechRecognition()
  var speechRecognitionList = new webkitSpeechGrammarList()
  var grammarList = 'top | down | left | right'
  var grammar = `#JSGF V1.0; grammar directions; public <direction> = ${grammarList} ;`

  voice.disabled = false

  speechRecognitionList.addFromString(grammar, 1)
  recognition.grammars = speechRecognitionList
  recognition.interimResults = true
  recognition.continuous = true
  recognition.lang = 'en-US'

  voice.onclick = function () {
    if (voiceInput) {
      up.disabled = false
      down.disabled = false
      left.disabled = false
      right.disabled = false
      recognition.stop()
      voiceInput = false
    } else {
      fps = 5
      up.disabled = true
      down.disabled = true
      left.disabled = true
      right.disabled = true
      recognition.start()
      voiceInput = true
    }
  }

  recognition.onresult = function (event) {
    var latest = event.results.length - 1
    var guess = event.results[latest][0].transcript.trim().toLowerCase()

    switch (guess) {
      case 'top':
        snake.move(0, -1)
        break
      case 'down':
        snake.move(0, 1)
        break
      case 'left':
        snake.move(-1, 0)
        break
      case 'right':
        snake.move(1, 0)
    }
  }
}

setup()
draw()
