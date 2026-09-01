// 단어장 화면 공통 로직 (Isadora Moon, 그리고 직접 만든 단어장 페이지에서 공용으로 사용)
function initVocabApp(config) {
  const storageKey = config.storageKey;
  const initialData = config.initialData || [];
  const showChapters = !!config.showChapters;
  const CUSTOM_CHAPTER = "내가 추가한 단어";

  const listEl = document.getElementById("word-list");
  const searchEl = document.getElementById("search");
  const searchBtn = document.getElementById("search-btn");
  const tabsEl = document.getElementById("chapter-tabs");
  const emptyEl = document.getElementById("empty-message");
  const defaultEmptyText = emptyEl.textContent;
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
  const dictSearchBtn = document.getElementById("dict-search-btn");
  const dictModalEl = document.getElementById("dict-modal");
  const dictModalCloseBtn = document.getElementById("dict-modal-close");
  const dictIframeEl = document.getElementById("dict-iframe");
  const dictSuggestionsEl = document.getElementById("dict-suggestions");
  const dictSuggestionListEl = document.getElementById("dict-suggestion-list");

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
    // 예문은 검색 대상에서 제외 — 단어/뜻에만 일치해야 검색됨
    return item.word.toLowerCase().includes(q) || item.meaning.toLowerCase().includes(q);
  }

  // ---- 새 단어 추가/수정 모달 + 네이버 사전 검색 팝업(화면 내) ----

  function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
  }

  function looksUseless(text, word) {
    if (!text) return true;
    const t = text.trim();
    if (!t) return true;
    if (t.toLowerCase() === word.trim().toLowerCase()) return true;
    if (/mymemory warning|invalid|query length/i.test(t)) return true;
    return false;
  }

  // "추천 뜻 자동입력" 패널용 후보 뜻 목록 — 네이버 사전 팝업(iframe)은 다른 도메인이라
  // 그 안의 검색 결과를 읽어올 수 없으므로(교차 출처 제한), 별도의 사전/번역 API에서
  // 후보를 가져와 사용자가 직접 고르게 한다.
  async function fetchMeaningCandidates(word) {
    const candidates = [];
    const seen = new Set();
    function add(text) {
      if (!text) return;
      const t = String(text).trim();
      if (!t || looksUseless(t, word)) return;
      const key = t.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push(t);
    }

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
        add(text);
      }
    } catch (e) {
      /* ignore — try the other provider */
    }

    try {
      const res = await fetchWithTimeout(
        "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(word) + "&langpair=en|ko",
        6000
      );
      if (res.ok) {
        const data = await res.json();
        add(data && data.responseData && data.responseData.translatedText);
        (Array.isArray(data && data.matches) ? data.matches : [])
          .slice()
          .sort((a, b) => (b.match || 0) - (a.match || 0))
          .forEach((m) => add(m && m.translation));
      }
    } catch (e) {
      /* ignore — show whatever we already have */
    }

    return candidates.slice(0, 6);
  }

  let suggestionRequestToken = 0;

  async function loadSuggestions(word) {
    if (!dictSuggestionListEl) return;
    const token = ++suggestionRequestToken;
    dictSuggestionListEl.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "suggestion-status";
    loading.textContent = "찾는 중...";
    dictSuggestionListEl.appendChild(loading);

    const candidates = await fetchMeaningCandidates(word);
    if (token !== suggestionRequestToken) return; // 검색어가 그새 바뀜 — 오래된 결과 버림

    dictSuggestionListEl.innerHTML = "";
    if (!candidates.length) {
      const empty = document.createElement("p");
      empty.className = "suggestion-status";
      empty.textContent = "추천 뜻을 찾지 못했어요. 왼쪽 사전 결과를 참고해 직접 입력해주세요.";
      dictSuggestionListEl.appendChild(empty);
      return;
    }

    candidates.forEach((text) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "suggestion-chip";
      chip.textContent = text;
      chip.addEventListener("click", () => {
        formMeaningEl.value = text;
        dictSuggestionListEl.querySelectorAll(".suggestion-chip.selected").forEach((el) => {
          el.classList.remove("selected");
        });
        chip.classList.add("selected");
      });
      dictSuggestionListEl.appendChild(chip);
    });
  }

  function openDictModal(withSuggestions, wordOverride) {
    if (!dictModalEl || !dictIframeEl) return;
    const word = (wordOverride !== undefined ? wordOverride : formWordEl.value).trim();
    if (!word) return;
    dictIframeEl.src = "https://en.dict.naver.com/#/search?query=" + encodeURIComponent(word);
    if (dictSuggestionsEl) dictSuggestionsEl.hidden = !withSuggestions;
    if (withSuggestions) loadSuggestions(word);
    dictModalEl.hidden = false;
  }

  function closeDictModal() {
    if (!dictModalEl) return;
    dictModalEl.hidden = true;
    if (dictIframeEl) dictIframeEl.src = "about:blank";
  }

  if (dictSearchBtn) dictSearchBtn.addEventListener("click", () => openDictModal(true));
  if (dictModalCloseBtn) dictModalCloseBtn.addEventListener("click", closeDictModal);
  if (dictModalEl) {
    dictModalEl.addEventListener("click", (e) => {
      if (e.target === dictModalEl) closeDictModal();
    });
  }
  if (formWordEl) {
    formWordEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        openDictModal(true);
      }
    });
  }

  function openModal(mode, item, prefillWord) {
    formEl.reset();
    formEl.dataset.mode = mode;
    formEl.dataset.id = item ? item.id : "";
    modalTitleEl.textContent = mode === "edit" ? "단어 수정" : "새 단어 추가";
    if (mode === "edit" && item) {
      formWordEl.value = item.word;
      formMeaningEl.value = item.meaning;
      formExampleEl.value = item.example || "";
    } else if (prefillWord) {
      formWordEl.value = prefillWord;
    }
    modalEl.hidden = false;
    formWordEl.focus();
  }

  function closeModal() {
    modalEl.hidden = true;
    closeDictModal();
  }

  if (addWordBtn) addWordBtn.addEventListener("click", () => openModal("add"));
  modalCancelBtn.addEventListener("click", closeModal);
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (dictModalEl && !dictModalEl.hidden) {
      closeDictModal();
      return;
    }
    if (!modalEl.hidden) closeModal();
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
        id: "custom-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        chapter: CUSTOM_CHAPTER,
        word,
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

  function renderEmptyState() {
    emptyEl.innerHTML = "";
    if (!query) {
      const msg = document.createElement("p");
      msg.className = "empty-message-text";
      msg.textContent = defaultEmptyText;
      emptyEl.appendChild(msg);
      return;
    }

    const msg = document.createElement("p");
    msg.className = "empty-message-text";
    msg.textContent = `"${query}" 검색 결과가 없습니다.`;

    const actions = document.createElement("div");
    actions.className = "empty-actions";

    const searchAction = document.createElement("button");
    searchAction.type = "button";
    searchAction.className = "modal-btn secondary";
    searchAction.textContent = "검색";
    searchAction.addEventListener("click", () => openDictModal(false, query));

    const addAction = document.createElement("button");
    addAction.type = "button";
    addAction.className = "modal-btn primary";
    addAction.textContent = "+ 새단어 추가";
    addAction.addEventListener("click", () => openModal("add", null, query));

    actions.appendChild(searchAction);
    actions.appendChild(addAction);
    emptyEl.appendChild(msg);
    emptyEl.appendChild(actions);
  }

  function render() {
    const filtered = vocab.filter((item) => {
      const chapterMatch = !showChapters || activeChapter === "전체" || item.chapter === activeChapter;
      return chapterMatch && matchesQuery(item);
    });

    listEl.innerHTML = "";
    emptyEl.hidden = filtered.length > 0;
    if (filtered.length === 0) renderEmptyState();

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

  function performSearch() {
    query = searchEl.value.trim();
    render();
  }

  searchEl.addEventListener("input", performSearch);
  searchEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });
  if (searchBtn) searchBtn.addEventListener("click", performSearch);

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
