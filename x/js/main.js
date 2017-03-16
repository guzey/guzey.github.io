var canvas = document.getElementById('gameCanvas')
var ctx = canvas.getContext('2d')
ctx.textBaseline = 'middle'

var height = window.innerHeight
var width = window.innerWidth
ctx.canvas.width = width
ctx.canvas.height = width * 1.3
var isRunning = true
var endGame = false

var wordPadding
var lineSpeed = height * 0.00006
var lineCount
var lineHeight
var lineOffsetLeft
var linePadding = lineHeight * 0.5
var lineOffsetTop = lineHeight * 1.25

// will keep track of the word that is currently the first one that is shown
var firstWord
var lastWordL = 0
var lastWordW = 0

var words
var wordsInRow

var openMenuButton = document.getElementById('openMenuButton')
var YButton = document.getElementById('YButton')
var XButton = document.getElementById('XButton')
var menuButtons

// tfw when you realize js doesn't support modules yet
// [text, max_lines, max_time]
var l0 = ['RAPIDLY'.split(' '), 1]
var l1 = ['PRESS'.split(' '), 1]
var l2 = ['X'.split(' '), 1]
var l3 = ['TO'.split(' '), 1]
var l4 = ['REFUSE'.split(' '), 1]
var l5 = ['TO'.split(' '), 1]
var l6 = ['COME'.split(' '), 1]
var l7 = ['TO'.split(' '), 1]
var l8 = ['TERMS'.split(' '), 1]
var l9 = ['WITH'.split(' '), 1]
var l10 = ['YOUR'.split(' '), 1]
var l11 = ['OWN'.split(' '), 1]
var l12 = ['MORTALITY'.split(' '), 1]
var l16 = ['Death is not real.'.split(' '), 1]
var l19 = ['Death is not real.'.split(' '), 18, 15]
var l20 = ['Death'.split(' '), 1]
var l21 = ['is'.split(' '), 1]
var l22 = ['not'.split(' '), 1]
var l23 = ['real.'.split(' '), 1]
var l24 = ['oh.'.split(' '), 1]
var l25 = ['ok.'.split(' '), 1]
var l26 = ['maybe'.split(' '), 1]
var l27 = ['it'.split(' '), 1]
var l28 = ['is.'.split(' '), 1]
var l30 = ['but'.split(' '), 1]
var l31 = ['We will solve death.'.split(' '), 1]
var l32 = ['We will solve death.'.split(' '), 18, 15]
var l33 = ['We'.split(' '), 1]
var l34 = ['will'.split(' '), 1]
var l35 = ['solve'.split(' '), 1]
var l36 = ['death'.split(' '), 1]
var l37 = ['well.'.split(' '), 1]
var l38 = ['ok.'.split(' '), 1]
var l39 = ['maybe'.split(' '), 1]
var l40 = ['humanity'.split(' '), 1]
var l41 = ['won\'t.'.split(' '), 1]
var l42 = ['but'.split(' '), 1]
var l43 = ['still'.split(' '), 1]
var l44 = ['I'.split(' '), 1]
var l45 = ['will'.split(' '), 1]
var l46 = ['not'.split(' '), 1]
var l47 = ['die.'.split(' '), 1]
var l48 = ['I will not die.'.split(' '), 10, 20]
var l49 = ['I'.split(' '), 1]
var l50 = ['refuse'.split(' '), 1]
var l51 = ['to'.split(' '), 1]
var l52 = ['come'.split(' '), 1]
var l53 = ['to'.split(' '), 1]
var l54 = ['terms'.split(' '), 1]
var l55 = ['with'.split(' '), 1]
var l56 = ['my'.split(' '), 1]
var l57 = ['own'.split(' '), 1]
var l58 = ['mortality.'.split(' '), 1]
// the final level has 4 parameters so I could identify it by length :/
var l100 = ['I will not die.'.split(' '), 1, 100, 0]

var gameLevels = [l0, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12,
    l16, l19, l20, l21, l22, l23, l24, l16, l25, l16, l26, l16, l27, l16, l28, l16, l30,
l31, l31, l31, l32, l33, l34, l35, l36, l31, l37, l31, l38, l31, l39, l31, l40, l31, l41, l31, l42, l43,
l44, l45, l46, l47, l48, l49, l50, l51, l52, l53, l54, l55, l56, l57, l58,
l100, l100, l100, l100, l100, l100, l100, l100, l100, l100]

var numLevels = gameLevels.length
var currentLevelNum = 0
var currentLevel = gameLevels[currentLevelNum]
var timeAtLevelStart
var finalCount = 0

// creates a matrix of level's words to align them later and check if they need to be shown
function createLevelsWords() {
    words = []
    wordsInRow = currentLevel[0].length
    lineCount = currentLevel[1]
    for (l = 0; l < lineCount; l++) {
        words[l] = []
        for (w = 0; w < wordsInRow; w++) {
            words[l][w] = {x: 0, y: 0, status: 1}
        }
    }
}

// renders text, moves it around, starts next level
function drawLevel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    firstWord = false
    // draw words!
    for (l = 0; l < lineCount; l++) {
        wordPadding = 0
        for (w = 0; w < wordsInRow; w++) {
            ctx.font = lineHeight + 'px Open Sans'
            if (w > 0) {
                wordPadding += ctx.measureText(currentLevel[0][w - 1] + ' ').width
            }
            // this hides 'not' during the last levels
            if (currentLevel.length == 4 && w == 3) {
                ctx.clearRect(wordPadding + lineOffsetLeft - (ctx.measureText(currentLevel[0][2] + ' ').width / 9) * finalCount, lineOffsetTop-lineHeight, ctx.measureText(currentLevel[0][2] + ' ').width, lineHeight+5)
                // this moves 'die' closer to 'will'; not sure which way is better
                // wordPadding -= (ctx.measureText(currentLevel[0][2] + ' ').width / 9) * finalCount
            }
            if (words[l][w].status == 1) {
                // if there's only one word in the row
                if (wordsInRow == 1) {
                    var textPosition = 'center'
                    var wordX = width / 2
                } else {
                    textPosition = 'left'
                    wordX = wordPadding + lineOffsetLeft
                }
                var lineY = (l * (lineHeight + linePadding)) + lineOffsetTop
                if (firstWord == false) {
                    firstWord = [l, w]
                }
                ctx.font = lineHeight + 'px Open Sans'
                ctx.textAlign = textPosition
                ctx.fillStyle = '#000000'
                ctx.fillText(currentLevel[0][w], wordX, lineY)
            }
        }
    }
    if (words[lineCount - 1][wordsInRow - 1].status == 0) {
        startNextLevel()
    }
    // if the level consists of several lines
    else if (currentLevel[1] > 1 && isRunning == true) {
        if (Date.now() - timeAtLevelStart < currentLevel[2] * 1000) {
            lineOffsetTop -= lineSpeed
        } else {
            startNextLevel()
        }
    }
    requestAnimationFrame(function () {
        drawLevel()
    })
}

// starts next level and ends the game
function startNextLevel() {
    if (currentLevel.length == 4) {
        finalCount += 1
    }
    currentLevelNum += 1
    flicker()
    if (currentLevelNum < numLevels) {
        currentLevel = gameLevels[currentLevelNum]
        runLevel(currentLevel)
    } else {
        endGame = true
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setBackground('#000000')
        document.getElementById('interface').style.backgroundColor = '#000000'
        XButton.style.display = 'none'
        YButton.style.display = 'none'
        openMenuButton.style.backgroundColor = '#000000'
        openMenuButton.style.boxShadow = 'none'
        openMenuButton.style.border = 'none'
        openMenuButton.style.color = '#ffffff'
    }
}

// stitches createLevelsWords() and drawLevel() together
function runLevel() {
    createLevelsWords()
    timeAtLevelStart = Date.now()
    if (wordsInRow == 1) {
        if (width < 1000) {
            lineHeight = 64
            lineOffsetLeft = 32
        } else {
            lineHeight = 128
            lineOffsetLeft = width * 0.3
        }
        linePadding = lineHeight * 0.5
        lineOffsetTop = lineHeight * 1.5
    } else {
        if (width < 1050) {
            lineHeight = 32
            lineOffsetLeft = 16
        } else {
            lineHeight = 64
            lineOffsetLeft = width * 0.3
        }
        linePadding = lineHeight * 0.5
        lineOffsetTop = lineHeight * 1.5
    }
    drawLevel()
}

// flickers the canvas between the levels; inspired by supehot I guess?
function flicker() {
    setBackground('#ffffff')
    window.setTimeout(function () {
        setBackground('#dfdfdf')
    }, 5)
}

// helper function that sets background of the canvas
function setBackground(color) {
    document.getElementById('gameCanvas').style.backgroundColor = color
}

// http://stackoverflow.com/a/24384882
// gets mouse position
function getMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect()
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

// opens links from menu (buttons drawn below)
canvas.addEventListener('click', function (event) {
    if (isRunning == false) {
        var mousePosition = getMousePosition(canvas, event)
        if (mousePosition.x > menuButtons.x && mousePosition.x < menuButtons.x + menuButtons.buttonWidth) {
            if (mousePosition.y < menuButtons.y1 + menuButtons.buttonHeight && mousePosition.y > menuButtons.y1) {
                window.open('https://twitter.com/alex_guzey')
            } else if (mousePosition.y < menuButtons.y2 + menuButtons.buttonHeight && mousePosition.y > menuButtons.y2) {
                window.open('https://twitter.com/pippinbarr/status/728221029395509252')
            } else if (mousePosition.y < menuButtons.y3 + menuButtons.buttonHeight && mousePosition.y > menuButtons.y3) {
                window.open('http://guzey.com')
            } else if (mousePosition.y < menuButtons.y4 + menuButtons.buttonHeight && mousePosition.y > menuButtons.y4) {
                window.open('https://github.com/guzey/guzey.github.io/tree/master/x')
            }
        }
    }
}, false)

// draws the menu
function drawMenu() {
    if (isRunning == false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (endGame == false) {
            setBackground('#c2c2c2')
            ctx.font = 'italic ' + height * 0.065 + 'px Open Sans'
            ctx.textAlign = 'center'
            ctx.fillStyle = '#000000'
        } else {
            setBackground('#000000')
            ctx.font = 'italic ' + height * 0.065 + 'px Open Sans'
            ctx.textAlign = 'center'
            ctx.fillStyle = '#ffffff'
        }

        ctx.fillText('by @alex_guzey', width / 2, menuButtons.y1 + (menuButtons.buttonHeight / 1.5))
        ctx.fillText('inspired by', width / 2, menuButtons.y2 + (menuButtons.buttonHeight / 1.5))
        ctx.fillText('homepage', width / 2, menuButtons.y3 + (menuButtons.buttonHeight / 1.5))
        ctx.fillText('source code', width / 2, menuButtons.y4 + (menuButtons.buttonHeight / 1.5))
        requestAnimationFrame(drawMenu)

    } else {
        setBackground('#dfdfdf')
    }
}

// pauses the game, opens menu
function clickMenu() {
    isRunning = !isRunning
    // i.e. just stopped running
    if (isRunning == false) {
        timeAtPause = Date.now()
        drawMenu()
    } else {
        timeAtLevelStart += (Date.now() - timeAtPause)
    }

}

// drawing the buttons
// note that menu and interface (menu button + x + y) are separate
function drawInterface() {
    openMenuButton.style.position = 'absolute'
    openMenuButton.style.top = height * 0.14 + 'px'
    // buttons closer to center on large screens
    if (width < 1050) {
        openMenuButton.style.left = width * 0.10 + 'px'
    } else {
        openMenuButton.style.left = width * 0.3 + 'px'
    }
    openMenuButton.style.width = height * 0.16 + 'px'
    openMenuButton.style.height = height * 0.07 + 'px'
    openMenuButton.style.borderRadius = height * 0.04 + 'px'
    openMenuButton.style.fontSize = height * 0.04 + 'px'

    // height is already at 0.7
    YButton.style.position = 'absolute'
    YButton.style.top = height * 0.08 + 'px'
    if (width < 1050) {
        YButton.style.left = width * 0.75 + 'px'
    } else {
        YButton.style.left = width * 0.65 + 'px'
    }
    YButton.style.width = height * 0.08 + 'px'
    YButton.style.height = height * 0.08 + 'px'
    YButton.style.borderRadius = height * 0.04 + 'px'
    YButton.style.fontSize = height * 0.065 + 'px'

    XButton.style.position = 'absolute'
    XButton.style.top = height * 0.13 + 'px'
    if (width < 1050) {
        XButton.style.left = width * 0.55 + 'px'
    } else {
        XButton.style.left = width * 0.65 - 125 + 'px'
    }
    XButton.style.width = height * 0.08 + 'px'
    XButton.style.height = height * 0.08 + 'px'
    XButton.style.borderRadius = height * 0.04 + 'px'
    XButton.style.fontSize = height * 0.065 + 'px'

    menuButtons = {
        buttonWidth: width * 0.8,
        buttonHeight: height * 0.1,
        x: width * 0.1,
        y1: height * 0.05,
        y2: height * 0.1 + height * 0.1,
        y3: height * 0.15 + height * 0.2,
        y4: height * 0.2 + height * 0.3
    }
}

function clickX() {
    if (firstWord[0] < lineCount && firstWord[1] < wordsInRow && isRunning == true) {
        lastWordL = firstWord[0]
        lastWordW = firstWord[1]
        words[lastWordL][lastWordW].status = 0
    }
}

openMenuButton.addEventListener('click', clickMenu, false)
XButton.addEventListener('click', clickX, false)

drawInterface()
runLevel()