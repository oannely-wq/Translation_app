document.addEventListener('DOMContentLoaded', () => {
    const toggleLangBtn = document.getElementById('toggle-lang');
    const toggleListenBtn = document.getElementById('toggle-listen');
    const btnText = toggleListenBtn.querySelector('span');
    
    const srcLangSpan = document.querySelector('.lang-src');
    const dstLangSpan = document.querySelector('.lang-dst');
    const origLangLbl = document.getElementById('orig-lang-lbl');
    const transLangLbl = document.getElementById('trans-lang-lbl');
    
    const originalTextDiv = document.getElementById('original-text');
    const translatedTextDiv = document.getElementById('translated-text');
    
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    // App State
    let mode = 'en-fi'; // 'en-fi' or 'fi-en'
    let isListening = false;
    let recognition = null;
    let fullOriginalText = "";
    let fullTranslatedText = "";

    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // Set initial language
    recognition.lang = 'en-US';

    toggleLangBtn.addEventListener('click', () => {
        if (mode === 'en-fi') {
            mode = 'fi-en';
            srcLangSpan.textContent = "Finnish";
            dstLangSpan.textContent = "English";
            origLangLbl.textContent = "Finnish";
            transLangLbl.textContent = "English";
            recognition.lang = 'fi-FI';
        } else {
            mode = 'en-fi';
            srcLangSpan.textContent = "English";
            dstLangSpan.textContent = "Finnish";
            origLangLbl.textContent = "English";
            transLangLbl.textContent = "Finnish";
            recognition.lang = 'en-US';
        }
        
        // Restart recognition if listening to apply new language
        if (isListening) {
            recognition.stop();
        }
    });

    toggleListenBtn.addEventListener('click', () => {
        if (!isListening) {
            try {
                recognition.start();
            } catch (e) {
                console.error("Recognition already started");
            }
        } else {
            recognition.stop();
            isListening = false;
            updateUIState();
        }
    });

    recognition.onstart = () => {
        isListening = true;
        updateUIState();
        if (fullOriginalText === "") {
            originalTextDiv.innerHTML = "";
            originalTextDiv.classList.remove("placeholder");
            translatedTextDiv.innerHTML = "";
            translatedTextDiv.classList.remove("placeholder");
        }
    };

    recognition.onresult = async (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript !== '') {
            fullOriginalText += finalTranscript + " ";
            originalTextDiv.innerHTML = fullOriginalText + `<span class="interim-text">${interimTranscript}</span>`;
            
            // Translate final text
            statusText.textContent = "Translating...";
            const translatedPhrase = await translateText(finalTranscript, mode);
            fullTranslatedText += translatedPhrase + " ";
            translatedTextDiv.innerHTML = fullTranslatedText;
            statusText.textContent = "Listening...";
        } else {
            originalTextDiv.innerHTML = fullOriginalText + `<span class="interim-text">${interimTranscript}</span>`;
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
            isListening = false;
            updateUIState();
            statusText.textContent = "Microphone access denied. Please allow it in the browser.";
            statusDot.classList.remove('pulse');
            statusDot.style.backgroundColor = 'var(--danger)';
        }
    };

    recognition.onend = () => {
        if (isListening) {
            // Restart automatically for continuous listening
            try {
                recognition.start();
            } catch (e) {
                console.error("Failed to restart recognition");
            }
        }
    };

    function updateUIState() {
        if (isListening) {
            toggleListenBtn.classList.add('listening');
            btnText.textContent = "Stop Listening";
            statusDot.classList.add('pulse');
            statusDot.style.backgroundColor = '';
            statusText.textContent = "Listening...";
        } else {
            toggleListenBtn.classList.remove('listening');
            btnText.textContent = "Start Listening";
            statusDot.classList.remove('pulse');
            statusText.textContent = "Ready to listen";
        }
    }

    async function translateText(text, direction) {
        const langpair = direction === 'en-fi' ? 'en|fi' : 'fi|en';
        // Using MyMemory open API. No authentication needed for moderate usage
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.responseData && data.responseData.translatedText) {
                return data.responseData.translatedText;
            }
            return "[Translation Failed]";
        } catch (error) {
            console.error("Translation error", error);
            return "[Network Error]";
        }
    }
});
