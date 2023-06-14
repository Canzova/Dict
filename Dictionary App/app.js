// Next step 1. By clicking on the suggestions do search

let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let notfound = document.querySelector(".not-found");
let apiKey = "f75ef5bb-d6e8-4a54-a287-8af2b10dc657";
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let keyboard = document.querySelector('.input-wrap input');
//let sugg = document.querySelector('.suggested');



// Add event listener to suggested words
notfound.addEventListener('click', function (e) {

    // If the clicked element is of class suggested then replace it with the input.

    if (e.target.classList.contains('suggested')) {
        // Replace input value with clicked suggested word
        input.value = e.target.innerText;

        // Call the getdata function to proceed
        getData(input.value);

        // Clear old data
        audioBox.innerHTML = '';
        notfound.innerText = '';
        defBox.innerText = '';

    }
});

// In the above code, an event listener is added to the notfound element (which contains the suggested words) using the addEventListener method. When a click event is triggered on the notfound element, the event target is checked to see if it has the class suggested. If it does, the value of the clicked suggested word is assigned to the input's value.

// With this modification, when the user clicks on a suggested word, it will replace the input value. Then, when the search button is clicked, the updated value will be used for the search.


searchBtn.addEventListener('click', function (e) {
    // To remove the default behaviour of the button
    e.preventDefault

    // Clear old data
    audioBox.innerHTML = '';
    notfound.innerText = '';
    defBox.innerText = '';

    // Get input data
    let word = input.value;

    // Call API get data

    if (word == '') {
        alert('Word is required');
        return;
    }
    getData(word);

    // Get Data
})

// For searching by tapping enter button

keyboard.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        // Prevent form submission or other default behavior of browser
        e.preventDefault();

        // Clear old data
        audioBox.innerHTML = '';
        notfound.innerText = '';
        defBox.innerText = '';

        // Get input data
        let word = input.value;

        // Call API get data

        if (word == '') {
            alert('Word is required');
            return;
        }
        getData(word);

        // Get Data
    }
})

async function getData(word) {
    
    // To show loading text on the screen
    loading.style.display = 'block';
    
    //Ajax Call

    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);

    // ${apple}--->Template string 

    const data = await response.json();

    // If empty result
    if (!data.length) {
        loading.style.display = 'none';
        notfound.innerText = 'No result found';
        return;
    }

    // If result is suggestions we will receive the result in the format of a string

    if (typeof data[0] == 'string') {

        // To hide the data when we have received a result
        loading.style.display = 'none';

        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean';
        notfound.appendChild(heading);

        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;

            notfound.appendChild(suggestion);

            return;
        });
    }


    // Result found
    loading.style.display = 'none';
    let defination = data[0].shortdef[0];
    defBox.innerHTML = defination;

    // Sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        // Sound file is available
        rendersound(soundName);
    }

    console.log(data);

}

function rendersound(soundName) {
    let subFolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subFolder}/${soundName}.wav?${apiKey}`;

    // Creating audio tag in DOM
    let audio = document.createElement('audio');

    audio.src = soundSrc;

    // For stop, play and other options/contrcol
    audio.controls = true;

    audioBox.appendChild(audio);

}
