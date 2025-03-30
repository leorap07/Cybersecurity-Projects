//
// MAIN Summarization (pairs of lines)
//
function formatText() {
    const inputText = document.getElementById('inputText').value;
    let lines = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    // The main parser expects pairs of lines (key, value, key, value, etc.)
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
    let output = result.join('\n');
    document.getElementById('outputText').value = output;
    appendToHistory("Sentinel/Cortex", output);
  }
  
  function clearFields() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
  }
  
  //
  // MTD Parser (space-delimited key-value pairs)
  //
  function cleanAndFormatMTD() {
    const inputText = document.getElementById('mtdInputText').value.trim();
    const regex = /(\S+)=("[^"]*"|\S+)/g;
    let match;
    let result = [];
    while ((match = regex.exec(inputText)) !== null) {
      let key = match[1];
      let value = match[2];
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      result.push(`${key}: ${value}`);
    }
    let output = result.join('\n');
    document.getElementById('mtdOutputText').value = output;
    appendToHistory("MTD (Fusion Raw)", output);
  }
  
  function clearMTDFields() {
    document.getElementById('mtdInputText').value = '';
    document.getElementById('mtdOutputText').value = '';
  }
  
  //
  // SPLUNK Parser (pipe-delimited key-value pairs with special formatting for results)
  //
  function processSplunkLogs() {
    const inputText = document.getElementById('splunkInputText').value.trim();
    let parts = inputText.split('|')
      .map(part => part.trim())
      .filter(part => part !== '');
    
    let result = parts.map(field => {
      if (field.includes('=')) {
        let [key, ...valueParts] = field.split('=');
        let value = valueParts.join('=').trim();
        if (!value) value = "null";
        
        if (key.trim() === "results" && value.startsWith('[')) {
          let formattedJson = formatJsonResults(value);
          return `${key.trim()}:\n${formattedJson}`;
        } else {
          return `${key.trim()}: ${value}`;
        }
      } else {
        return `${field}: null`;
      }
    });
    
    let output = result.join('\n');
    document.getElementById('splunkOutputText').value = output;
    appendToHistory("Splunk (Fusion Raw)", output);
  }
  
  function clearSplunkFields() {
    document.getElementById('splunkInputText').value = '';
    document.getElementById('splunkOutputText').value = '';
  }
  
  //
  // Helper function to format JSON in Splunk "results" field
  //
  function formatJsonResults(jsonString) {
    try {
      let arr = JSON.parse(jsonString);
      let resultLines = [];
      if (Array.isArray(arr)) {
        arr.forEach((obj, index) => {
          Object.entries(obj).forEach(([k, v]) => {
            resultLines.push(`${k}: ${v}`);
          });
          if (arr.length > 1 && index < arr.length - 1) {
            resultLines.push("");
          }
        });
      } else if (typeof arr === "object") {
        Object.entries(arr).forEach(([k, v]) => {
          resultLines.push(`${k}: ${v}`);
        });
      } else {
        return jsonString;
      }
      return resultLines.join('\n');
    } catch (e) {
      return jsonString;
    }
  }
  
  //
  // Append output to History Section
  //
  function appendToHistory(source, output) {
    const historyElem = document.getElementById('historyOutput');
    let separator = "\n======================\n";
    let newEntry = `${source} Output:\n${output}`;
    if (historyElem.textContent.trim() !== "") {
      historyElem.textContent += separator + newEntry;
    } else {
      historyElem.textContent = newEntry;
    }
  }
  
  //
  // Copy Output Function (select + copy silently)
  //
  function copyOutput(elementId) {
    const outputElement = document.getElementById(elementId);
    outputElement.focus();
    outputElement.select();
    // Use execCommand if available
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      document.execCommand('copy');
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(outputElement.value).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }
  
  //
  // Section Switching Functions
  //
  function showMain() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('mainSection').classList.remove('hidden');
  }
  
  function showMTD() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('mtdSection').classList.remove('hidden');
  }
  
  function showSplunk() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('splunkSection').classList.remove('hidden');
  }
  
  function showHistory() {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById('historySection').classList.remove('hidden');
  }
  
