function computeEntropy(length, lowerCase, upperCase, symbol, number) {
  let pool = 0;
  if (lowerCase) pool += 26; // Aantal kleine letters
  if (upperCase) pool += 26; // Aantal hoofdletters
  if (number) pool += 10; // Aantal cijfers
  if (symbol) pool += 24; // Aantal symbolen
  // Bereken de entropie: log2(pool) * lengte
  return Math.log2(pool) * length;
}

function generate() {
  console.log("Generate functie aangeroepen");

  let password = "";
  let length = +document.getElementById("length").value;
  let lowerCase = document.getElementById("lowercase").checked;
  let upperCase = document.getElementById("uppercase").checked;
  let symbol = document.getElementById("symbols").checked;
  let number = document.getElementById("numbers").checked;

  if (!lowerCase && !upperCase && !symbol && !number) {
    document.getElementById("result").textContent =
      "Selecteer minstens één optie!";

    // Update de textnode zodat de span behouden blijft
    let entropyDiv = document.getElementById("entropy");
    if (entropyDiv.firstChild) {
      entropyDiv.firstChild.nodeValue = "";
    }

    // Verberg de emoji als er geen opties geselecteerd zijn
    let strengthEmoji = document.getElementById("strengthEmoji");
    strengthEmoji.style.display = "none";
    return;
  }

  for (let i = 0; i < length; i++) {
    const r = generater(0, 3);
    if (lowerCase && r === 0) {
      password += generateRandomLowerCase();
    } else if (upperCase && r === 1) {
      password += generateRandomUpperCase();
    } else if (symbol && r === 2) {
      password += generateRandomSymbol();
    } else if (number && r === 3) {
      password += generater(0, 9);
    } else {
      i--; // Ongeldige keuze, herhaal deze iteratie
    }
  }

  document.getElementById("result").textContent = password;

  // Bereken de entropie van het wachtwoord
  let entropy = computeEntropy(length, lowerCase, upperCase, symbol, number);
  let strength = entropy < 50 ? "zwak" : "sterk";

  // Werk de textnode bij, zodat de span behouden blijft
  let entropyDiv = document.getElementById("entropy");
  if (entropyDiv.firstChild) {
    entropyDiv.firstChild.nodeValue =
      "Entropie: " + entropy.toFixed(2) + " bits (" + strength + ") ";
  }

  // Update de emoji in de span op basis van de sterkte
  let strengthEmoji = document.getElementById("strengthEmoji");
  if (strength === "zwak") {
    strengthEmoji.textContent = "😞"; // Zwakke emoji
  } else {
    strengthEmoji.textContent = "💪"; // Sterke emoji
  }
  // Zorg ervoor dat de emoji zichtbaar is
  strengthEmoji.style.display = "inline";
}

function generateRandomLowerCase() {
  return String.fromCharCode(generater(97, 122));
}

function generateRandomUpperCase() {
  return String.fromCharCode(generater(65, 90));
}

function generateRandomSymbol() {
  const symbols = "~*$%@#^&!?*'-=/,.{}()[]<>";
  return symbols[generater(0, symbols.length - 1)];
}

function generater(min = 0, max = 1) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}
