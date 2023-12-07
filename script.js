function encryptText() {
    const originalText = document.getElementById("originalText").value;
    const shiftInput = document.getElementById("shift").value;
    const shift = shiftInput ? parseInt(shiftInput) : 0;
    const { encryptedText, changedIndices } = caesarCipher(originalText, shift);
    
    // Update the elements accordingly
    const encryptedTextElement = document.getElementById("encryptedText");
    encryptedTextElement.textContent = encryptedText;
    
    // Update the originalText input field with the encrypted text
    document.getElementById("originalText").value = encryptedText;
    
    // Update the alphabet and other UI elements if needed
    document.getElementById("decryptedText").textContent = "";
    updateAlphabet(encryptedText, changedIndices, 'bold');
}

function decryptText() {
    const shiftInput = document.getElementById("shift").value.trim();
    let changedIndices = [];
    if (shiftInput !== "") {
        const shift = parseInt(shiftInput);
        const originalText = document.getElementById("originalText").value;
        if (isTextValid(originalText)) {
            const caesarResult = caesarCipher(originalText, -shift);
            const decryptedText = caesarResult.encryptedText;
            const newChangedIndices = caesarResult.changedIndices;
            changedIndices = newChangedIndices;
            const decryptedTextElement = document.getElementById("decryptedText");
            decryptedTextElement.textContent = decryptedText;
            if (decryptedText.length > 0) {
                updateAlphabet(decryptedText, changedIndices, 'bold');
                document.getElementById("originalText").value = decryptedText; // Update the value of originalText input
            } else {
                alert("Unable to get changed character indices.");
            }
        } else {
            alert("The entered text contains invalid characters.");
        }
    } else {
        document.getElementById("shift").value = "0";
    }
}

function isTextValid(text) {
    const validCharacters = /^[A-Za-zА-яІіЇїҐґЄє\s]+$/;
    console.log(validCharacters.test(text));
    return validCharacters.test(text);
}
function caesarCipher(text, shift) {
    const ukrainianAlphabet = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";//Український алфавіт
    const ukrainianAlphabetUpperCase = ukrainianAlphabet.toUpperCase();//Створення рядка, який містить верхній регістр українського алфавіту.
    let result = "";//Ініціалізація порожнього рядка, куди буде записаний зашифрований текст.
    let changedIndices = [];//Ініціалізація порожнього масиву, де будуть зберігатися індекси символів, які були змінені (зашифровані).
    for (let i = 0; i < text.length; i++) {//Початок циклу, який проходить крізь кожен символ у вхідному тексті.
        let char = text[i];//Зчитування поточного символу тексту.
        let changed = false;// Ініціалізація змінної, яка позначає, чи був символ змінений (зашифрований).
        if ((ukrainianAlphabet.includes(char) || ukrainianAlphabetUpperCase.includes(char) || char === 'І' || char === 'і'|| char === 'Ї'|| char === 'ї'|| char === 'Ґ'|| char === 'ґ'|| char === 'Є'|| char === 'є') ) {//Перевірка, чи належить символ до українського алфавіту.
            const isUpperCase = char === char.toUpperCase();// Визначення, чи є символ у верхньому регістрі.
            if (shift< 34&& (ukrainianAlphabet.includes(char) || ukrainianAlphabetUpperCase.includes(char) || char === 'І' || char === 'і'|| char === 'Ї'|| char === 'ї'|| char === 'Ґ'|| char === 'ґ'|| char === 'Є'|| char === 'є')) {//Перевірка, чи зсув менше 34 та чи символ є частиною українського алфавіту.
                const alphabet = isUpperCase ? ukrainianAlphabetUpperCase : ukrainianAlphabet;// Вибір відповідного алфавіту в залежності від регістру символу.
                const charIndex = alphabet.indexOf(char);//Знаходження індексу поточного символу в алфавіті.
                const newIndex = (charIndex + shift + alphabet.length) % alphabet.length;//Розрахунок нового індексу для зашифрованого символу.
                char = alphabet[newIndex];//Заміна поточного символу на зашифрований.
            } 
            changed = true;//Позначення того, що символ був змінений.
        } else {//Обробка символів, які не належать українському або англійському алфавітам.
                        
        }
        result += char;//Додавання поточного символу до результуючого рядка
        if (changed) {
            changedIndices.push(i);// Якщо символ був змінений, його індекс додається до масиву changedIndices.
        }
    }
    return { encryptedText: result, changedIndices };//Повернення об'єкта, який містить зашифрований текст та масив індексів змінених символів.
}

function updateAlphabet(encryptedText, changedIndices, className) {
    const selectedAlphabet = document.getElementById("SelectAlphabet").value;
    const alphabetDiv = document.getElementById("alphabet");
    alphabetDiv.innerHTML = "";

    if (selectedAlphabet === "Ukraine") {
        let ukrainianAlphabet = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
        const ukrainianAlphabetUpperCase = ukrainianAlphabet.toUpperCase();
        let isUkrainian = false;

        if (changedIndices && Array.isArray(changedIndices) && encryptedText) {
            for (let i = 0; i < changedIndices.length; i++) {
                const charIndex = changedIndices[i];
                if (charIndex >= 0 && charIndex < encryptedText.length) {
                    const char = encryptedText[charIndex].toLowerCase();
                    if (ukrainianAlphabet.includes(char) || ukrainianAlphabetUpperCase.includes(char) || char === 'і' || char === 'ї' || char === 'ґ' || char === 'є') {
                        isUkrainian = true;
                    }
                }
            }
        }

        let alphabetToDisplay = "";
        if (isUkrainian) {
            alphabetToDisplay = ukrainianAlphabet;
        }

        for (let i = 0; i < alphabetToDisplay.length; i++) {
            const char = alphabetToDisplay[i];
            const span = document.createElement("span");
            span.textContent = char;
            alphabetDiv.appendChild(span);
        }
    } 

    const alphabetSpans = alphabetDiv.getElementsByTagName("span");
    for (let i = 0; i < changedIndices.length; i++) {
        const charIndex = changedIndices[i];
        if (charIndex >= 0 && charIndex < encryptedText.length) {
            const char = encryptedText[charIndex].toLowerCase();
            for (let j = 0; j < alphabetSpans.length; j++) {
                if (alphabetSpans[j].textContent === char) {
                    alphabetSpans[j].classList.add(className);
                }
            }
        }
    }
}



updateAlphabet();

