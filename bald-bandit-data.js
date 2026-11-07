// A to Z Mysteries: The Bald Bandit 단어장 데이터
// 각 항목: chapter(챕터), word(단어/표현), pos(품사), meaning(뜻), example(본문 예문)
// base: word가 원형이 아닐 때만 있음 — { word: 원형, meaning: 원형의 뜻, form: 무슨 형태인지 }
// compound: word가 (숙어가 아니라) 두 단어가 합쳐진 경우만 있음 — [{word, meaning}, {word, meaning}]
// 아이가 책에 직접 밑줄 그은 단어·숙어·문장만 정리했습니다.
const BALD_BANDIT_VOCAB_DATA = [
  // ===== B is for Big Bucks... (책 앞부분 미리보기) =====
  { chapter: "B is for Big Bucks...", word: "Big Bucks", pos: "표현", meaning: "큰돈", example: "B is for Big Bucks . . ." },
  { chapter: "B is for Big Bucks...", word: "filmed", pos: "동사", meaning: "촬영했다", example: "'If you find the kid who filmed the robber, get the video.'", base: { word: "film", meaning: "촬영하다", form: "과거형" } },
  { chapter: "B is for Big Bucks...", word: "reward", pos: "명사", meaning: "보상금", example: "'There'll be a nice reward if you hand it over.'" },
  { chapter: "B is for Big Bucks...", word: "BUCKS", pos: "명사", meaning: "달러, 돈", example: "'A HUNDRED BUCKS?' screamed Ruth Rose." },

  // ===== Chapter 1 =====
  { chapter: "Chapter 1", word: "fangs", pos: "명사", meaning: "송곳니", example: "Dink slipped the plastic fangs into his mouth.", base: { word: "fang", meaning: "송곳니", form: "복수형" } },
  { chapter: "Chapter 1", word: "spitting", pos: "동사", meaning: "침을 뱉는 것", example: "It was hard to talk without spitting, so Dink took the fangs out again.", base: { word: "spit", meaning: "침을 뱉다", form: "현재분사형(-ing)" } },
  { chapter: "Chapter 1", word: "third-grader", pos: "명사", meaning: "3학년생", example: "'You look like a skinny third-grader wearing false teeth.'", compound: [ { word: "third", meaning: "세 번째" }, { word: "grader", meaning: "~학년생" } ] },
  { chapter: "Chapter 1", word: "false", pos: "형용사", meaning: "가짜의", example: "'wearing false teeth.'" },
  { chapter: "Chapter 1", word: "tearing", pos: "동사", meaning: "찢고 있었다", example: "Josh was tearing a green bedsheet into long strips.", base: { word: "tear", meaning: "찢다", form: "현재분사형(-ing)" } },
  { chapter: "Chapter 1", word: "strips", pos: "명사", meaning: "가늘고 긴 조각들", example: "Josh was tearing a green bedsheet into long strips.", base: { word: "strip", meaning: "가늘고 긴 조각", form: "복수형" } },
  { chapter: "Chapter 1", word: "strips", pos: "명사", meaning: "가늘고 긴 조각들", example: "Dink's guinea pig, Loretta, crawled among the green strips.", base: { word: "strip", meaning: "가늘고 긴 조각", form: "복수형" } },
  { chapter: "Chapter 1", word: "curious squeak", pos: "표현", meaning: "호기심 어린 찍찍 소리", example: "Every now and then she let out a curious squeak." },
  { chapter: "Chapter 1", word: "wrapped", pos: "동사", meaning: "둘둘 감긴", example: "'How will you be able to walk if you're wrapped up in all those strips?'", base: { word: "wrap", meaning: "둘둘 감다", form: "과거분사형" } },
  { chapter: "Chapter 1", word: "tearing", pos: "동사", meaning: "찢고 있었다", example: "Josh kept tearing.", base: { word: "tear", meaning: "찢다", form: "현재분사형(-ing)" } },
  { chapter: "Chapter 1", word: "slithery", pos: "형용사", meaning: "스르르 미끄러지는 듯한", example: "he said in a slithery voice." },
  { chapter: "Chapter 1", word: "gliiiide", pos: "동사", meaning: "미끄러지듯 나아가다(glide를 늘여 쓴 표현)", example: "'They gliiiide.'" },
  { chapter: "Chapter 1", word: "strum", pos: "동사", meaning: "(기타 등을) 치다", example: "Ruth Rose pretended to strum a guitar." },
  { chapter: "Chapter 1", word: "mound", pos: "명사", meaning: "더미", example: "Ruth Rose looked at his mound of green strips." },
  { chapter: "Chapter 1", word: "dimpled", pos: "형용사", meaning: "보조개가 있는", example: "and a dimpled chin.", base: { word: "dimple", meaning: "보조개가 생기다", form: "과거분사형" } },
  { chapter: "Chapter 1", word: "hired", pos: "동사", meaning: "고용했다", example: "'The bank hired me to find the kid so I can get the video.'", base: { word: "hire", meaning: "고용하다", form: "과거형" } },
  { chapter: "Chapter 1", word: "reward", pos: "명사", meaning: "보상금", example: "'There'll be a nice reward if you hand it over.'" },
  { chapter: "Chapter 1", word: "BUCKS", pos: "명사", meaning: "달러, 돈", example: "'A HUNDRED BUCKS?' screamed Ruth Rose." },
  { chapter: "Chapter 1", word: "quite a set of lungs", pos: "표현", meaning: "목청이 아주 크다", example: "'That's quite a set of lungs you've got there.'" },

  // ===== Chapter 2 =====
  { chapter: "Chapter 2", word: "split up", pos: "동사(구)", meaning: "흩어졌다", example: "At the high school, they split up." },
  { chapter: "Chapter 2", word: "shoved", pos: "동사", meaning: "밀쳤다", example: "A million high school kids shoved through the door", base: { word: "shove", meaning: "밀치다", form: "과거형" } },
  { chapter: "Chapter 2", word: "through", pos: "전치사", meaning: "~을 통과하여", example: "A million high school kids shoved through the door and scrambled down the front steps." },
  { chapter: "Chapter 2", word: "front steps", pos: "명사(구)", meaning: "앞 계단", example: "scrambled down the front steps." },
  { chapter: "Chapter 2", word: "trampled", pos: "동사", meaning: "짓밟혔다", example: "Dink stood on the bench so he wouldn't get trampled.", base: { word: "trample", meaning: "짓밟다", form: "과거분사형" } },
  { chapter: "Chapter 2", word: "hoods", pos: "명사", meaning: "후드들", example: "Some wore jackets or sweatshirts with the hoods pulled up.", base: { word: "hood", meaning: "후드", form: "복수형" } },
  { chapter: "Chapter 2", word: "tape", pos: "명사", meaning: "테이프, 녹화", example: "'A kid with red hair got the robber on tape,' Dink said." },
  { chapter: "Chapter 2", word: "reward", pos: "명사", meaning: "보상금", example: "'I'm helping to find him. There's going to be a reward.'" },
  { chapter: "Chapter 2", word: "rack", pos: "명사", meaning: "거치대", example: "He walked toward the bike rack." },
  { chapter: "Chapter 2", word: "lawn", pos: "명사", meaning: "잔디밭", example: "Ruth Rose was sitting on the lawn," },
  { chapter: "Chapter 2", word: "blades", pos: "명사", meaning: "(풀) 잎", example: "weaving grass blades together.", base: { word: "blade", meaning: "(풀) 잎", form: "복수형" } },
];
