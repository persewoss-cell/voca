// A to Z Mysteries: The Absent Author 단어장 데이터
// 각 항목: chapter(챕터), word(단어/표현), pos(품사), meaning(뜻), example(본문 예문)
// base: word가 원형이 아닐 때만 있음 — { word: 원형, meaning: 원형의 뜻, form: 무슨 형태인지 }
// compound: word가 (숙어가 아니라) 두 단어가 합쳐진 경우만 있음 — [{word, meaning}, {word, meaning}]
// 아이가 책에 직접 밑줄 그은 단어·숙어·문장만 정리했습니다.
const ABSENT_AUTHOR_VOCAB_DATA = [
  // ===== A is for Absent... (책 앞부분 미리보기) =====
  { chapter: "A is for Absent...", word: "dragged", pos: "동사", meaning: "끌고 갔다", example: "Dink dragged his friends down the street to the Book Nook.", base: { word: "drag", meaning: "끌다", form: "과거형" } },
  { chapter: "A is for Absent...", word: "crowded", pos: "형용사", meaning: "붐비는, 사람이 꽉 찬", example: "The bookstore was crowded with kids." },
  { chapter: "A is for Absent...", word: "WELCOME, WALLIS WALLACE!", pos: "표현", meaning: "환영합니다, 월리스 월리스!", example: "A big white sign on the table said WELCOME, WALLIS WALLACE!" },

  // ===== Chapter 1 =====
  { chapter: "Chapter 1", word: "owe you one", pos: "표현", meaning: "신세를 지다, 한 번 빚지다", example: "'If you come with me today, I'll owe you one.'" },
  { chapter: "Chapter 1", word: "meant business", pos: "표현", meaning: "진심이었다, 단호했다", example: "Except his mother, when she meant business." },
  { chapter: "Chapter 1", word: "mischievous", pos: "형용사", meaning: "장난기 있는", example: "He raised his mischievous green eyes toward the ceiling" },
  { chapter: "Chapter 1", word: "Loretta", pos: "고유명사", meaning: "로레타(기니피그 이름)", example: "'I know, I'll take Loretta!'" },
  { chapter: "Chapter 1", word: "tossed", pos: "동사", meaning: "던졌다", example: "Dink tossed a pillow at Josh.", base: { word: "toss", meaning: "던지다", form: "과거형" } },
  { chapter: "Chapter 1", word: "tucking", pos: "동사", meaning: "집어넣다", example: "tucking his shirt into his jeans at the same time.", base: { word: "tuck", meaning: "집어넣다", form: "현재분사형(-ing)" } },
  { chapter: "Chapter 1", word: "yanked", pos: "동사", meaning: "홱 잡아당겼다", example: "Dink yanked a brush through his thick blond hair.", base: { word: "yank", meaning: "홱 잡아당기다", form: "과거형" } },
  { chapter: "Chapter 1", word: "writer guy", pos: "명사(구)", meaning: "작가 아저씨", example: "'What's so important about this writer guy?' Josh asked." },
  { chapter: "Chapter 1", word: "dinky", pos: "형용사", meaning: "작고 보잘것없는", example: "'why's he coming to dinky little Green Lawn?'" },
  { chapter: "Chapter 1", word: "charged", pos: "동사", meaning: "돌진했다", example: "Dink charged back into his bedroom.", base: { word: "charge", meaning: "돌진하다", form: "과거형" } },
  { chapter: "Chapter 1", word: "scared to death", pos: "표현", meaning: "무서워 죽을 지경인", example: "'I'm scared to death to meet someone so famous.'" },
  { chapter: "Chapter 1", word: "leaned", pos: "동사", meaning: "기대었다", example: "Josh leaned in the bedroom doorway.", base: { word: "lean", meaning: "기대다", form: "과거형" } },
  { chapter: "Chapter 1", word: "make you sweat", pos: "표현", meaning: "너를 긴장하게 만들다", example: "'I'm just trying to make you sweat.'" },
  { chapter: "Chapter 1", word: "yanked", pos: "동사", meaning: "홱 잡아당겼다", example: "Dink yanked his backpack out of his closet.", base: { word: "yank", meaning: "홱 잡아당기다", form: "과거형" } },
  { chapter: "Chapter 1", word: "Maine", pos: "고유명사", meaning: "메인 주", example: "'Wallis Wallace lives in a castle in Maine!'" },
  { chapter: "Chapter 1", word: "slung", pos: "동사", meaning: "둘러멨다", example: "Dink slung his backpack over his shoulder.", base: { word: "sling", meaning: "둘러메다", form: "과거형" } },
  { chapter: "Chapter 1", word: "coveralls", pos: "명사", meaning: "(상하 일체형) 작업복", example: "She wore purple coveralls over a purple shirt", base: { word: "coverall", meaning: "작업복", form: "복수형" } },
  { chapter: "Chapter 1", word: "louder", pos: "형용사", meaning: "더 시끄러운", example: "'I don't know what's louder, your outfit or your voice.'", base: { word: "loud", meaning: "시끄러운", form: "비교급" } },
  { chapter: "Chapter 1", word: "copy", pos: "명사", meaning: "(책 등의) 한 부", example: "She held up a copy of The Phantom in the Pharmacy." },
  { chapter: "Chapter 1", word: "The Phantom in the Pharmacy", pos: "표현", meaning: "(책 제목) 약국의 유령", example: "She held up a copy of The Phantom in the Pharmacy." },
  { chapter: "Chapter 1", word: "research", pos: "명사", meaning: "조사, 연구", example: "he's doing some of the research while he's here in Connecticut." },
  { chapter: "Chapter 1", word: "Connecticut", pos: "고유명사", meaning: "코네티컷 주", example: "he's doing some of the research while he's here in Connecticut." },
  { chapter: "Chapter 1", word: "impressed", pos: "형용사", meaning: "감명받은", example: "'I'm so impressed that you've read all my books!'" },
  { chapter: "Chapter 1", word: "arrangements", pos: "명사", meaning: "준비, 마련", example: "'I've made arrangements to come to the Book Nook to sign books.'", base: { word: "arrangement", meaning: "준비, 마련", form: "복수형" } },
  { chapter: "Chapter 1", word: "happy", pos: "형용사", meaning: "행복한, 기쁜", example: "'I'm so happy to finally meet one of my most loyal fans.'" },
  { chapter: "Chapter 1", word: "framed", pos: "동사", meaning: "액자에 넣다", example: "'You should have that letter framed,' Ruth Rose said.", base: { word: "frame", meaning: "액자에 넣다", form: "과거분사형" } },
  { chapter: "Chapter 1", word: "urged", pos: "동사", meaning: "재촉했다", example: "'Come on!' Dink urged as he dragged his friends down the street", base: { word: "urge", meaning: "재촉하다", form: "과거형" } },

  // ===== Chapter 2 =====
  { chapter: "Chapter 2", word: "plopped", pos: "동사", meaning: "털썩 내려놓았다", example: "Dink plopped his pack on the floor.", base: { word: "plop", meaning: "털썩 내려놓다", form: "과거형" } },
  { chapter: "Chapter 2", word: "register", pos: "명사", meaning: "계산대, 금전등록기", example: "The clock over the cash register said three minutes after eleven." },
  { chapter: "Chapter 2", word: "Beats me", pos: "표현", meaning: "나도 몰라", example: "'Beats me. He's not here yet, and Mr. Paskey looks worried.'" },
  { chapter: "Chapter 2", word: "autographed", pos: "동사", meaning: "사인된, 서명된", example: "'How many of you have books to be autographed?'", base: { word: "autograph", meaning: "사인하다, 서명하다", form: "과거분사형" } },
  { chapter: "Chapter 2", word: "swallowed", pos: "동사", meaning: "(침을) 삼켰다", example: "He swallowed, trying to stay calm.", base: { word: "swallow", meaning: "삼키다", form: "과거형" } },
  { chapter: "Chapter 2", word: "restless", pos: "형용사", meaning: "안절부절못하는", example: "Some of the kids started getting restless." },
  { chapter: "Chapter 2", word: "jerked", pos: "동사", meaning: "갑자기 움직였다", example: "The big hand jerked forward, paused, then wobbled forward again.", base: { word: "jerk", meaning: "갑자기 움직이다", form: "과거형" } },
  { chapter: "Chapter 2", word: "paused", pos: "동사", meaning: "잠시 멈췄다", example: "The big hand jerked forward, paused, then wobbled forward again.", base: { word: "pause", meaning: "잠시 멈추다", form: "과거형" } },
  { chapter: "Chapter 2", word: "wobbled", pos: "동사", meaning: "흔들렸다", example: "then wobbled forward again.", base: { word: "wobble", meaning: "흔들리다", form: "과거형" } },
  { chapter: "Chapter 2", word: "bald", pos: "형용사", meaning: "대머리의", example: "Dink noticed that his bald head was shiny with sweat." },
  { chapter: "Chapter 2", word: "grumbled", pos: "동사", meaning: "투덜거렸다", example: "The crowd grumbled, but nobody wanted to go anywhere.", base: { word: "grumble", meaning: "투덜거리다", form: "과거형" } },
];
