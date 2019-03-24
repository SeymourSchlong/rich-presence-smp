'use strict';

const fs = require('fs');
let project = require('./project.json');
const instruments = [ "mario", "mushroom", "yoshi", "star", "flower", "gameboy", "dog", "cat", "pig", "swan", "face", "plane", "boat", "car", "heart", "coin", "piranha", "shyguy", "boo", "luigi", "peach", "feather", "bulletbill", "goomba", "bobomb", "spiny", "berry", "1up", "moon", "egg" ];

let alerted = false;

window.presence = {
    largeImageKey: project.largeIMG,
    smallImageKey: project.smallIMG,
    details: project.name, // Displays the current song and creator (if it is displayable)
    largeImageText: project.largeTXT == '' ? ' ឵឵ ឵឵' : project.largeTXT, // Text that displays when you hover over the large image
    smallImageText: project.smallTXT == '' ? ' ឵឵ ឵឵' : project.smallTXT, // Text that displays when you hover over the small image
    state: project.source === '' ? 'Parts complete' : project.source, // Displays parts complete (is not visible if total/completed values are equal to or less than 0)
    partySize: project.completed, // Parts complete
    partyMax: project.total // Total parts
}//*/

// Sets the all the values to the last saved ones.
const initialize = () => {

    let selectBoxes = document.querySelectorAll('select');
    let checkBoxes = document.querySelectorAll('input');

    for (let i = 0; i < instruments.length; i++) {
        let option = document.createElement('option');
        option.textContent = instruments[i];
        selectBoxes[0].appendChild(option);
        if (project.largeIMG.startsWith(instruments[i])) {
            selectBoxes[0].selectedIndex = i;
        }
    }
    for (let i = 0; i < instruments.length; i++) {
        let option = document.createElement('option');
        option.textContent = instruments[i];
        selectBoxes[1].appendChild(option);
        if (project.smallIMG.startsWith(instruments[i])) {
            selectBoxes[1].selectedIndex = i;
        }
    }
    
    if (project.largeIMG.endsWith('_sm')) {
        checkBoxes[0].checked = true;
    }
    if (project.smallIMG.endsWith('_sm')) {
        checkBoxes[1].checked = true;
    }

    let values = document.querySelectorAll('.input');
    values[0].value = project.name;
    values[1].value = project.source;
    values[2].value = project.largeTXT;
    values[3].value = project.smallTXT;
    values[4].value = project.completed;
    values[5].value = project.total;
}

const reactPressed = () => {
    let values = document.querySelectorAll('.input');
    let newArray = [];
    for (let i = 0; i < values.length; i++) {
        newArray.push(values[i].value);
    }

    let selectBoxes = document.querySelectorAll('select');
    let checkBoxes = document.querySelectorAll('input');
    
    let newPresence = {
        details: `${newArray[0]}`, // Displays the current song
        largeImageKey: instruments[selectBoxes[0].selectedIndex] + (checkBoxes[0].checked ? '_sm' : ''),
        smallImageKey: instruments[selectBoxes[1].selectedIndex] + (checkBoxes[1].checked ? '_sm' : ''),
        largeImageText: newArray[2] == '' ? ' ឵឵ ឵឵' : newArray[2],
        smallImageText: newArray[3] == '' ? ' ឵឵ ឵឵' : newArray[3],
        state: newArray[1] === ''  ? 'Parts complete' : newArray[1],
        partySize: parseInt(newArray[4]),
        partyMax: parseInt(newArray[5])
    }

    window.presence = newPresence;
}