function formatText() {
    const inputText = document.getElementById('inputText').value;
    const lines = inputText.trim().split('\n');
    
    if (lines.length % 2 !== 0) {
        alert("The input does not contain an even number of lines.");
        return;
    }

    let result = [];
    for (let i = 0; i < lines.length; i += 2) {
        const key = lines[i].trim();
        const value = lines[i + 1].trim();
        result.push(`${key}: ${value}`);
    }

    document.getElementById('outputText').value = result.join('\n');
}