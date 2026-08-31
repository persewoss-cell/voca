// 단어장 화면 공통 로직 (Isadora Moon, 그리고 직접 만든 단어장 페이지에서 공용으로 사용)
function initVocabApp(config) {
  const storageKey = config.storageKey;
  const initialData = config.initialData || [];
  const showChapters = !!config.showChapters;
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
  const autofillBtn = document.getElementById("autofill-btn");
  const autofillHint = document.getElementById("autofill-hint");

  const supportsSpeech = "speechSynthesis" in window;
  if (!supportsSpeech && voiceWarningEl) {
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
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      /* localStorage unavailable or corrupted — fall back to initial data */
    }
    return initialData.map((item, idx) => ({ id: "base-" + idx, ...item }));
  }

  let vocab = loadVocab();

  function saveVocab() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(vocab));
    } catch (e) {
      /* storage full or unavailable — changes stay in-memory only */
    }
  }

  function getChapters() {
    const chapters = [];
    vocab.forEach((item) => {
      if (item.chapter && !chapters.includes(item.chapter)) chapters.push(item.chapter);
    });
    return chapters;
  }

  let activeChapter = "전체";
  let query = "";

  function buildTabs() {
    if (!showChapters || !tabsEl) return;
    const allTabs = ["전체", ...getChapters()];
    if (!allTabs.includes(activeChapter)) activeChapter = "전체";
    tabsEl.innerHTML = "";
    allTabs.forEach((chapter) => {
      const btn = document.createElement("button");
      btn.type = "button";
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

  // ---- 새 단어 추가/수정 모달 + 자동완성(뜻/품사/발음기호) ----

  const POS_KR = {
    noun: "명사",
    verb: "동사",
    adjective: "형용사",
    adverb: "부사",
    pronoun: "대명사",
    preposition: "전치사",
    conjunction: "접속사",
    interjection: "감탄사",
    exclamation: "감탄사",
    determiner: "한정사",
    number: "수사",
  };

  let pendingPos = "";
  let pendingPhonetic = "";
  let autoFillToken = 0;
  let lastAutoFilledWord = "";

  function resetPending() {
    pendingPos = "";
    pendingPhonetic = "";
    lastAutoFilledWord = "";
    if (autofillHint) {
      autofillHint.hidden = true;
      autofillHint.textContent = "";
    }
  }

  function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
  }

  async function fetchDictionaryInfo(word) {
    try {
      const res = await fetchWithTimeout(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word),
        6000
      );
      if (!res.ok) return { pos: "", phonetic: "" };
      const data = await res.json();
      const entry = Array.isArray(data) && data[0];
      if (!entry) return { pos: "", phonetic: "" };
      const phonetic = entry.phonetic || (entry.phonetics || []).map((p) => p.text).find(Boolean) || "";
      const posRaw = (entry.meanings || [])[0] && entry.meanings[0].partOfSpeech;
      return { pos: posRaw ? POS_KR[posRaw] || posRaw : "", phonetic };
    } catch (e) {
      return { pos: "", phonetic: "" };
    }
  }

  function looksUseless(text, word) {
    if (!text) return true;
    const t = text.trim();
    if (!t) return true;
    if (t.toLowerCase() === word.trim().toLowerCase()) return true;
    if (/mymemory warning|invalid|query length/i.test(t)) return true;
    return false;
  }

  async function fetchTranslation(word) {
    // Primary: Google Translate's public endpoint (no key needed, generally the
    // most reliable of the free options). Falls back to MyMemory if it fails
    // or returns something unusable (e.g. a rate-limit warning string).
    try {
      const res = await fetchWithTimeout(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=" +
          encodeURIComponent(word),
        6000
      );
      if (res.ok) {
        const data = await res.json();
        const text = Array.isArray(data) && Array.isArray(data[0])
          ? data[0].map((segment) => segment[0]).join("")
          : "";
        if (!looksUseless(text, word)) return text.trim();
      }
    } catch (e) {
      /* fall through to secondary provider */
    }

    try {
      const res = await fetchWithTimeout(
        "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(word) + "&langpair=en|ko",
        6000
      );
      if (res.ok) {
        const data = await res.json();
        const text = data && data.responseData && data.responseData.translatedText;
        if (!looksUseless(text, word)) return text.trim();
      }
    } catch (e) {
      /* both providers failed */
    }

    return "";
  }

  async function runAutoFill(force) {
    if (!formWordEl) return;
    const word = formWordEl.value.trim();
    if (!word) return;
    if (!force && word === lastAutoFilledWord) return;

    const token = ++autoFillToken;

    if (autofillBtn) {
      autofillBtn.disabled = true;
      autofillBtn.dataset.originalLabel = autofillBtn.dataset.originalLabel || autofillBtn.textContent;
      autofillBtn.textContent = "찾는 중...";
    }
    if (autofillHint) {
      autofillHint.textContent = "뜻을 찾는 중이에요...";
      autofillHint.hidden = false;
    }

    const [dictInfo, translated] = await Promise.all([fetchDictionaryInfo(word), fetchTranslation(word)]);

    // A newer call (word changed again, or the field was reset) started while
    // this one was in flight — discard this stale result instead of clobbering
    // whatever the user is looking at now.
    if (token !== autoFillToken) return;

    lastAutoFilledWord = word;
    pendingPos = dictInfo.pos;
    pendingPhonetic = dictInfo.phonetic;

    let meaningFilled = false;
    if (translated && formMeaningEl && !formMeaningEl.value.trim()) {
      formMeaningEl.value = translated;
      meaningFilled = true;
    }

    if (autofillBtn) {
      autofillBtn.disabled = false;
      autofillBtn.textContent = autofillBtn.dataset.originalLabel || "자동완성";
    }

    if (autofillHint) {
      const parts = [];
      if (meaningFilled) parts.push("뜻 자동 입력됨");
      if (dictInfo.pos) parts.push("품사: " + dictInfo.pos);
      if (dictInfo.phonetic) parts.push("발음기호: " + dictInfo.phonetic);
      autofillHint.textContent = parts.length
        ? parts.join(" · ")
        : "자동으로 찾지 못했어요. 직접 입력해주세요.";
      autofillHint.hidden = false;
    }
  }

  if (autofillBtn) {
    autofillBtn.addEventListener("click", () => runAutoFill(true));
  }
  if (formWordEl) {
    formWordEl.addEventListener("input", resetPending);
    formWordEl.addEventListener("blur", () => {
      if (formWordEl.value.trim()) runAutoFill(false);
    });
  }

  function openModal(mode, item) {
    formEl.reset();
    resetPending();
    formEl.dataset.mode = mode;
    formEl.dataset.id = item ? item.id : "";
    modalTitleEl.textContent = mode === "edit" ? "단어 수정" : "새 단어 추가";
    if (mode === "edit" && item) {
      formWordEl.value = item.word;
      formMeaningEl.value = item.meaning;
      formExampleEl.value = item.example || "";
      pendingPos = item.pos || "";
      pendingPhonetic = item.phonetic || "";
    }
    modalEl.hidden = false;
    formWordEl.focus();
  }

  function closeModal() {
    modalEl.hidden = true;
  }

  if (addWordBtn) addWordBtn.addEventListener("click", () => openModal("add"));
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
        if (pendingPos) target.pos = pendingPos;
        if (pendingPhonetic) target.phonetic = pendingPhonetic;
      }
    } else {
      vocab.push({
        id: "custom-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        chapter: CUSTOM_CHAPTER,
        word,
        pos: pendingPos,
        phonetic: pendingPhonetic,
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
    if (!confirm("이 단어를 삭제할까요? 삭제하면 되돌릴 수 없습니다.")) return;
    vocab = vocab.filter((v) => v.id !== id);
    saveVocab();
    buildTabs();
    render();
  }

  // ---- 목록 렌더링 ----

  function render() {
    const filtered = vocab.filter((item) => {
      const chapterMatch = !showChapters || activeChapter === "전체" || item.chapter === activeChapter;
      return chapterMatch && matchesQuery(item);
    });

    listEl.innerHTML = "";
    emptyEl.hidden = filtered.length > 0;

    let lastChapter = null;
    filtered.forEach((item) => {
      if (showChapters && item.chapter !== lastChapter && activeChapter === "전체") {
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
      wordText.className = "word-text maskable";
      wordText.textContent = item.word;
      wordText.addEventListener("click", () => {
        if (document.body.classList.contains("hide-english")) {
          wordText.classList.toggle("revealed");
        }
      });

      left.appendChild(wordSpeakBtn);
      left.appendChild(wordText);

      if (item.phonetic) {
        const phonetic = document.createElement("span");
        phonetic.className = "word-phonetic";
        phonetic.textContent = item.phonetic;
        left.appendChild(phonetic);
      }

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
      meaning.className = "word-meaning maskable";
      meaning.textContent = item.meaning;
      meaning.addEventListener("click", () => {
        if (document.body.classList.contains("hide-meaning")) {
          meaning.classList.toggle("revealed");
        }
      });

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
    document.querySelectorAll(".word-text.revealed").forEach((el) => el.classList.remove("revealed"));
    toggleEnglishBtn.classList.toggle("active");
  });

  toggleMeaningBtn.addEventListener("click", () => {
    document.body.classList.toggle("hide-meaning");
    document.querySelectorAll(".word-meaning.revealed").forEach((el) => el.classList.remove("revealed"));
    toggleMeaningBtn.classList.toggle("active");
  });

  buildTabs();
  render();
}
