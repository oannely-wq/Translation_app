# Live Voice Translator 🎙️🌍

A modern, latency-free web application that listens to your voice and translates it in real-time between English and Finnish. Built natively with HTML, CSS, and Vanilla JavaScript.

## 🚀 Features

- **Live Voice Recognition:** Utilizes the browser's built-in Web Speech API (`SpeechRecognition`) for fast and accurate live dictation.
- **Bi-Directional Translation:** Easily toggle between English → Finnish and Finnish → English with the click of a button.
- **Modern Premium Interface:** Beautiful glassmorphic UI, smooth CSS micro-animations, and responsive design tailored for any device.
- **No Setup Required:** Works entirely in the browser using free public APIs. Just open the HTML file.

## 🛠️ How to Use

1. **Open the App:** Simply double-click `index.html` to open it in a modern browser like **Google Chrome** or **Microsoft Edge**.
 *(Firefox and Safari have limited support for the SpeechRecognition API, so Chrome is highly recommended).*
2. **Select Language:** Use the toggle button at the top to choose the translation direction (English to Finnish, or Finnish to English).
3. **Start Translating:** Click the **Start Listening** button. 
4. **Grant Permissions:** Your browser will ask for microphone access. Click **Allow**.
5. Speak naturally into your microphone! As you finish sentences, they will automatically be translated without latency.

## 🏗️ Technical Details

- `index.html`: The core layout and semantic structure.
- `style.css`: Premium aesthetics including dark mode base, CSS variables, flexbox/grid layouts, and pulse animations.
- `app.js`: Connects to `window.SpeechRecognition` for listening, and fetches data from the `MyMemory Translator API` for lightweight automatic translation.
