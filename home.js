// 첫 화면: 직접 만든 단어장 목록(추가/수정/삭제)을 관리
(function () {
  const STORAGE_KEY = "vocaBooks";

  const listEl = document.getElementById("book-list");
  const addBtn = document.getElementById("add-book-btn");
  const modalEl = document.getElementById("book-modal");
  const modalTitleEl = document.getElementById("book-modal-title");
  const formEl = document.getElementById("book-form");
  const nameEl = document.getElementById("form-book-name");
  const cancelBtn = document.getElementById("book-modal-cancel");

  function loadBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveBooks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      /* storage full or unavailable — changes stay in-memory only */
    }
  }

  let books = loadBooks();

  function openModal(mode, book) {
    formEl.reset();
    formEl.dataset.mode = mode;
    formEl.dataset.id = book ? book.id : "";
    modalTitleEl.textContent = mode === "edit" ? "단어장 이름 수정" : "새 단어장 추가";
    if (mode === "edit" && book) nameEl.value = book.name;
    modalEl.hidden = false;
    nameEl.focus();
  }

  function closeModal() {
    if (document.activeElement) document.activeElement.blur(); // 가상 키보드가 열려 있으면 접는다
    modalEl.hidden = true;
  }

  addBtn.addEventListener("click", () => openModal("add"));
  cancelBtn.addEventListener("click", closeModal);
  // 배경(창 밖) 클릭이나 Esc로는 닫히지 않도록 한다 — 취소 버튼으로만 닫는다.

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameEl.value.trim();
    if (!name) return;

    if (formEl.dataset.mode === "edit") {
      const target = books.find((b) => b.id === formEl.dataset.id);
      if (target) target.name = name;
    } else {
      books.push({
        id: "book-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name,
      });
    }
    saveBooks();
    closeModal();
    render();
  });

  function deleteBook(id, name) {
    const ok = confirm(
      `"${name}" 단어장을 삭제할까요?\n삭제하면 이 단어장에 추가한 모든 단어가 함께 사라지고 되돌릴 수 없습니다.`
    );
    if (!ok) return;
    books = books.filter((b) => b.id !== id);
    saveBooks();
    try {
      localStorage.removeItem("vocaBookWords_" + id);
    } catch (e) {
      /* ignore */
    }
    render();
  }

  function render() {
    listEl.querySelectorAll(".book-row.custom").forEach((el) => el.remove());

    books.forEach((book) => {
      const row = document.createElement("div");
      row.className = "book-row custom";

      const link = document.createElement("a");
      link.className = "book-btn";
      link.href = "book.html?id=" + encodeURIComponent(book.id);
      link.textContent = book.name;

      const actions = document.createElement("div");
      actions.className = "book-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "icon-btn edit";
      editBtn.setAttribute("aria-label", `${book.name} 이름 수정`);
      editBtn.textContent = "✏️";
      editBtn.addEventListener("click", () => openModal("edit", book));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "icon-btn delete";
      deleteBtn.setAttribute("aria-label", `${book.name} 삭제`);
      deleteBtn.textContent = "🗑️";
      deleteBtn.addEventListener("click", () => deleteBook(book.id, book.name));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      row.appendChild(link);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  render();
})();
