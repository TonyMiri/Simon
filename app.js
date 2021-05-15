/* jshint esversion: 6*/
!function game() {
  
    //////******************TODO******************//////
    //Fix audio popping
    //Add instructions
    //Cosmetic fixes
    //Possibly add the code to speed up the sequence (code it into playSequence())
    //Possible special game start and winning button sequences
    //Organize code
           
    let gameOn = false;
    let start = false;
    let strict = false;
    let playerArray = [];
    let playerPosition = 0;
    let playerTurn = false;
    let sequenceArray = [];
    let computerPosition = 0;
    let computerTurn = false;
    let textPos = 0; //scroll
    
  /////************GAME CODE************/////
    
    //Get a random number
    function randomNum(min , max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    //Generate the game sequence
    function generateSequence() {
      console.log('Begin Generate Sequence')
      computerPosition = 0;
      sequenceArray.push(randomNum(1,4));
      if (sequenceArray.length < 10) {
        displayUpdate('0' + sequenceArray.length);
      } else {
        displayUpdate(sequenceArray.length);
      }
      setTimeout(playSequence, 1000);
      console.log('End Generate Sequence')
    }
    
    //Play through the sequence array
    function playSequence() {
      console.log('Begin playSequence')
      if(!gameOn) {
        return
      }
      
      if(computerPosition == sequenceArray.length - 1) {
        $('#b'+ sequenceArray[computerPosition]).click();
      } else {
        $('#b'+ sequenceArray[computerPosition]).click();
        computerPosition++;
        setTimeout(playSequence, 500);
      }
      console.log('End playSequence');
    }
    
    //Check to see if the player selection matches the sequence
    let validate = () => {
      playerPosition = playerArray.length - 1; 
      if(playerArray[playerPosition] == sequenceArray[playerPosition]) {
        return true;
      } else {
        return false;
      }
    };
    
    //Update the display
    function displayUpdate(x) {
      $('#score-display').html(x);
    }
    
    //Scrolling Message
    function scroll(text) {
      let textArray = Array.from(text);   
      if(textPos < textArray.length -1){
        displayUpdate(textArray[textPos] + textArray[textPos+1]);
        textPos++;
        setTimeout(scroll, 600, text);
      } else if (sequenceArray.length < 1) {
        setTimeout(displayUpdate, 600, '01');
        textPos = 0;
      } else {
        return;
      }
    }
    
    //Resets all variables (used for on/off switch)
    function reset() {
      start = false;
      playerArray = [];
      playerPosition = 0;
      playerTurn = false;
      sequenceArray = [];
      computerPosition = 0;
    }
    
    //Do stuff when the correct button is pressed
    function playAudio(className) {    
      let audio = document.querySelector(`audio[data-key=${className}]`);
      audio.currentTime = 0;
      audio.playbackRate = 1;
      if (audio.volume < 85) {
        audio.animate({volume:85})
      }
      audio.play();
      $(`.${className}`).addClass(`active_${className}`);
      audio.addEventListener("ended", () => {
            $(`.${className}_button`).removeClass(`active_${className}`); 
      });
    }
    
    //Do stuff when the wrong button is pressed
    function playWrongAudio(className) {
      let wrongAudio = document.querySelector(`audio[data-key=${'wrong'}]`);
      wrongAudio.currentTime = 0;
      wrongAudio.playbackRate = 1;
      wrongAudio.play();
      $(`.${className}`).addClass(`active_${className}`);
      wrongAudio.addEventListener("ended", () => {
            $(`.${className}_button`).removeClass(`active_${className}`); 
      });
    }
    
  /////*********BUTTONS CODE*********/////
    
    //Disable all buttons while the game is turned off
    $('button').prop('disabled', true);
    
    //Click handler for the on/off switch
    $('.switch').on('click', () => {
      if (gameOn){
        gameOn = false;
        strict = false;
        $('.switch').css({'background-color': 'rgb(209, 37, 49)', 'flex-direction': 'column-reverse'});
        $('button').prop('disabled', true);
        $('.strict-indicator').css('visibility', 'hidden');
        displayUpdate('');
        reset();
      } else {
        gameOn = true;
        $('.switch').css({'background-color': 'rgba(17, 116, 10, 1)', 'flex-direction': 'column'});
        $('button').prop('disabled', false);
        setTimeout(() => {displayUpdate('--')}, 500);
      } 
    });
    
    //Click Handlers for the Big Buttons
    function buttonClick() {
      console.log('CLICK START');
      console.log('playerTurn: ', playerTurn);
      console.log('playerArray: ', playerArray);
      
      let className = ($(this).attr('class').split(' ')[1]);
      
      //If it's the player's turn
      if(playerTurn){
        let buttonNumber = $(this).attr('id').split('')[1];
        playerArray.push(buttonNumber);
        //If the player gets it right on their 20th turn
        if(playerArray.length == sequenceArray.length && validate() && sequenceArray.length == 20) {
          console.log(1);
          playAudio(className);
          setTimeout(scroll, 1000, 'WINNER!!');
          setTimeout(displayUpdate, 7000, '--');
          setTimeout(reset, 7000);
          return;
        }
        //If the player makes a correct selection as the last choice for his/her turn
        if (playerArray.length == sequenceArray.length && validate()) {
          console.log(2);
          playAudio(className);
          playerPosition = 0;
          playerTurn = false;
          setTimeout(generateSequence, 500);
          playerArray = []; 
        //if it's the player's turn and he/she gets it wrong
        } else if (!validate()) {
          //If the game is in strict mode
          if(strict) {
            console.log(3);
            computerPosition = 0;
            playWrongAudio(className);
            reset();
            displayUpdate('--');
            
          //If the game is not in strict mode
          } else {
            console.log(4);
            computerPosition = 0;
            playWrongAudio(className);
            playerArray = [];
            playerTurn = false;
            setTimeout(playSequence, 2000);
          }
        } else {
          console.log(5);
          playAudio(className);
        }
      //If it isn't the player's turn
      } else {
        //and the computer has played the last selection in the sequence
        if (computerPosition == sequenceArray.length - 1) {
          console.log(6);
          playAudio(className);
          playerTurn = true;
        //If the computer presses a button  
        } else {
          console.log(7);
          playAudio(className);
        }
      }
      console.log('playerTurn: ', playerTurn);
      console.log('CLICK END');
    }
  
    //When a big button is clicked, run our button handler function
    $('.green_button, .red_button, .yellow_button, .blue_button').on('click', buttonClick);
    
    //Click Handler for start button
    $('.start').on('click', () => {
      if (gameOn && sequenceArray.length === 0 && !start){
        textPos = 0;
        setTimeout(generateSequence, 3500);
        scroll('START');
      }
      start = true;
    });
    
    //Click handler for strict button
      $('.strict').on('click', () => {
        if(strict) {
          strict = false;
          $('.strict-indicator').css('visibility', 'hidden');
        } else {
          strict = true;
          $('.strict-indicator').css('visibility', 'visible');
        }
    });
  }();
  
  //Notes
  /* Each coloured lens has an individual tone which is generated when the game lights a colour or if a player lights a colour. The tones for the lights are as follows (on Pocket Simon):
  
      Blue – 415 Hz – G#4 (true pitch 415.305 Hz)
      Yellow – 310 Hz – D#4 (true pitch 311.127 Hz)
      Red – 252 Hz ‐ B3 (true pitch 247.942 Hz)
      Green – 209 Hz – G#3 (true pitch 207.652 Hz)
  
  On the full‐size version of Simon the lights are in the opposite order:
  
      Green – 415 Hz – G#4 (true pitch 415.305 Hz)
      Red – 310 Hz – D#4 (true pitch 311.127 Hz)
      Yellow – 252 Hz ‐ B3 (true pitch 247.942 Hz)
      Blue – 209 Hz – G#3 (true pitch 207.652 Hz)
  
  In addition, if the player presses he wrong colour or takes too long the game plays a losing tone of 42 Hz for 1.5 seconds.
  
  Note: According to information on the web the sounds of the Simon game are based on the primary four notes of a bugle (picked so the game will always sound harmonious no matter the sequence). These notes are G1, C2, E2 and G2 (although the game plays notes in the 3rd and 4th octave). This being the case the actual frequencies should be:
  
      Green – G4 391.995 Hz
      Red – E4 329.628 Hz
      Yellow – C4 261.626 Hz
      Blue – G3 195.998 Hz
  
  The inaccuracy of the game tones is probably due to the constraints of accurately producing the duty‐cycle timing required for the notes (the timing of the square wave is limited by the instruction speed of the processor) and also inaccuracies in the processor’s clock (which is rudimentary by modern standards).
  
  As the game progresses the playback of the tones becomes faster, timings are shown in the following table (note when using the last and longest buttons the sequence is always played back at the lowest speed):
  
      Sequence length: 1‐5, tone duration 0.42 seconds, pause between tones 0.05 seconds
      Sequence length: 6‐13, tone duration 0.32 seconds, pause between tones 0.05 seconds
      Sequence length: 14‐31, tone duration 0.22 seconds, pause between tones 0.05 seconds
  
  If the required sequence length for the skill level has been reached Pocket Simon plays a victory tone of six beeps (of the same frequency as the last colour in the sequence). The first beep is 0.02 seconds followed by 5 beeps of 0.07 seconds with a 0.02 second gap between tones the light of the last colour of the sequence is flashed on with each beep. The victory tone is played 0.8 seconds after the last colour of the sequence has been pressed and released.
  
  The time between the player finishing a sequence and the game playing the sequence again (with an extra colour) is 0.8 seconds.
  When depressing a colour there is no limit on how long you can keep the colour pressed when replaying a sequence the tone and light continue until the colour is released (a handy cheat if you need a little more time to remember the next colour!).
  
  In game time out: 3 seconds (after which the losing tone is played)
  
  Inactive and still powered on warning: 45 seconds. This warning lights the colour that was previously lit in the game (i.e. the colour that the losing tone or the winning tone flashed). The first beep is 0.02 seconds followed by 16 beeps lasting 0.07 seconds with a 0.02 second gap between each beep. The tone’s frequency is the same as the colour it is flashing. If no colour has been selected since the game was turned on the Pocket Simon flashes the red colour (the full‐size Simon flashes the yellow colour). This warning tone repeats if the game remains inactive.
  Special ‘Razz’
  
  In games 1 and 2 there is a ‘special victory signal’ which is played if you complete a sequence of 31 colours (i.e. you win on skill level 4). The game plays the following tones (and flashes the corresponding lights) for 0.10 seconds per light:
  
  310, 252, 209, 415 x 3 (RYBG on the full-size Simon)
  310, 252 (RY)
  
  At which point the tones are replaced by the failure signal for a further 0.8 seconds. The lights continue to flash (BG RYBG RY) for 0.1 seconds per light.
  
  In game 3 there is a ‘very special victory signal’ that is played if you complete a sequence of 31 colours on skill level 4. It is identical to the ‘special victory signal’ except that the failure signal continues to play (without flashing any lights) until the game is turned off.
  
  The time between completing the game and the special signal being played is 0.8 seconds.*/