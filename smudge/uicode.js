function makeDraggable(evt) {
  var svg = evt.target;
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);
  svg.addEventListener('touchstart', startDrag);
  svg.addEventListener('touchmove', drag);
  svg.addEventListener('touchend', endDrag);
  svg.addEventListener('touchleave', endDrag);
  svg.addEventListener('touchcancel', endDrag);

  function getMousePosition(evt) {
    var CTM = svg.getScreenCTM();
    if (evt.touches) {
      evt = evt.touches[0];
    }
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }
  var selectedElement, offset, transform;

  function initialiseDragging(evt) {
    offset = getMousePosition(evt);
    // Make sure the first transform on the element is a translate transform
    var transforms = selectedElement.transform.baseVal;
    if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      // Create an transform that translates by (0, 0)
      var translate = svg.createSVGTransform();
      translate.setTranslate(0, 0);
      selectedElement.transform.baseVal.insertItemBefore(translate, 0);
    }
    // Get initial translation
    transform = transforms.getItem(0);
    offset.x -= transform.matrix.e;
    offset.y -= transform.matrix.f;
  }

  function startDrag(evt) {
    if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      initialiseDragging(evt);
    } else if (evt.target.parentNode.classList.contains('draggable-group')) {
      selectedElement = evt.target.parentNode;
      initialiseDragging(evt);
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(evt);
      transform.setTranslate(coord.x - offset.x, coord.y - offset.y);

    }
  }
  // this is where all the game logic resides
  function endDrag(evt) {
    function target(event) {
      // check if dropped on target
      if (event.target.id === 'target') {
        // if the english word matches the selected element's first class (all herbs have their name as their first class)
        if (document.getElementById('english').innerHTML.toLowerCase() === selectedElement.classList[0]) {
          // the bowl having the herb's class will be relevant later
          event.target.classList.add(selectedElement.classList[0])
        }
        // if the selected element is NOT the match
        if (!selectedElement.classList.contains('match')) {
          // AND if the selected element's class matches the current english word
          if (selectedElement.classList.contains(document.getElementById('english').innerHTML.toLowerCase())) {
            // Dynamically sets the image of the shell to be that with the added herb inside
            bowlImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "images/shell_versions/" + selectedElement.classList[0] + "_shell.png")
            //sets the selected herb to invisible
            selectedElement.classList.add('invisible')
          }
          // If the herb wasn't correct, it gets sent back to its starting location, and the girl will pop up telling the user it was incorrect
          else {
            selectedElement.setAttribute('transform', 'translate(30, 0)')
            wrong.style.visibility = 'visible'
            wrong.classList.add('fadeIn')
            wrong.classList.remove('fadeOut')
            setTimeout(() => {
              setTimeout(function () {
                wrong.style.visibility = 'hidden'
              }, 1500);
              wrong.classList.add('fadeOut')
              wrong.classList.remove('fadeIn')
            }, 3000);
          }
        }
        // if the element was the match
        else if (selectedElement.classList.contains('match')) {
          //first, move the match back up so it's not lost behind the invisible circle
          match.setAttribute('transform', 'translate(0, -20)')
          //set the fire back to invisible
          flame.classList.add('invisible')
          // if the invisible circle has the class that matches the current english word, which it could only get by the correct herb being placed on it
          if (event.target.classList.contains(document.getElementById('english').innerHTML.toLowerCase())) {
            // trigger the smoke
            canvas2.style.display = 'block'
            party.addSmoke(shellPositionX, shellPositionY, 250)
            // set the bowl back to empty
            bowlImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "images/shell_empty.png")
            // all of this is in a set timeout so that the smoke has time to resolve
            setTimeout(() => {
              // hide the canvas again
              canvas2.style.display = 'none'
              //add a point to the win condition
              guessed++
              // remove the randomly selected herb and word 
              herbs.splice(randomNumber, 1)
              words.splice(randomNumber, 1)
              // generate a new randomnumber for the game
              randomNum()
              randomNumber = randomNum()
              // dynamically set the words to the new herb and algonquin word
              tittle.innerHTML = `<tspan id="english" class="english">${herbs[randomNumber]}</tspan>` + `<tspan class="dot"> ● </tspan>` + `<tspan id="algonquin" class="algonquin">${words[randomNumber]}</tspan>`
              // play the audio of the new word
              let track = new Audio('audio/' + document.getElementById('english').innerHTML.toLowerCase() + '.mp3')
              track.play()
              // If the player has gotten 8 points, set the text to Game Over, and display the popup screen WITHOUT a close button
              if (guessed === 8) {
                tittle.innerHTML = `<tspan id="english" class="english">Game</tspan>` + `<tspan class="dot"> ● </tspan>` + `<tspan id="algonquin" class="algonquin">Over</tspan>`
                instructions.style.visibility = 'visible'
                instructionText.style.visibility = 'hidden'
                altInstruction.style.visibility = 'visible'
                closeButton.style.visibility = 'hidden'
              }
            }, 6000);
          }
        }
      }
    }

    target(evt)

    selectedElement = false;
  }
}

// objects define
// the background of the game
const background = document.getElementById('background')
// the words, consisting of the english and the algonquin
const tittle = document.getElementById('tittle')
// the shell
const bowl = document.getElementById('bowl')
// the shell's image
const bowlImage = document.getElementById('bowl-image')
// the match
const match = document.getElementById('match')
// the fire on the match
const flame = document.querySelector('.container')
// the audio button
const audio = document.getElementById('audio')
// the help button
const help = document.getElementById('help')
// the girl who pops up to tell the player they got the wrong herb
const wrong = document.getElementById('wrong-popup')
// the instructions
const instructions = document.getElementById('instructions')
// the text of the instruction box
const instructionText = document.getElementById('insttext')
// the text displayed when the player has won the game
const altInstruction = document.getElementById('insttext2')
// the close button for the instructions
const closeButton = document.getElementById('close')
// the restart button in the instructions window
const restart = document.getElementById('restart')
// the canvas for the smoke
const canvas2 = document.getElementById('canvas')
// the english text
const english = document.getElementById('english')
// the location of the shell, in order to dynamically set the smoke location
let shellPositionX = document.getElementById('bowl').getBoundingClientRect().x + 250
let shellPositionY = document.getElementById('bowl').getBoundingClientRect().y + 250
// the arrays of english and algonquin words
var herbs = ['Pine', 'Mapleleaf', 'Sage', 'Sumac', 'Cedar', 'Tobacco', 'Sweetgrass', 'Mullein']
let words = ['Shingàk', 'Ininatig anibish', 'Apabowashk', 'Kàgàgi minaganj', 'Kijik', 'Nasomà', 'Nòkwewashk', 'Kàwàbagikak-anibish']
//generating and setting a random number to randomly decide the order of the herbs
let randomNumber = randomNum()

function randomNum() {
  return Math.floor((Math.random() * (herbs.length - 1)))
}

// the guessed variable keeps track of how many herbs that player has correctly guessed. When it reaches 8, the game ends.

let guessed = 0

//set the text
tittle.innerHTML = `<tspan id="english" class="english">${herbs[randomNumber]}</tspan>` + `<tspan class="dot"> ● </tspan>` + `<tspan id="algonquin" class="algonquin">${words[randomNumber]}</tspan>`

//fade the instructions out
setTimeout(() => {
  document.getElementById('startInstructions').classList.add('fadeOut')
}, 4500);

setTimeout(() => {
  document.getElementById('startInstructions').style.visibility = 'hidden'
}, 6000);

//play first track. Chrome has issues with playing audio when a page loads.

let firstTrack = new Audio('/audio/' + document.getElementById('english').innerHTML.toLowerCase() + '.mp3')
firstTrack.play()

//event listeners

match.addEventListener('mousedown', function () {
  flame.classList.remove('invisible')
})

match.addEventListener('mouseup', function () {
  flame.classList.add('invisible')
})


/*Audio button Event Listeners */
// hover effects
audio.addEventListener('mouseover', function () {
  document.getElementById('audio-inner').classList.add('button-hover')
})

audio.addEventListener('mouseleave', function () {
  document.getElementById('audio-inner').classList.remove('button-hover')
})
// plays the current word's audio track
audio.addEventListener('click', function () {
  let english = document.getElementById('english')
  let track = new Audio('audio/' + english.innerHTML.toLowerCase() + '.mp3')
  track.play()
})

/*Help Button event listeners */

help.addEventListener('mouseover', function () {
  document.getElementById('help-inner').classList.add('button-hover')
})

help.addEventListener('mouseleave', function () {
  document.getElementById('help-inner').classList.remove('button-hover')
})

//fading-in included:
help.addEventListener('click', function () {
  instructions.style.visibility = 'visible'

  instructions.classList.add('fadeIn')
  instructions.classList.remove('fadeOut')

})

closeButton.addEventListener('mouseover', function () {
  document.getElementById('close-inner').classList.add('button-hover')
})

closeButton.addEventListener('mouseleave', function () {
  document.getElementById('close-inner').classList.remove('button-hover')
})

//fading-out included:

closeButton.addEventListener('click', function () {

  instructions.classList.remove('fadeIn')
  instructions.classList.add('fadeOut')

  setTimeout(function () {
    instructions.style.visibility = 'hidden'
  }, 1500);
})


restart.addEventListener('mouseover', function () {
  document.getElementById('restart-inner').classList.add('button-hover')
})

restart.addEventListener('mouseleave', function () {
  document.getElementById('restart-inner').classList.remove('button-hover')
})

restart.addEventListener('click', function () {
  location.reload()
})

//eventlisteners for instruction text audio
document.getElementById('aPine').addEventListener('click', function () {
  let track = new Audio('audio/pine.mp3')
  track.play()
})

document.getElementById('aMapleleaf').addEventListener('click', function () {
  let track = new Audio('audio/mapleleaf.mp3')
  track.play()
})

document.getElementById('aSage').addEventListener('click', function () {
  let track = new Audio('audio/sage.mp3')
  track.play()
})

document.getElementById('aSumac').addEventListener('click', function () {
  let track = new Audio('audio/sumac.mp3')
  track.play()
})

document.getElementById('aCedar').addEventListener('click', function () {
  let track = new Audio('audio/cedar.mp3')
  track.play()
})

document.getElementById('aTobacco').addEventListener('click', function () {
  let track = new Audio('audio/tobacco.mp3')
  track.play()
})

document.getElementById('aSweetgrass').addEventListener('click', function () {
  let track = new Audio('audio/sweetgrass.mp3')
  track.play()
})

document.getElementById('aMullein').addEventListener('click', function () {
  let track = new Audio('audio/mullein.mp3')
  track.play()
})

//Smoke effect

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var party = SmokeMachine(ctx, [94, 94, 94, 0.5])

party.start() // start animating


party.addSmoke(200, 200, 10) // wow we made smoke

setTimeout(function () {

  party.stop() // stop animating

  //party.addSmoke(1100,550,250)

  for (var i = 0; i < 10; i++) {
    party.step(1) // pretend 10 ms pass and rerender
  }

  setTimeout(function () {
    party.start()
  }, 1000)

}, 1000)