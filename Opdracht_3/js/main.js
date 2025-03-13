// Globale variabelen (blijven bestaan zolang de pagina actief is)
var lengthInput, lowercaseInput, uppercaseInput, symbolsInput, numbersInput;
var resultDiv, entropyDiv, strengthEmoji, generateButton, errorDiv;

document.addEventListener("DOMContentLoaded", function () {
    // Initialiseer globale variabelen
    lengthInput = document.getElementById("length");
    lowercaseInput = document.getElementById("lowercase");
    uppercaseInput = document.getElementById("uppercase");
    symbolsInput = document.getElementById("symbols");
    numbersInput = document.getElementById("numbers");
    resultDiv = document.getElementById("result");
    entropyDiv = document.getElementById("entropy");
    strengthEmoji = document.getElementById("strengthEmoji");
    generateButton = document.getElementById("generate");
    
    // Controleer of een error-div al bestaat, anders maken we die aan
    errorDiv = document.getElementById("error");
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "error";
        errorDiv.style.color = "red";
        errorDiv.style.fontWeight = "bold";
        errorDiv.style.marginTop = "10px";
        resultDiv.parentNode.insertBefore(errorDiv, resultDiv.nextSibling);
    }

    // Voeg event listener toe aan de knop
    generateButton.addEventListener("click", generate);
});

function generate() {
    // Leeg de foutmelding bij elke klik
    errorDiv.textContent = "";

    let password = "";
    let length = Math.max(4, Math.min(25, +lengthInput.value));
    let lowerCase = lowercaseInput.checked;
    let upperCase = uppercaseInput.checked;
    let symbol = symbolsInput.checked;
    let number = numbersInput.checked;

    if (!lowerCase && !upperCase && !symbol && !number) {
        errorDiv.textContent = "Selecteer minstens één optie voor het wachtwoord!";
        return;
    }

    // Genereer wachtwoord
    for (let i = 0; i < length; i++) {
        let r = generater(0, 3);
        if (lowerCase && r === 0) {
            password += generateRandomLowerCase();
        } else if (upperCase && r === 1) {
            password += generateRandomUpperCase();
        } else if (symbol && r === 2) {
            password += generateRandomSymbol();
        } else if (number && r === 3) {
            password += generater(0, 9);
        } else {
            i--;
        }
    }

    resultDiv.textContent = password;

    // Bereken de entropie van het wachtwoord
    let entropy = computeEntropy(length, lowerCase, upperCase, symbol, number);
    let strength = entropy < 50 ? "zwak" : "sterk";

    // Update entropie zonder emoji te verwijderen
    if (entropyDiv.firstChild) {
        entropyDiv.firstChild.nodeValue = `Entropie: ${entropy.toFixed(2)} bits (${strength}) `;
    }

    // Emoji updaten zonder dat deze verdwijnt
    strengthEmoji.textContent = strength === "zwak" ? "😞" : "💪";
    strengthEmoji.style.display = "inline"; 
}

function computeEntropy(length, lowerCase, upperCase, symbol, number) {
    let pool = 0;
    if (lowerCase) pool += 26; // Aantal kleine letters
    if (upperCase) pool += 26; // Aantal hoofdletters
    if (number) pool += 10; // Aantal cijfers
    if (symbol) pool += 24; // Aantal symbolen
    // Bereken de entropie: log2(pool) * lengte
    return Math.log2(pool) * length;
}

// Verschillende functies om random tekens te genereren
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
