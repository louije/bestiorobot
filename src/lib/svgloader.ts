type Phrase = {
  phrase: string;
  file: () => Promise<any>;
  level?: number;
};
type MaybePhrase = Phrase | void;

const files = import.meta.glob('@/phrases/*.svg');

export const phrases = Object.keys(files).map((phrase: string) => {
  return phrase.split('/').pop()?.replace('.svg', '');
});

function exists(phrase: string): Boolean {
  return phrases.indexOf(phrase) !== -1;
}

function extractLevel(phrase: string): number | undefined {
  const match = phrase.match(/^N(\d+)/);
  if (match && match.length > 0) {
    return parseInt(match[1]);
  }
}

export function loadPhrase(phrase: string): MaybePhrase {
  if (exists(phrase)) {
    return {
      phrase,
      level: extractLevel(phrase),
      file: files[`/src/phrases/${phrase}.svg`]
    };
  }
}
