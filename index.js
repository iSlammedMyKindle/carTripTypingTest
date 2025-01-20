function *rndWords(count = 1){
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
}


const textBox = document.getElementById('text-entry');

// Put down en element for each letter
let phrase = [...rndWords(50)].join(' ');
for(let chr in phrase){
    const elem = document.createElement('span');
    elem.innerText = phrase[chr];
    textBox.appendChild(elem);
}

// initialize listener and current body index
let testIndex = 0;
let focused = false;
let interval = undefined;
let elapsed = 0;

document.body.addEventListener('click', evt=>{
    if(evt.target == textBox){
        focused = true;
        console.log('focused');
    }

    else{
        focused = false;
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
        elapsed = 0;

        interval = setInterval(()=>{
            elapsed ++;
            // Static variable, but would need to be changed on a more dynamic program
            let totalWords = testIndex / 5;
            let wordsPerMinute = totalWords / (1)
        }, 1000);
    }
});
