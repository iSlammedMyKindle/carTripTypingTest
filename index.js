const algos = {
    rndWords: function*(count = 1){
        while(count){
            count --;
            yield [...Array(Math.floor(Math.random() * 5)+2)].map(
                ()=>String.fromCharCode(
                    // vowel or consanent? it should be a 50% chance
                    Math.floor(Math.random() * 4) === 0 ?
                    'aeiou'.charCodeAt(Math.floor(Math.random() * 5)):
                    97 + (Math.floor(Math.random() * 26))
                )
            ).join('');
        }
    },

    buffalo: function*(count = 1){
        while(count){
            count --;
            yield "buffalo";
        }
    },
    quickBrownFox: function*(count = 1){
        const phrase = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];
        let index = 0;
        while(count){
            count --;

            yield phrase[index];

            index ++;
            if(!phrase[index]) index = 0;
        }
    }
}

let selectedAlgo = 'quickBrownFox';
const textBox = document.getElementById('text-entry');
const wrongKeys = textBox.getElementsByClassName('bad');
const wpm = document.getElementById('wpm');
const adjWpm = document.getElementById('adjusted-wpm');
const acc = document.getElementById('acc');
const timeElapsed = document.getElementById('elapsed');


// initialize listener and current body index
let testIndex = 0, focused, interval, elapsed, phrase;

document.getElementById('word-algo').addEventListener('change', function(){
  selectedAlgo = this.value;

  // reload the algo, reset timers and stuff
  resetTest();
});

function resetTest(){
    testIndex = 0, focused = false, elapsed = 0;
    clearInterval(interval);

    // Clear out the HTML of the test
    textBox.innerHTML = '';

    //Remove the stats
    wpm.innerHTML = '';
    timeElapsed.innerHTML = '';


    // Put down en element for each letter
    phrase = [...algos[selectedAlgo](50)].join(' ');
    for(let chr in phrase){
        const elem = document.createElement('span');
        elem.innerText = phrase[chr];
        textBox.appendChild(elem);
    }
}

document.body.addEventListener('click', evt=>{
    if(evt.target == textBox){
        focused = true;
        console.log('focused');
    }

    else{
        focused = false;
        clearInterval(interval);
        delete interval;
        console.log('blurred');
    }
});

document.addEventListener('keydown', evt=>{
    if(!focused) return;

    console.log(evt.key, 'textbox', textBox.children[testIndex].innerText);
    let back = false;
    // Non letter keys
    if(evt.key == "Backspace" && testIndex > 0){
        back = true;
        testIndex --;
        textBox.children[testIndex].className = '';
    }

    else if(evt.key.length > 1) return;
    // End non-letters

    else if(textBox.children[testIndex].innerText == evt.key){
        textBox.children[testIndex].classList.add('good');
    }
    else textBox.children[testIndex].classList.add('bad');

    if(!back && testIndex < phrase.length) testIndex++;

    if(!interval){
        interval = setInterval(()=>{
            elapsed ++;
            // Static variable, but would need to be changed on a more dynamic program
            let totalWords = testIndex / 5;
            // Grab the total time elapsed, divide 60 by that time, multiply the result to get WPM
            let minuteOverElapsed = 60 / elapsed;
            let wordsPerMinute = totalWords * minuteOverElapsed;
            let accuracy = 100 - ((100 / testIndex) * wrongKeys.length);
            let adjustedWpm = ((testIndex - wrongKeys.length) / 5) * minuteOverElapsed;

            wpm.innerText = wordsPerMinute;
            timeElapsed.innerText = elapsed;
            adjWpm.innerText = adjustedWpm;
            acc.innerText = accuracy;
        }, 1000);
    }
});

resetTest();
