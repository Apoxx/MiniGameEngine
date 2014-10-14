require('6to5/polyfill')
import Game from './Game'

var game = new Game()
document.body.appendChild(game.canvas)
game.start()