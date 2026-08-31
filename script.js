(function () {
  const homeScreenEl = document.getElementById("home-screen");
  const appScreenEl = document.getElementById("app-screen");
  const enterIsadoraBtn = document.getElementById("enter-isadora");

  enterIsadoraBtn.addEventListener("click", () => {
    homeScreenEl.hidden = true;
    appScreenEl.hidden = false;
  });

  const listEl = document.getElementById("word-list");
  const searchEl = document.getElementById("search");
  const tabsEl = document.getElementById("chapter-tabs");
  const emptyEl = document.getElementById("empty-message");
  const voiceWarningEl = document.getElementById("voice-warning");
  const toggleEnglishBtn = document.getElementById("toggle-english");
  const toggleMeaningBtn = document.getElementById("toggle-meaning");

  const supportsSpeech = "speechSynthesis" in window;
  if (!supportsSpeech) {
    voiceWarningEl.hidden = false;
  }

  let englishVoice = null;
  function pickVoice() {
    if (!supportsSpeech) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    englishVoice =
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang && v.lang.startsWith("en-GB")) ||
      voices.find((v) => v.lang && v.lang.startsWith("en")) ||
      voices[0];
  }
  if (supportsSpeech) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text, rate) {
    if (!supportsSpeech) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    if (englishVoice) utterance.voice = englishVoice;
    utterance.rate = rate || 0.95;
    window.speechSynthesis.speak(utterance);
  }

  const chapters = [];
  VOCAB_DATA.forEach((item) => {
    if (!chapters.includes(item.chapter)) chapters.push(item.chapter);
  });

  let activeChapter = "전체";
  let query = "";

  function buildTabs() {
    const allTabs = ["전체", ...chapters];
    tabsEl.innerHTML = "";
    allTabs.forEach((chapter) => {
      const btn = document.createElement("button");
      btn.className = "chapter-tab" + (chapter === activeChapter ? " active" : "");
      btn.textContent = chapter;
      btn.addEventListener("click", () => {
        activeChapter = chapter;
        buildTabs();
        render();
      });
      tabsEl.appendChild(btn);
    });
  }

  function matchesQuery(item) {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.word.toLowerCase().includes(q) ||
      item.meaning.toLowerCase().includes(q) ||
      item.example.toLowerCase().includes(q)
    );
  }

  function render() {
    const filtered = VOCAB_DATA.filter((item) => {
      const chapterMatch = activeChapter === "전체" || item.chapter === activeChapter;
      return chapterMatch && matchesQuery(item);
    });

    listEl.innerHTML = "";
    emptyEl.hidden = filtered.length > 0;

    let lastChapter = null;
    filtered.forEach((item, idx) => {
      if (item.chapter !== lastChapter && activeChapter === "전체") {
        const heading = document.createElement("div");
        heading.className = "chapter-heading";
        heading.textContent = item.chapter;
        listEl.appendChild(heading);
        lastChapter = item.chapter;
      }

      const card = document.createElement("div");
      card.className = "word-card";

      const top = document.createElement("div");
      top.className = "word-card-top";

      const wordSpeakBtn = document.createElement("button");
      wordSpeakBtn.className = "speak-btn";
      wordSpeakBtn.setAttribute("aria-label", `${item.word} 발음 듣기`);
      wordSpeakBtn.textContent = "🔊";
      wordSpeakBtn.disabled = !supportsSpeech;
      wordSpeakBtn.addEventListener("click", () => speak(item.word, 0.85));

      const wordText = document.createElement("span");
      wordText.className = "word-text";
      wordText.textContent = item.word;

      const pos = document.createElement("span");
      pos.className = "word-pos";
      pos.textContent = item.pos;

      top.appendChild(wordSpeakBtn);
      top.appendChild(wordText);
      top.appendChild(pos);

      const meaning = document.createElement("div");
      meaning.className = "word-meaning";
      meaning.textContent = item.meaning;

      const exampleRow = document.createElement("div");
      exampleRow.className = "example-row";

      const exampleSpeakBtn = document.createElement("button");
      exampleSpeakBtn.className = "speak-btn small";
      exampleSpeakBtn.setAttribute("aria-label", "예문 발음 듣기");
      exampleSpeakBtn.textContent = "🔊";
      exampleSpeakBtn.disabled = !supportsSpeech;
      exampleSpeakBtn.addEventListener("click", () => speak(item.example, 1));

      const exampleText = document.createElement("span");
      exampleText.className = "example-text";
      exampleText.textContent = item.example;

      exampleRow.appendChild(exampleSpeakBtn);
      exampleRow.appendChild(exampleText);

      card.appendChild(top);
      card.appendChild(meaning);
      card.appendChild(exampleRow);

      listEl.appendChild(card);
    });
  }

  searchEl.addEventListener("input", (e) => {
    query = e.target.value.trim();
    render();
  });

  toggleEnglishBtn.addEventListener("click", () => {
    document.body.classList.toggle("hide-english");
    toggleEnglishBtn.classList.toggle("active");
  });

  toggleMeaningBtn.addEventListener("click", () => {
    document.body.classList.toggle("hide-meaning");
    toggleMeaningBtn.classList.toggle("active");
  });

  buildTabs();
  render();
})();
