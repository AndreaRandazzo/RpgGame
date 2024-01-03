let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const plusBtn = document.querySelector("#plusBtn");
const minusBtn = document.querySelector("#minusBtn");
const healthAmountInput = document.querySelector("#healthAmount");
healthAmountInput.value = "0";
const healthButtons = document.querySelector("#healthButtons");
healthButtons.style.display = "none";
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monster = document.querySelector("#monster");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
    { name: "stick", power: 5 },
    { name: "dagger", power:30 },
    { name: "claw hammer", power: 50 },
    { name: "sword", power: 100 }
];

const monsters = [
    { name: "slime", level: 2, health: 15, url: '<img src="../res/slime.jpeg">'},
    { name: "fanged beast", level: 8, health: 60, url:  '<img src="../res/beast.jpg">'},
    { name: "dragon", level: 20, health: 300, url:  '<img src="../res/dragon.jpg">'},
]

const locations = [
    {
       name: "town square",
       "button text": ["Go to store","Go to cave","Fight dragon"],
       "button functions": [goStore, goCave, fightDragon],
       text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. ☠️"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon 🐲! YOU WIN THE GAME! 🎉"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    },
    {
        name:"return to town square",
        "button text": ["Go to town square","Go to town square","Go to town square"],
    }
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

plusBtn.onclick = function() {
    let currentAmount = parseInt(healthAmountInput.value);
    healthAmountInput.value = currentAmount + 10;
}
minusBtn.onclick = function() {
    let currentAmount = parseInt(healthAmountInput.value);
    if (currentAmount >= 20) {
        healthAmountInput.value = currentAmount - 10;
    }
}

function update(location) {
    if (location.name === "store") {
        healthButtons.style.display = "inline-block";
    } else {
        healthButtons.style.display = "none";
    }
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
    let maxHealthCanBuy = Math.floor(gold/10) * 10;
    healthAmountInput.max = maxHealthCanBuy;
}

function goCave() {
    update(locations[2]);
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monster.innerHTML = monsters[fighting].url;
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;

}

function buyHealth() {
    let healthQuantity = parseInt(healthAmountInput.value);

    if (healthQuantity === 0) {
        if (gold >= 10) {
            gold -= 10;
            health += 10;
            goldText.innerText = gold;
            healthText.innerText = health;
            healthAmountInput.value = "0";
        } else {
            text.innerText = "You do not have enough gold to buy health.";
        }
    } else {
        let maxHealth = Math.floor(gold / 10) * 10;
        let cost;

        if (healthQuantity > maxHealth) {
            healthQuantity = maxHealth;
        } else {
            healthQuantity = Math.floor(healthQuantity / 10) * 10;
        }

        cost = healthQuantity;

        if (gold >= cost && gold >= 10) {
            gold -= cost;
            health += healthQuantity;
            goldText.innerText = gold;
            healthText.innerText = health;
            healthAmountInput.value = "0";
        } else {
            text.innerText = "You do not have enough gold to buy health.";
        }
    }
}



function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
         if (gold >= 30) {
            gold -= 30;
            currentWeapon ++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
   
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += "You attack it with your " + weapons[currentWeapon].name + ".\n";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp ) + 1;
    } else {
        text.innerText += " You miss.";
    }
    monsterHealthText.innerText = monsterHealth;
    if (health < 0) {
        healthText.innerText = 0;
        lose();
    } else if (monsterHealth <= 0) {
        fighting === 2 ? winGame() : defeatMonster();
    }
    healthText.innerText = health;

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon --;
    }
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    return (hit > 0) ? hit : level ;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += Math.floor(monsters[fighting].level * ((Math.random() + 1)));
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    healthAmountInput.value = "0";
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}
