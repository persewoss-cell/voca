(function () {
  const STORAGE_KEY = "isadoraMoonVocab";
  const CUSTOM_CHAPTER = "내가 추가한 단어";

  const listEl = document.getElementById("word-list");
  const searchEl = document.getElementById("search");
  const tabsEl = document.getElementById("chapter-tabs");
  const emptyEl = document.getElementById("empty-message");
  const voiceWarningEl = document.getElementById("voice-warning");
  const toggleEnglishBtn = document.getElementById("toggle-english");
  const toggleMeaningBtn = document.getElementById("toggle-meaning");
  const addWordBtn = document.getElementById("add-word-btn");
  const modalEl = document.getElementById("word-modal");
  const modalTitleEl = document.getElementById("modal-title");
  const formEl = document.getElementById("word-form");
  const formWordEl = document.getElementById("form-word");
  const formMeaningEl = document.getElementById("form-meaning");
  const formExampleEl = document.getElementById("form-example");
  const modalCancelBtn = document.getElementById("modal-cancel");

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

  function loadVocab() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) {
      /* localStorage unavailable or corrupted — fall back to base data */
    }
    return VOCAB_DATA.map((item, idx) => ({ id: "base-" + idx, ...item }));
  }

  let vocab = loadVocab();

  function saveVocab() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
    } catch (e) {
      /* storage full or unavailable — changes stay in-memory only */
    }
  }

  function getChapters() {
    const chapters = [];
    vocab.forEach((item) => {
      if (!chapters.includes(item.chapter)) chapters.push(item.chapter);
    });
    return chapters;
  }

  let activeChapter = "전체";
  let query = "";

  function buildTabs() {
    const allTabs = ["전체", ...getChapters()];
    if (!allTabs.includes(activeChapter)) activeChapter = "전체";
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
      (item.example || "").toLowerCase().includes(q)
    );
  }

  function openModal(mode, item) {
    formEl.reset();
    formEl.dataset.mode = mode;
    formEl.dataset.id = item ? item.id : "";
    modalTitleEl.textContent = mode === "edit" ? "단어 수정" : "새 단어 추가";
    if (mode === "edit" && item) {
      formWordEl.value = item.word;
      formMeaningEl.value = item.meaning;
      formExampleEl.value = item.example || "";
    }
    modalEl.hidden = false;
    formWordEl.focus();
  }

  function closeModal() {
    modalEl.hidden = true;
  }

  addWordBtn.addEventListener("click", () => openModal("add"));
  modalCancelBtn.addEventListener("click", closeModal);
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalEl.hidden) closeModal();
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const word = formWordEl.value.trim();
    const meaning = formMeaningEl.value.trim();
    const example = formExampleEl.value.trim();
    if (!word || !meaning) return;

    if (formEl.dataset.mode === "edit") {
      const target = vocab.find((v) => v.id === formEl.dataset.id);
      if (target) {
        target.word = word;
        target.meaning = meaning;
        target.example = example;
      }
    } else {
      vocab.push({
        id: "custom-" + Date.now(),
        chapter: CUSTOM_CHAPTER,
        word,
        pos: "",
        meaning,
        example,
      });
    }
    saveVocab();
    closeModal();
    buildTabs();
    render();
  });

  function deleteWord(id) {
    if (!confirm("이 단어를 삭제할까요?")) return;
    vocab = vocab.filter((v) => v.id !== id);
    saveVocab();
    buildTabs();
    render();
  }

  function render() {
    const filtered = vocab.filter((item) => {
      const chapterMatch = activeChapter === "전체" || item.chapter === activeChapter;
      return chapterMatch && matchesQuery(item);
    });

    listEl.innerHTML = "";
    emptyEl.hidden = filtered.length > 0;

    let lastChapter = null;
    filtered.forEach((item) => {
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

      const left = document.createElement("div");
      left.className = "word-card-left";

      const wordSpeakBtn = document.createElement("button");
      wordSpeakBtn.className = "speak-btn";
      wordSpeakBtn.setAttribute("aria-label", `${item.word} 발음 듣기`);
      wordSpeakBtn.textContent = "🔊";
      wordSpeakBtn.disabled = !supportsSpeech;
      wordSpeakBtn.addEventListener("click", () => speak(item.word, 0.85));

      const wordText = document.createElement("span");
      wordText.className = "word-text";
      wordText.textContent = item.word;

      left.appendChild(wordSpeakBtn);
      left.appendChild(wordText);

      if (item.pos) {
        const pos = document.createElement("span");
        pos.className = "word-pos";
        pos.textContent = item.pos;
        left.appendChild(pos);
      }

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn edit";
      editBtn.setAttribute("aria-label", `${item.word} 수정`);
      editBtn.textContent = "✏️";
      editBtn.addEventListener("click", () => openModal("edit", item));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "icon-btn delete";
      deleteBtn.setAttribute("aria-label", `${item.word} 삭제`);
      deleteBtn.textContent = "🗑️";
      deleteBtn.addEventListener("click", () => deleteWord(item.id));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      top.appendChild(left);
      top.appendChild(actions);

      const meaning = document.createElement("div");
      meaning.className = "word-meaning";
      meaning.textContent = item.meaning;

      card.appendChild(top);
      card.appendChild(meaning);

      if (item.example) {
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
        card.appendChild(exampleRow);
      } else {
        const noExample = document.createElement("div");
        noExample.className = "no-example";
        noExample.textContent = "예문이 없습니다";
        card.appendChild(noExample);
      }

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
