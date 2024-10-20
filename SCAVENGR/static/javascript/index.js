let jsonStatData;
let currTablePage = 0;
let maxTablePage = 0;

let myLineChart = null;

//test 3

$(document).ready(function() {
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    $('#submitButton').click(function() {
        const textBox = document.getElementById("textBox");
        text = textBox.value;
        //console.log("text: " + text);
        const languageSelect = document.getElementById("language");
        let symbol = languageSelect.value;
        //console.log("symbol: " + symbol);
        //do the loading symbol
        let regex;
        switch(symbol){
            case"#":
                regex = /# [A-Z]/;
                break;
            case"//":
                regex = /\/\/ [A-Z]/;
                break;
            case"%":
                regex = /% [A-Z]/;
                break;
            case"'":
                regex = /' [A-Z]/;
                break;
            case"--":
                regex = /-- [A-Z]/;
                break;
            case";;":
                regex = /;; [A-Z]/; 
                break;

        }
        const exists = text.match(regex);
        if(exists){
            $('#result').text("Likely AI");
            $('#percentage').text(randInt(65,99) + "%");
        }
        else{
            $('#result').text("Unlikely AI");
            $('#percentage').text(randInt(1,35) + "%");
        }
        //display result
    });
});

