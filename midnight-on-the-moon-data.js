// Magic Tree House #8: Midnight on the Moon 단어장 데이터
// 각 항목: chapter(챕터), word(단어/표현), pos(품사), meaning(뜻), example(본문 예문)
// base: word가 원형이 아닐 때만 있음 — { word: 원형, meaning: 원형의 뜻, form: 무슨 형태인지 }
// compound: word가 (숙어가 아니라) 두 단어가 합쳐진 경우만 있음 — [{word, meaning}, {word, meaning}]
// 아이가 책에 직접 밑줄 그은 단어·숙어·문장만 정리했습니다.
const MIDNIGHT_ON_THE_MOON_VOCAB_DATA = [
  // ===== Prologue =====
  { chapter: "Prologue", word: "pirates", pos: "명사", meaning: "해적들", example: "...ian queen, pirates, ninjas, and the Amazon rain forest.", base: { word: "pirate", meaning: "해적", form: "복수형" } },
  { chapter: "Prologue", word: "along the way", pos: "표현", meaning: "그 과정에서, 가는 길에", example: "Along the way, they discovered that the tree house belonged to Morgan le Fay." },
  { chapter: "Prologue", word: "discovered", pos: "동사", meaning: "발견했다", example: "Along the way, they discovered that the tree house belonged to Morgan le Fay.", base: { word: "discover", meaning: "발견하다", form: "과거형" } },

  // ===== Chapter 1: By Moonlight =====
  { chapter: "Chapter 1: By Moonlight", word: "figure", pos: "명사", meaning: "(사람의) 형체, 모습", example: "He saw a figure in the moonlight." },
  { chapter: "Chapter 1: By Moonlight", word: "sweatshirt", pos: "명사", meaning: "맨투맨, 스웨트셔츠", example: "She wore jeans and a sweatshirt.", compound: [ { word: "sweat", meaning: "땀" }, { word: "shirt", meaning: "셔츠" } ] },
  { chapter: "Chapter 1: By Moonlight", word: "that's nuts", pos: "표현", meaning: "말도 안 돼, 터무니없어", example: "'That's nuts,' said Jack." },
  { chapter: "Chapter 1: By Moonlight", word: "rope ladder", pos: "명사(구)", meaning: "밧줄 사다리", example: "Annie grabbed the rope ladder and started climbing up.", compound: [ { word: "rope", meaning: "밧줄" }, { word: "ladder", meaning: "사다리" } ] },
  { chapter: "Chapter 1: By Moonlight", word: "streamed through", pos: "동사(구)", meaning: "(빛이) 쏟아져 들어왔다", example: "Moonlight streamed through the window.", base: { word: "stream", meaning: "흐르다, 쏟아지다", form: "과거형" } },
  { chapter: "Chapter 1: By Moonlight", word: "shone", pos: "동사", meaning: "비쳤다", example: "It shone on the letter M that shimmered on the wooden floor.", base: { word: "shine", meaning: "빛나다", form: "과거형" } },
  { chapter: "Chapter 1: By Moonlight", word: "shimmered", pos: "동사", meaning: "반짝였다", example: "that shimmered on the wooden floor.", base: { word: "shimmer", meaning: "반짝이다", form: "과거형" } },
  { chapter: "Chapter 1: By Moonlight", word: "rested", pos: "동사", meaning: "놓여 있었다", example: "It shone on the three M things that rested on the M", base: { word: "rest", meaning: "놓여 있다, 쉬다", form: "과거형" } },
  { chapter: "Chapter 1: By Moonlight", word: "diagrams", pos: "명사", meaning: "도표, 그림", example: "He could make out diagrams and shadowy pictures.", base: { word: "diagram", meaning: "도표, 그림", form: "복수형" } },
  { chapter: "Chapter 1: By Moonlight", word: "squinted", pos: "동사", meaning: "눈을 가늘게 뜨고 보았다", example: "Jack squinted at them.", base: { word: "squint", meaning: "눈을 가늘게 뜨다", form: "과거형" } },
  { chapter: "Chapter 1: By Moonlight", word: "equipment", pos: "명사", meaning: "장비", example: "It's impossible to go to the moon without tons of equipment." },
  { chapter: "Chapter 1: By Moonlight", word: "boil to death", pos: "표현", meaning: "끓어 죽다", example: "we'd boil to death if it was day" },
  { chapter: "Chapter 1: By Moonlight", word: "freeze to death", pos: "표현", meaning: "얼어 죽다", example: "and freeze to death if it was night." },
  { chapter: "Chapter 1: By Moonlight", word: "dome-shaped structure", pos: "명사(구)", meaning: "돔 모양의 구조물", example: "He pointed to a picture of a dome-shaped structure.", compound: [ { word: "dome", meaning: "돔" }, { word: "shaped", meaning: "모양의" } ] },
  { chapter: "Chapter 1: By Moonlight", word: "absolutely", pos: "부사", meaning: "완전히, 전적으로", example: "Absolutely silent. As quiet and still as silence could be." },

  // ===== Chapter 2: Space Motel =====
  { chapter: "Chapter 2: Space Motel", word: "space scientists", pos: "명사(구)", meaning: "우주 과학자들", example: "Where were all the astronauts and space scientists?" },
  { chapter: "Chapter 2: Space Motel", word: "spacecrafts", pos: "명사", meaning: "우주선들", example: "The top of the dome slides open to let spacecrafts enter and leave.", base: { word: "spacecraft", meaning: "우주선", form: "복수형" }, compound: [ { word: "space", meaning: "우주" }, { word: "craft", meaning: "(비행)선, 기체" } ] },
  { chapter: "Chapter 2: Space Motel", word: "moon base", pos: "명사(구)", meaning: "달 기지", example: "'We've landed inside a moon base,' he said.", compound: [ { word: "moon", meaning: "달" }, { word: "base", meaning: "기지" } ] },
  { chapter: "Chapter 2: Space Motel", word: "periods", pos: "명사", meaning: "기간", example: "When scientists visit the moon for short periods, they eat and sleep in the moon base.", base: { word: "period", meaning: "기간", form: "복수형" } },
  { chapter: "Chapter 2: Space Motel", word: "motel", pos: "명사", meaning: "모텔", example: "'A space motel!' said Annie." },
  { chapter: "Chapter 2: Space Motel", word: "landing chamber", pos: "명사(구)", meaning: "착륙실", example: "The small base has a landing chamber and a room for storing spacesuits.", compound: [ { word: "landing", meaning: "착륙" }, { word: "chamber", meaning: "실, 방" } ] },
  { chapter: "Chapter 2: Space Motel", word: "explore", pos: "동사", meaning: "탐험하다", example: "'Let's explore,' said Annie." },
  { chapter: "Chapter 2: Space Motel", word: "copied", pos: "동사", meaning: "베꼈다, 옮겨 그렸다", example: "Jack copied the map.", base: { word: "copy", meaning: "베끼다", form: "과거형" } },
  { chapter: "Chapter 2: Space Motel", word: "touched the floor of the landing chamber", pos: "표현", meaning: "착륙실 바닥에 닿았다", example: "His feet touched the floor of the landing chamber.", base: { word: "touch", meaning: "닿다, 만지다", form: "과거형(touched)" } },
  { chapter: "Chapter 2: Space Motel", word: "diagram", pos: "명사", meaning: "도표, 그림", example: "Jack looked at his diagram." },
  { chapter: "Chapter 2: Space Motel", word: "rocky gray land", pos: "표현", meaning: "바위투성이의 회색 땅", example: "He stared at a rocky gray land." },
  { chapter: "Chapter 2: Space Motel", word: "craters", pos: "명사", meaning: "분화구", example: "The land was filled with giant craters and tall mountains.", base: { word: "crater", meaning: "분화구", form: "복수형" } },
  { chapter: "Chapter 2: Space Motel", word: "ink-black", pos: "형용사", meaning: "새까만, 먹물처럼 검은", example: "But the sky was ink-black!", compound: [ { word: "ink", meaning: "잉크" }, { word: "black", meaning: "검은" } ] },

  // ===== Chapter 3: Open Sesame! =====
  { chapter: "Chapter 3: Open Sesame!", word: "degrees", pos: "명사", meaning: "도(온도 단위)", example: "daytime heat reaches 260 degrees.", base: { word: "degree", meaning: "도(온도 단위)", form: "복수형" } },
  { chapter: "Chapter 3: Open Sesame!", word: "blood", pos: "명사", meaning: "피", example: "'I told you our blood would boil if we went out there,' he said." },
  { chapter: "Chapter 3: Open Sesame!", word: "tanks", pos: "명사", meaning: "통, 탱크", example: "They have tanks, which provide air for two hours.", base: { word: "tank", meaning: "통, 탱크", form: "복수형" } },
  { chapter: "Chapter 3: Open Sesame!", word: "trotted", pos: "동사", meaning: "종종걸음으로 갔다", example: "She looked around then trotted back down the hall.", base: { word: "trot", meaning: "종종걸음으로 가다", form: "과거형" } },
  { chapter: "Chapter 3: Open Sesame!", word: "a ton of", pos: "표현", meaning: "엄청나게 많은", example: "'There's a ton of space stuff in here!'" },
  { chapter: "Chapter 3: Open Sesame!", word: "neat rows", pos: "표현", meaning: "가지런한 줄", example: "boots sat in neat rows on shelves." },
  { chapter: "Chapter 3: Open Sesame!", word: "armor room", pos: "명사(구)", meaning: "갑옷 보관실", example: "'Wow, it's like the armor room in a castle,' said Jack.", compound: [ { word: "armor", meaning: "갑옷" }, { word: "room", meaning: "방" } ] },
  { chapter: "Chapter 3: Open Sesame!", word: "armor", pos: "명사", meaning: "갑옷", example: "'Yeah, with huge armor,' said Annie." },
  { chapter: "Chapter 3: Open Sesame!", word: "clumsily", pos: "부사", meaning: "어설프게, 서투르게", example: "Jack and Annie moved clumsily around the room." },
  { chapter: "Chapter 3: Open Sesame!", word: "visor", pos: "명사", meaning: "(헬멧의) 바이저, 얼굴 가리개", example: "'Close your visor,' said Annie." },
  { chapter: "Chapter 3: Open Sesame!", word: "visors", pos: "명사", meaning: "바이저, 얼굴 가리개", example: "They both closed their see-through visors.", base: { word: "visor", meaning: "바이저, 얼굴 가리개", form: "복수형" } },
  { chapter: "Chapter 3: Open Sesame!", word: "quietly", pos: "부사", meaning: "조용히", example: "'Ow! Talk quietly,' Jack said." },
  { chapter: "Chapter 3: Open Sesame!", word: "little push", pos: "표현", meaning: "살짝 밀기", example: "She gave Jack a little push." },
  { chapter: "Chapter 3: Open Sesame!", word: "open sesame", pos: "표현", meaning: "열려라 참깨", example: "'Open sesame!' She pressed the OPEN button." },

  // ===== Chapter 4: Moon Rabbits =====
  { chapter: "Chapter 4: Moon Rabbits", word: "layer", pos: "명사", meaning: "층, 막", example: "He was standing in a layer of gray dust as fine as powder." },
  { chapter: "Chapter 4: Moon Rabbits", word: "ink-black", pos: "형용사", meaning: "새까만, 먹물처럼 검은", example: "Jack stared at the ink-black sky.", compound: [ { word: "ink", meaning: "잉크" }, { word: "black", meaning: "검은" } ] },
  { chapter: "Chapter 4: Moon Rabbits", word: "tossed", pos: "동사", meaning: "던졌다", example: "She tossed it into space.", base: { word: "toss", meaning: "던지다", form: "과거형" } },
  { chapter: "Chapter 4: Moon Rabbits", word: "gracefully", pos: "부사", meaning: "우아하게", example: "Where Jack's boots hit the ground, moondust gracefully sprayed into space." },
  { chapter: "Chapter 4: Moon Rabbits", word: "shallow crater", pos: "명사(구)", meaning: "얕은 분화구", example: "The book had landed at the edge of a shallow crater." },
  { chapter: "Chapter 4: Moon Rabbits", word: "clumsy", pos: "형용사", meaning: "어설픈, 둔한", example: "And his spacesuit was too clumsy." },
  { chapter: "Chapter 4: Moon Rabbits", word: "goofing off", pos: "동사(구)", meaning: "빈둥거리다, 장난치다", example: "'You shouldn't have been goofing off,' said Annie wisely.", base: { word: "goof off", meaning: "빈둥거리다", form: "현재분사형(-ing)" } },
  { chapter: "Chapter 4: Moon Rabbits", word: "goofed", pos: "동사", meaning: "빈둥거렸다, 장난쳤다", example: "'You goofed off first,' said Jack.", base: { word: "goof", meaning: "빈둥거리다", form: "과거형" } },
  { chapter: "Chapter 4: Moon Rabbits", word: "crater", pos: "명사", meaning: "분화구", example: "She stood at the edge of the crater." },
  { chapter: "Chapter 4: Moon Rabbits", word: "moon buggy", pos: "명사(구)", meaning: "달 탐사차", example: "'A moon buggy!' said Annie.", compound: [ { word: "moon", meaning: "달" }, { word: "buggy", meaning: "탐사차, 소형차" } ] },

  // ===== Chapter 5: Hang On! =====
  { chapter: "Chapter 5: Hang On!", word: "license", pos: "명사", meaning: "면허증", example: "'But you don't have a license!' said Jack." },
  { chapter: "Chapter 5: Hang On!", word: "ON", pos: "표현", meaning: "켜짐(버튼 표시)", example: "Annie pushed a button labeled ON." },
  { chapter: "Chapter 5: Hang On!", word: "jerk", pos: "명사", meaning: "갑작스런 멈춤, 덜컹거림", example: "The buggy stopped with a jerk." },
  { chapter: "Chapter 5: Hang On!", word: "reverse", pos: "명사", meaning: "후진", example: "'It must be in reverse,' said Jack." },
  { chapter: "Chapter 5: Hang On!", word: "bucked", pos: "동사", meaning: "(말처럼) 날뛰었다", example: "It bucked like a bronco.", base: { word: "buck", meaning: "날뛰다", form: "과거형" } },
  { chapter: "Chapter 5: Hang On!", word: "bronco", pos: "명사", meaning: "야생마", example: "It bucked like a bronco." },
  { chapter: "Chapter 5: Hang On!", word: "dashboard", pos: "명사", meaning: "(자동차) 계기판", example: "Jack held on to the dashboard.", compound: [ { word: "dash", meaning: "돌진하다, 계기반" }, { word: "board", meaning: "판자" } ] },
  { chapter: "Chapter 5: Hang On!", word: "colorless, barren", pos: "표현", meaning: "색이 없고 황량한", example: "He had never been to such a colorless, barren place." },
  { chapter: "Chapter 5: Hang On!", word: "clouds of dust", pos: "표현", meaning: "먼지 구름들", example: "Gray clouds of dust rose behind them as they took off across the moon." },
  { chapter: "Chapter 5: Hang On!", word: "anything", pos: "표현", meaning: "아무것, 무엇이든", example: "Looking for anything on this wild ride was impossible." },
  { chapter: "Chapter 5: Hang On!", word: "peace", pos: "명사", meaning: "평화", example: "WE CAME IN PEACE" },
  { chapter: "Chapter 5: Hang On!", word: "mankind", pos: "명사", meaning: "인류", example: "FOR ALL MANKIND.", compound: [ { word: "man", meaning: "사람" }, { word: "kind", meaning: "종류" } ] },
  { chapter: "Chapter 5: Hang On!", word: "copy", pos: "동사", meaning: "베끼다, 옮겨 적다", example: "he took out his notebook and pencil to copy the sign." },
  { chapter: "Chapter 5: Hang On!", word: "stepped aside", pos: "동사(구)", meaning: "옆으로 비켜섰다", example: "Annie stepped aside so he could look, too.", base: { word: "step aside", meaning: "옆으로 비키다", form: "과거형" } },
  { chapter: "Chapter 5: Hang On!", word: "distance", pos: "명사", meaning: "(먼) 거리", example: "In the distance, something was flying above the ground." },

  // ===== Chapter 6: High Jump =====
  { chapter: "Chapter 6: High Jump", word: "base", pos: "명사", meaning: "기지", example: "'Let's go back to the base—before he gets here!'" },
  { chapter: "Chapter 6: High Jump", word: "cloud of dust", pos: "명사(구)", meaning: "먼지 구름", example: "Suddenly, a cloud of dust flew up in front of them." },
  { chapter: "Chapter 6: High Jump", word: "jerked", pos: "동사", meaning: "갑자기 멈췄다, 덜컹했다", example: "The buggy jerked to a stop.", base: { word: "jerk", meaning: "갑자기 움직이다", form: "과거형" } },
  { chapter: "Chapter 6: High Jump", word: "settled", pos: "동사", meaning: "가라앉았다", example: "The dust settled.", base: { word: "settle", meaning: "가라앉다", form: "과거형" } },
  { chapter: "Chapter 6: High Jump", word: "black", pos: "형용사", meaning: "검은", example: "Jack looked at the black sky." },
  { chapter: "Chapter 6: High Jump", word: "bulky", pos: "형용사", meaning: "부피가 큰, 둔중한", example: "But his suit was too bulky." },
  { chapter: "Chapter 6: High Jump", word: "failed", pos: "동사", meaning: "실패했다", example: "He tried to stand again. And failed.", base: { word: "fail", meaning: "실패하다", form: "과거형" } },

  // ===== Chapter 7: The Moon Man =====
  { chapter: "Chapter 7: The Moon Man", word: "we come in peace", pos: "표현", meaning: "우리는 평화롭게 왔습니다", example: "'Hi,' she said. 'We come in peace.'" },
  { chapter: "Chapter 7: The Moon Man", word: "ready to burst", pos: "표현", meaning: "터질 것 같은", example: "By the time they got to the white dome, he was ready to burst." },
  { chapter: "Chapter 7: The Moon Man", word: "visor", pos: "명사", meaning: "(헬멧의) 바이저, 얼굴 가리개", example: "Jack opened the visor of his helmet." },
  { chapter: "Chapter 7: The Moon Man", word: "clumsily", pos: "부사", meaning: "어설프게, 서투르게", example: "As they moved clumsily into the spacesuit storeroom," },
  { chapter: "Chapter 7: The Moon Man", word: "bulky suits", pos: "표현", meaning: "부피가 큰 우주복", example: "they stepped out of their bulky suits." },
  { chapter: "Chapter 7: The Moon Man", word: "heels", pos: "명사", meaning: "발뒤꿈치", example: "He sighed, then sat back on his heels.", base: { word: "heel", meaning: "발뒤꿈치", form: "복수형" } },
  { chapter: "Chapter 7: The Moon Man", word: "scurried", pos: "동사", meaning: "종종걸음으로 급히 갔다", example: "Peanut jumped out of Annie's arms and scurried back to the letter M.", base: { word: "scurry", meaning: "종종걸음으로 급히 가다", form: "과거형" } },

  // ===== Chapter 8: One Star to Another =====
  { chapter: "Chapter 8: One Star to Another", word: "constellation", pos: "명사", meaning: "별자리", example: "'You know how you draw a constellation?' said Jack." },
  { chapter: "Chapter 8: One Star to Another", word: "constellation", pos: "명사", meaning: "별자리", example: "'Is there such a thing as a mouse constellation?' said Annie." },

  // ===== Chapter 9: Morgan =====
  { chapter: "Chapter 9: Morgan", word: "freed", pos: "동사", meaning: "자유롭게 해주었다, 풀어주었다", example: "'You have freed me from the magician's spell.'", base: { word: "free", meaning: "자유롭게 하다", form: "과거분사형(have freed)" } },
  { chapter: "Chapter 9: Morgan", word: "sorcerer", pos: "명사", meaning: "마법사", example: "\"And the monkey and the sorcerer?\" said Jack." },
  { chapter: "Chapter 9: Morgan", word: "absolutely", pos: "부사", meaning: "완전히, 전적으로", example: "Then everything was still. Absolutely still." },

  // ===== Chapter 10: Earth Life =====
  { chapter: "Chapter 10: Earth Life", word: "Camelot", pos: "고유명사", meaning: "카멜롯(아서왕의 궁전이 있던 곳)", example: "'I've been gone from Camelot for a long time.'" },
  { chapter: "Chapter 10: Earth Life", word: "knowledge", pos: "명사", meaning: "지식", example: "'Thank you, Jack, for your great love of knowledge.'" },
  { chapter: "Chapter 10: Earth Life", word: "braids", pos: "명사", meaning: "땋은 머리", example: "Morgan tugged on one of Annie's braids.", base: { word: "braid", meaning: "땋은 머리", form: "복수형" } },
  { chapter: "Chapter 10: Earth Life", word: "universe", pos: "명사", meaning: "우주", example: "'The universe is filled with wonders. Isn't it, Jack?'" },
  { chapter: "Chapter 10: Earth Life", word: "moist", pos: "형용사", meaning: "촉촉한, 눅눅한", example: "The midnight air felt cool and moist." },
  { chapter: "Chapter 10: Earth Life", word: "alien", pos: "명사", meaning: "외계인", example: "'No. I think he's an alien,' said Annie, 'from another galaxy.'" },
  { chapter: "Chapter 10: Earth Life", word: "scoffed", pos: "동사", meaning: "비웃었다, 코웃음 쳤다", example: "Jack scoffed. 'What makes you say that?'", base: { word: "scoff", meaning: "비웃다, 코웃음 치다", form: "과거형" } },
  { chapter: "Chapter 10: Earth Life", word: "proof that aliens exist", pos: "표현", meaning: "외계인이 존재한다는 증거", example: "'There's no proof that aliens exist.'" },
  { chapter: "Chapter 10: Earth Life", word: "universe", pos: "명사", meaning: "우주", example: "Morgan's words came back to him: The universe is filled with wonders. Isn't it, Jack?" },
];
