// project.js - purpose and description here
// Author: James Milestone
// Date: 4/7/2024

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


function main() {
  const fillers = {
  
    wake: ["wake up super early just to play games in bed.", "wake up at noon!"],
    breakfast: [" waffles with syrup and whipped cream","eggs and bacon", "Cheereos and orange juice"],
    activityA: [" get some homework done. Maybe I'll work on my 147 homework", "play some overwatch; I'm so close to masters", "just watch some Youtube. Maybe that will give me ideas"],
    lunch: ["bowl of mac n cheese", "sandwich"," glass of water"],
    afternoon: ["draw up some game ideas", "play ping pong with my housemate", "take a nap", " go on a run" ],
    evening: ["read some comics","clean my room", "do my laundry", "take a nap"],
    dinner: ["pasta", "pizza", "stew", "salad", "ramen"],
    activityB: ["some pokemon", "a game of overwatch", "a round of marvel snap", "a run", "some music", "a walk", "some ice cream" ],
    
  };
  
  const template = `
  I have so much to do during the week that I only get one day off and it just so happens that that day is tomorrow! How should I spend tomorrow?
  
  First, I'll $wake
  Then I'll start my day with $breakfast.
  Now that I'm full, I'll be able to $activityA.
  That took so long that its already lunch. I'll have a $lunch.
  In the afternoon, I'll $afternoon, then $evening.
  I hope I can have $dinner for dinner. Then I'll end my day with $activityB before I go to sleep.
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

main();