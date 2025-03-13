let history = [];

function formatText() {
    const inputText = document.getElementById('inputText').value;
    let lines = inputText.split('\n').map(line => line.trim()).filter(line => line !== '');

    if (lines.length % 2 !== 0) {
        alert("The input does not contain an even number of meaningful lines.");
        return;
    }

    let result = [];
    for (let i = 0; i < lines.length; i += 2) {
        const key = lines[i];
        const value = lines[i + 1];
        result.push(`${key}: ${value}`);
    }

    let formattedOutput = result.join('\n');
    document.getElementById('outputText').value = formattedOutput;

    // Save to history
    saveToHistory(formattedOutput);
}

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

// Show Main Section
function showMain() {
    toggleSidebar();
    document.getElementById('mainSection').classList.remove('hidden');
    document.getElementById('historySection').classList.add('hidden');
}

// Show History Section
function showHistory() {
    toggleSidebar();
    document.getElementById('mainSection').classList.add('hidden');
    document.getElementById('historySection').classList.remove('hidden');
    updateHistoryDisplay();
}

// Save History (Max 10 Entries, Separated by 3 New Lines and a Separator)
function saveToHistory(output) {
    history.push(output);
    if (history.length > 10) {
        history.shift(); // Keep only the last 10 entries
    }
}

// Display History with Proper Formatting
function updateHistoryDisplay() {
    let historyDisplay = document.getElementById('historyOutput');

    if (history.length > 0) {
        historyDisplay.innerText = history
            .map(entry => entry + "\n\n------------------------------------\n\n")
            .join('');
    } else {
        historyDisplay.innerText = "No history available.";
    }
}

function copyToClipboard() {
    const outputText = document.getElementById('outputText');

    if (!outputText.value) {
        alert("No text to copy!");
        return;
    }

    outputText.select();
    navigator.clipboard.writeText(outputText.value)
        .then(() => {
            alert("Formatted output copied to clipboard!");
        })
        .catch(err => {
            alert("Failed to copy text!");
            console.error("Copy error:", err);
        });
}

