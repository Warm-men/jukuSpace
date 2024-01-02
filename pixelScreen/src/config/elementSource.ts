import Res from '@res';

// 定义26个字母数组，大写
const Letter = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

// 生产26个字母的数组，item: { id: 0, name: 'A', img: Res['A'], size: 1 }
const LetterElement = Letter.map((item, index) => {
  return {
    id: index + 1,
    img: Res[item],
    size: 1,
    effect: 4,
    speed: 50,
    brightness: 50,
    hue: 50,
  };
});

const _symbol = ['&', '💗', '✨', '👍', '@', '!'];
const SymbolElement = _symbol.map((item, index) => {
  return {
    id: index + 26,
    img: Res[`symbol_${index}`],
    size: 1,
    effect: 4,
    speed: 50,
    brightness: 50,
    hue: 50,
  };
});
const _Number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const NumberElement = _Number.map((item, index) => {
  return {
    id: index + 32,
    img: Res[`number_${index}`],
    size: 1,
    effect: 4,
    speed: 50,
    brightness: 50,
    hue: 50,
  };
});
const Phrase = ['happy', 'love', 'birthday', 'home', 'welcome', 'open', 'holp', 'peace', 'marry'];
const PhraseElement = Phrase.map((item, index) => {
  return {
    id: index + 43,
    img: Res[`phrase_${index}`],
    size: 2,
    effect: 4,
    speed: 50,
    brightness: 50,
    hue: 50,
  };
});

export { LetterElement, NumberElement, SymbolElement, PhraseElement };
