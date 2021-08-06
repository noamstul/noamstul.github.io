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
    if (evt.touches) { evt = evt.touches[0]; }
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
  function endDrag(evt) {
    function target (event) {
      // check if dropped on target
      if (event.target.id === 'target') {
        if (document.getElementById('english').innerHTML.toLowerCase() === selectedElement.classList[0]) {
        event.target.classList.add(selectedElement.classList[0])
        }
        if (!selectedElement.classList.contains('match')) {
          if (selectedElement.classList.contains(document.getElementById('english').innerHTML.toLowerCase())) {
            bowlImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "images/shell_versions/" + selectedElement.classList[0] + "_shell.png")
            selectedElement.classList.add('invisible')
          } else {
            selectedElement.setAttribute('transform', 'translate(30, 0)')
            wrong.style.visibility = 'visible'
            wrong.classList.add('fadeIn')
            wrong.classList.remove('fadeOut')
            setTimeout(() => {
              setTimeout(function(){ wrong.style.visibility = 'hidden' }, 1500);
              wrong.classList.add('fadeOut')
              wrong.classList.remove('fadeIn')
            }, 3000);
          }
        //
        } else if (selectedElement.classList.contains('match')) {
          //trigger smoke, and teaching popup
          match.setAttribute('transform', 'translate(0, -20)')
          flame.classList.add('invisible')
          if (event.target.classList.contains(document.getElementById('english').innerHTML.toLowerCase())) {
            console.log('worked')
            canvas2.style.display = 'block'
            party.addSmoke(1000,550,250)
            bowlImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "images/shell_empty.png")
            setTimeout(() => {
              canvas2.style.display = 'none'
              guessed++
              tittle.innerHTML = `<tspan id="english" class="english">${herbs[guessed]}</tspan>` + `<tspan class="dot"> ● </tspan>` + `<tspan id="algonquin" class="algonquin">${words[guessed]}</tspan>`
              console.log(guessed)
              let track = new Audio('audio/' + document.getElementById('english').innerHTML.toLowerCase() + '.mp3')
              track.play()
              if (guessed === 8) {
                instructions.style.visibility = 'visible'
                instructionText.style.visibility = 'hidden'
                altInstruction.style.visibility = 'visible'
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
const background = document.getElementById('background')
const tittle = document.getElementById('tittle')
const bowl = document.getElementById('bowl')
const bowlImage = document.getElementById('bowl-image')
const match = document.getElementById('match')
const matches = document.getElementById('matches')
const flame = document.querySelector('.container')
const audio = document.getElementById('audio')
const help =document.getElementById('help')
const wrong = document.getElementById('wrong-popup')
const instructions = document.getElementById('instructions')
const instructionText = document.getElementById('insttext')
const altInstruction = document.getElementById('insttext2')
const close = document.getElementById('close')
const restart = document.getElementById('restart')
const canvas2 = document.getElementById('canvas')
const english = document.getElementById('english')

var herbs = ['Pine', 'Mapleleaf', 'Sage', 'Sumac', 'Cedar', 'Tobacco', 'Sweetgrass', 'Mullein', 'Game']
let words = ['Shingàk', 'Ininatig anibish', 'Apabowashk', 'Kàgàgi minaganj', 'Kijik', 'Nasomà', 'Nòkwewashk', 'Kàwàbagikak-anibish', 'Over']
var guessed = 0
var rect = null
var empty = []
var h2 = []
tittle.innerHTML = `<tspan id="english" class="english">${herbs[guessed]}</tspan>` + `<tspan class="dot"> ● </tspan>` + `<tspan id="algonquin" class="algonquin">${words[guessed]}</tspan>`

//play first track

let firstTrack = new Audio('/audio/pine.mp3')
firstTrack.play()

//event listeners

match.addEventListener('mousedown', function() {
  flame.classList.remove('invisible')
})

match.addEventListener('mouseup', function() {
  flame.classList.add('invisible')
})


/*Audio button Event Listeners */

audio.addEventListener('mouseover', function() {
  document.getElementById('audio-inner').classList.add('button-hover')
})

audio.addEventListener('mouseleave', function() {
  document.getElementById('audio-inner').classList.remove('button-hover')
})

audio.addEventListener('click', function() {
  let english = document.getElementById('english')
  let track = new Audio('audio/' + english.innerHTML + '.mp3')
  track.play()
})

/*Help Button event listeners */

help.addEventListener('mouseover', function() {
  document.getElementById('help-inner').classList.add('button-hover')
})

help.addEventListener('mouseleave', function() {
  document.getElementById('help-inner').classList.remove('button-hover')
})

//fading-in included:
help.addEventListener('click', function() { 
  instructions.style.visibility = 'visible'
 
  instructions.classList.add('fadeIn')
  instructions.classList.remove('fadeOut')

})

close.addEventListener('mouseover', function() {
  document.getElementById('close-inner').classList.add('button-hover')
})

close.addEventListener('mouseleave', function() {
  document.getElementById('close-inner').classList.remove('button-hover')
})

//fading-out included:

close.addEventListener('click', function() {
  
  instructions.classList.remove('fadeIn')
  instructions.classList.add('fadeOut')

  setTimeout(function(){ instructions.style.visibility = 'hidden' }, 1500);
})


restart.addEventListener('mouseover', function() {
  document.getElementById('restart-inner').classList.add('button-hover')
})

restart.addEventListener('mouseleave', function() {
  document.getElementById('restart-inner').classList.remove('button-hover')
})

restart.addEventListener('click', function() {
  location.reload()
})

//eventlisteners for instruction text audio
document.getElementById('aPine').addEventListener('click', function(){
  let track = new Audio('audio/pine.mp3')
  track.play()
})

document.getElementById('aMapleleaf').addEventListener('click', function(){
  let track = new Audio('audio/mapleleaf.mp3')
  track.play()
})

document.getElementById('aSage').addEventListener('click', function(){
  let track = new Audio('audio/sage.mp3')
  track.play()
})

document.getElementById('aSumac').addEventListener('click', function(){
  let track = new Audio('audio/sumac.mp3')
  track.play()
})

document.getElementById('aCedar').addEventListener('click', function(){
  let track = new Audio('audio/cedar.mp3')
  track.play()
})

document.getElementById('aTobacco').addEventListener('click', function(){
  let track = new Audio('audio/tobacco.mp3')
  track.play()
})

document.getElementById('aSweetgrass').addEventListener('click', function(){
  let track = new Audio('audio/sweetgrass.mp3')
  track.play()
})

document.getElementById('aMullein').addEventListener('click', function(){
  let track = new Audio('audio/mullein.mp3')
  track.play()
})

//Smoke

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var party = SmokeMachine(ctx, [94,94,94])

party.start() // start animating


party.addSmoke(200,200,10) // wow we made smoke

setTimeout(function(){

    party.stop() // stop animating

    //party.addSmoke(1100,550,250)

    for(var i=0;i<10;i++){
        party.step(1) // pretend 10 ms pass and rerender
    }

    setTimeout(function(){
        party.start()
    },1000)

},1000)