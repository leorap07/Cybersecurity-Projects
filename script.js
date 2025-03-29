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
}

function cleanAndFormatMTD() {
    const inputText = document.getElementById('mtdInputText').value;
    let cleanedText = inputText.replace(/[{}\"|]/g, '').replace(/\|/g, '\n').trim();

    let lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line !== '');
    let result = lines.map(line => {
        let [key, value] = line.split('=');
        if (value === undefined) value = "null";
        return `${key.trim()}: ${value.trim()}`;
    });

    let formattedOutput = result.join('\n');
    document.getElementById('mtdOutputText').value = formattedOutput;
}

function clearFields() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
}

function clearMTDFields() {
    document.getElementById('mtdInputText').value = '';
    document.getElementById('mtdOutputText').value = '';
}

function clearSplunkFields() {
    document.getElementById('splunkInputText').value = '';
    document.getElementById('splunkOutputText').value = '';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

function showMain() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('mainSection').classList.remove('hidden');
}

function showHistory() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('historySection').classList.remove('hidden');
}

function showMTD() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('mtdSection').classList.remove('hidden');
}

function showSplunk() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('splunkSection').classList.remove('hidden');
}
