//API Documentation: (no key required)   www.tofret.com/


function getChord(notes) {
    //The notes used for filtering and sorting for best fix
    var allNotes = notes;
    
    //This format is required for making an API call 
    var urlFormat = "";
    for(var i = 0; i < notes.length; i++){
        if(i>0){
            urlFormat += "+"
        }
        if(notes[i].includes("#")){
            var urlFormatNote = notes[i].slice(0, -1) + "%23"
            urlFormat += urlFormatNote;
        }else {
            urlFormat += notes[i];
        }
    }


    $.ajax({
        url: `https://cors-anywhere.herokuapp.com/www.tofret.com/reverse-chord-finder.php?return-type=json&notes=${urlFormat}}`,
        method: "GET"
    }).then(function (response) {

        response = JSON.parse(response);

        console.log(response);

        if (!findExactFit(response, allNotes)) {
            findBestAnswer(response, allNotes);
        }

    })
}


//Sorts through the API result and console logs (an returns true) an exact match if one exists
function findExactFit(response, allNotes) {

    let exactMatchLength = allNotes.length - 1;
    for (let i = 0; i < allNotes.length; i++) {
        exactMatchLength += allNotes[i].length;
    }


    for (const property in response.chords) {
        for (const key in response.chords[property]) {
            console.log(`${property}: ${key}, ${response.chords[property][key]}`)

            if (response.chords[property][key].length === (exactMatchLength)) {

                console.log("HIT!!!");
                //DESIRED ANSWER IN DESIRED FORMAT
                console.log(`${property} ${key}`);
                $(".chord-result").text(`${property} ${key}`)
                console.log(response.chords[property][key])
                return true;

                // response.chords[property][key].includes(allNotes[0]) || response.chords[property][key].includes(noteEquivalencies[allNotes[0]])

            }
        }
    }


}
//This will only trigger if we have at least 3 keys pressed, and there is NO exact match 
function findBestAnswer(response, allNotes) {

    if (!response.chords) {
        console.log("No chords found for these notes :(")
        return null;
    }

    var likelihood0 = [];
    var likelihood1 = [];
    var likelihood2 = [];
    var likelihood3 = [];
    var likelihood4 = [];
    var likelihood5 = [];

    for (const property in response.chords) {
        for (const key in response.chords[property]) {
            // console.log(`${property}: ${key}, ${response.chords[property][key]}`)

            //If KEY is major, minor, it is 1st likelihood
            if (key === "major" || key === "minor") {
                likelihood0.push(`${property} ${key}`)
            }
            //If KEY is Dominant seventh, diminished or augmented triad it is 2nd likelihood
            else if (key === "dominant7th" || key === "diminished" || key === "augmented") {
                likelihood1.push(`${property} ${key}`);
            }
            //If KEY is diminished or half diminished, it is 3rd likelihood
            else if (key === "diminished7" || key === "m7b5") {
                likelihood2.push(`${property} ${key}`);
            }
            //If KEY is augmented, Major Seventh, or Minor Seventh, it is 4th likelihood
            else if (key === "major7" || key === "minor7" || key === "augmented7") {
                likelihood3.push(`${property} ${key}`);
            }
            //If KEY is Extended or Suspended, it is 5th likelihood
            else if (key === "sus2" || key === "sus4") {
                likelihood4.push(`${property} ${key}`);
            }
            //If KEY is anything else, it is sixth likelihood
            else {
                likelihood5.push(`${property} ${key}`);
            }
        }
    }

    console.log(likelihood0);
    console.log(likelihood1);
    console.log(likelihood2);
    console.log(likelihood3);
    console.log(likelihood4);
    console.log(likelihood5);

    return [likelihood0, likelihood1, likelihood2, likelihood3, likelihood4, likelihood5]
}

//TODO: function that handles case where only 1 note is chosen. Returns name of note chosen and the analysis of "unison"

//TODO: function that handles case where only 2 notes are chosen. Returns the interval between the chords

function refreshKeys() {
    $(".key").each(function() {
        $(this).attr("data-active", "false");
    })
}

// activates the hamburger menu for external links in NAV bar.
$(document).ready(function () {
    $('.sidenav').sidenav();
    generateKeyboard(0,0,document.getElementById("keyboard"));
});

// click event to set key depress.
$("#keyboard").on("click", ".key", function (e) {
    const keyPressed = $(this);
    if (keyPressed.attr("data-active") === "false") fnPlayNote(keyPressed.attr("data-note"), keyPressed.attr("data-octave"));
    keyPressed.attr("data-active", keyPressed.attr("data-active") === "false");
})

// submit results to find chord
$("#submit").on("click", function (e) {
    const pressedKeys = [];

    $(".key").each(function () {
        if ($(this).attr("data-active") === "true") pressedKeys.push($(this).attr("data-note"));
    })
    console.log(pressedKeys);
    refreshKeys();
    getChord(pressedKeys);
})

