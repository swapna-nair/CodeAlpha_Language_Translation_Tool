const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

// Basic set of languages for the translation tool
const countries = {
    "ar-SA": "Arabic",
    "de-DE": "German",
    "en-GB": "English",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "hi-IN": "Hindi",
    "it-IT": "Italian",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "pt-PT": "Portuguese",
    "ru-RU": "Russian",
    "zh-CN": "Chinese"
};

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "es-ES" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
    
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    
    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    }).catch(() => {
        toText.setAttribute("placeholder", "Error translating.");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from-copy") {
                if(fromText.value) navigator.clipboard.writeText(fromText.value);
            } else {
                if(toText.value) navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(target.id == "from-speech") {
                if(!fromText.value) return;
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                if(!toText.value) return;
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
