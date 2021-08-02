/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
/* First, I created the game object, which contains all of the necessary data for our game. The created object takes care of saving the game to local storage. The methods take care of all of the game functions. */
const app = Vue.createApp({
  data: function() {
    return {
      max: 3,
      game: {
        active: false,
        message: 'Unscramble the word',
        points: 0,
        strikes: 0,
        passes: 3,
        guess: '',
        target: '',
        word: '',
        words: ['apple', 'banana', 'cherry', 'strawberry', 'guava', 'watermelon', 'kiwi', 'cantaloupe', 'pineapple', 'orange']
      }
    }
  },
  created: function() {
    const game = localStorage.getItem('game')
    
    if (game) {
      this.game = JSON.parse(game)
    }
  },
  methods: {
    /*This function finds the index of the current target, and removes the word from the words array using the splice method */
    removeWord: function() {
      let removeWord = this.game.words.indexOf(this.game.target)
      this.game.words.splice(removeWord, 1)
    },
    /*Using the provided shuffle function, we select a random word from the array and scramble it. */
    randomizeTarget: function() {
      this.game.target = this.game.words[Math.floor(Math.random() * this.game.words.length)]
      this.game.word = shuffle(this.game.target)
    },
    /* Not strictly necessary, but I liked the idea of a start game page. It only exists the first time the user plays the game */
    playGame: function() {
      this.game.active = true
      this.randomizeTarget()
    }, 
    /* the pass function removes one of the players passes, removes the current word, and randomizes a new word. The 3 pass limit is done using v-bind to disable the button when passes is 0 */
      pass: function() {
      this.game.passes--
      this.removeWord()
      this.randomizeTarget()
    }, 
    /*This function handles the guess verification. if its correct, points increase, then it checks if the player has 10 points (win condition). if not, it moves to the next random word. If it's wrong, it adds a strike, and the player gets notified about the error. */
    verifyGuess: function() {
        if (this.game.guess === this.game.target) {
          this.game.points++
          if (this.game.points >= 10) {
            this.game.message = 'You Win!'
          } else {
            this.game.message = 'Correct! On to the next one...'
            this.removeWord()
            this.randomizeTarget()
          }
        } else {
          this.game.strikes++
          if (this.game.strikes === 3) {
            this.game.message = 'You lose!'
          } else {
              this.game.message = 'Wrong! Guess again'
          }
        }
        this.game.guess = ''
    }, 
    /* reset game clears everything, but doesn't set the game.active to false, so that the user can simply start playing again without seeing the landing screen. */
    resetGame: function() {
      this.game.guess = ''
      this.game.message = 'resetting game...'
      const that = this
      setTimeout(function() {
          that.game.points = 0
          that.game.strikes = 0
          that.game.passes = 3
          that.game.words = ['apple', 'banana', 'cherry', 'strawberry', 'guava', 'watermelon', 'kiwi', 'cantaloupe', 'pineapple', 'orange']
          that.randomizeTarget() 
          that.game.message = 'Unscramble the word'
      }, 2000)
  }
  },
  /* the watcher for the game object, which allows for saving to local storage. */
  watch: {
    game: {
      deep: true,
      handler: function (game) {
        localStorage.setItem('game', JSON.stringify(game))
      }
    }
  }
})

const vm = app.mount('#app')