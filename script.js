
function generatePassword() {
    const length = Number(document.getElementById("length").value);
    const useUpper = document.getElementById("uppercase").checked;
    const useLower = document.getElementById("lowercase").checked;
    const useNumbers = document.getElementById("numbers").checked;
    const useSymbols = document.getElementById("symbols").checked;

    const message = document.getElementById("message");
    const passwordField = document.getElementById("password");

    const groups = [];

    if (useUpper) groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (useLower) groups.push("abcdefghijklmnopqrstuvwxyz");
    if (useNumbers) groups.push("0123456789");
    if (useSymbols) groups.push("!@#$%^&*()_+-=");

    if (!Number.isInteger(length) || length < 4 || length > 50) {
        message.textContent = "Choose a length from 4 to 50.";
        passwordField.value = "";
        return;
    }

    if (groups.length === 0) {
        message.textContent = "Select at least one character type.";
        passwordField.value = "";
        return;
    }

    const allCharacters = groups.join("");
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let password = "";

    // Include at least one character from each selected type.
    for (let i = 0; i < groups.length && i < length; i++) {
        password += groups[i][randomValues[i] % groups[i].length];
    }

    for (let i = password.length; i < length; i++) {
        password += allCharacters[
            randomValues[i] % allCharacters.length
        ];
    }

    // Shuffle the characters.
    const chars = Array.from(password);

    for (let i = chars.length - 1; i > 0; i--) {
        const values = new Uint32Array(1);
        crypto.getRandomValues(values);
        const j = values[0] % (i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    passwordField.value = chars.join("");
    message.textContent = "Password generated successfully!";
}

async function copyPassword() {
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (!password) {
        message.textContent = "Generate a password first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        message.textContent = "Password copied!";
    } catch (error) {
        message.textContent = "Copy unavailable. Please copy it manually.";
    }
}
