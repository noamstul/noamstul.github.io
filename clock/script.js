// Adding in my HTML structure using JS
document.querySelector('body').insertAdjacentHTML('afterbegin', `
    <div id="container">
        <div id="inner-container">   
            <h1 id="greeting"></h1>
            <div id="clock" data-aos="fade-down-right" data-aos-delay="300"></div>
            <div id="more-info"></div
            <div id="display-more">
                <label class="switch" id="show-more">
                    <input type="checkbox" id="more">
                    <span class="slider round"></span>
                </label>
                <p id="instructions">Show More</p>
            </div>
        </div>
    </div>
    <button id="sidebar-toggle">|||</button>
    <div id="settings"></div>
`)

// Targeting the DOM
const $container = document.getElementById('container')
const $innerContainer = document.getElementById('inner-container')
let $greeting = document.getElementById('greeting')
let $clock = document.getElementById('clock')
const $settings = document.getElementById('settings')
let $sidebarToggle = document.getElementById('sidebar-toggle')
let $moreInfo = document.getElementById('more-info')
const $instructions = document.getElementById('instructions')

 //constructing the settings panel

 $settings.innerHTML = `
    <div id="setting1">
        <p>Dark Mode</p>
        <label class="switch">
            <input type="checkbox" id="dark-mode">
            <span class="slider round"></span>
        </label>
    </div>
    <div id="setting2"
        <p>Retro Mode</p>
        <label class="switch">
            <input type="checkbox" id="old-mode">
            <span class="slider round"></span>
        </label>
    </div>

 `
 //creating the dark mode and old mode options, and storing settings in local storage

 let $darkMode = document.getElementById('dark-mode')

 let $oldMode = document.getElementById('old-mode')


if (localStorage.getItem('userSettings')) {
    
    const $userSettings = JSON.parse(localStorage.getItem('userSettings'))
    if ($userSettings.darkmode === true) {
        $darkMode.checked = true
        $innerContainer.classList.add('dark-display')
    } else if ($userSettings.darkmode === false) {
        $innerContainer.classList.add('light-display')
    }

    if ($userSettings.oldMode === true) {
        $oldMode.checked = true
        $innerContainer.classList.add('old-school')
    } else if ($userSettings.oldMode === false) {
        $innerContainer.classList.add('new-school')
    }
} else {
    $innerContainer.classList.add('light-display')
    $innerContainer.classList.add('new-school')
}

// Retrieving the Nasa APOD, and checking to see if the url contains a Youtube link. if it does, we display the file-not-found.jpg, which is just a space picture sourced from https://www.pexels.com/photo/adventure-cold-conifers-evening-572897/

fetch('https://api.nasa.gov/planetary/apod?api_key=QbVX56uPFKW6VEaAOdVIis8JrTe2vHkUURixqm9q')
    .then(response => {
        return response.json()
    })
    .then(data => {
        let substring = data.url.substring(8, 21)
        if (substring !== 'apod.nasa.gov') {
            $container.style.backgroundImage = `url(/images/file-not-found.jpg)`;
            $container.style.color = 'black'
        } else {
            $container.style.backgroundImage = `url(${data.url})`
        }
    })
    .catch(error => {
        console.log(error.name, error.message)
    })



 //Setting today's date and time, and creating the clock

 let dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

 let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// I referenced this article when building out the clock, but only used the idea of the conditional statement to evaluate the AM/PM display, and the idea of concatenation to add 0's to the clock with there would only be single digits, but I used if statements and not the ternary operator:
//https://www.studytonight.com/post/build-a-simple-digital-clock-with-javascript#

 setInterval(function(){
    let now = new Date()
    let hours = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    let period = 'AM'
    if (hours == 0) {
        hours = 12
    } else if (hours >= 12) {
        period = 'PM'
    }
    
    if (hours > 12) {
        hours = hours - 12
    }

    if (hours < 10) {
        hours = '0' + hours
    }

    if (minutes < 10) {
        minutes = '0' + minutes
    }

    if (seconds < 10) {
        seconds = '0' + seconds
    }
    $clock.innerHTML = `
        <div id="time">
            <div id="hours">${hours}:</div>
            <div id="minutes">${minutes}:</div>
            <div id="seconds">${seconds}</div>
            <div id="period">${period}</div>
        </div>

        <div id="date">  
            <div id="weekday">${dayOfWeek[now.getDay()]},</div>
            <div id="month">${months[now.getMonth()]}</div>
            <div id="day-of-month">${now.getDate()}</div>
        </div>
    
        `   
 }, 1000)

 // setting the greeting to dynamically display different greetings depending on the time of day. It will also update every second
setInterval(function(){
    let now = new Date()

    if (now.getHours() >= 4 && now.getHours() < 12) {
        $greeting.textContent = 'Good Morning'
    } else if (now.getHours() >= 12 && now.getHours() < 17) {
        $greeting.textContent = 'Good Afternoon'
    } else {
        $greeting.textContent = 'Good Evening'
    }

}, 1000) 

 //targeting the show more button to reveal additional info

 let $showMore = document.getElementById('more')

 function moreInfo() {
    let now = new Date() 
    $moreInfo.innerHTML = `
        <div id="year">${now.getFullYear()},</div>
        <div id="timezone">UTC-${now.getTimezoneOffset() / 60}</div>
    `
 }

 $showMore.addEventListener('change', function(){
    if ($showMore.checked) {
        moreInfo()
        $instructions.textContent = 'Show Less'
    } else if ($showMore.checked === false) {
        $moreInfo.innerHTML = ``
        $instructions.textContent = 'Show More'
    }
 })



//turning on the hamburger button for the settings panel

let menuToggle = false

$sidebarToggle.addEventListener('click', function(){

    if (menuToggle === false) {
        $settings.style.display = 'block'
        menuToggle = true
    } else if (menuToggle === true) {
        $settings.style.display = 'none'
        menuToggle = false
    }
    
})




// gives us on / off switch for the dark mode option, using the change event
$darkMode.addEventListener('change', function(){
    
    if ($darkMode.checked) {
        $innerContainer.classList.add('dark-display')
        $innerContainer.classList.remove('light-display')
    } else if ($darkMode.checked === false) {
        $innerContainer.classList.add('light-display')
        $innerContainer.classList.remove('dark-display')
    }

    let settingToStore = {
        darkmode: $darkMode.checked,
        oldMode: $oldMode.checked
    }

    localStorage.setItem('userSettings', JSON.stringify(settingToStore))
})



//creating the old school mode option, and storing the settings in local storage



$oldMode.addEventListener('change', function(){

    if($oldMode.checked) {
        $innerContainer.classList.add('old-school')
        $innerContainer.classList.remove('new-school')
    } else if ($oldMode.checked === false) {
        $innerContainer.classList.add('new-school')
        $innerContainer.classList.remove('old-school')
    }

    let settingToStore = {
        darkmode: $darkMode.checked,
        oldMode: $oldMode.checked
    }

    localStorage.setItem('userSettings', JSON.stringify(settingToStore))
})

