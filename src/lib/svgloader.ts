/* eslint-disable @typescript-eslint/no-non-null-assertion */
type Phrase = {
  phrase: string;
  file: () => Promise<any>;
  level?: number;
};
type MaybePhrase = Phrase | void;

const files = import.meta.glob("@/phrases/*.svg");

export const phrases: Array<string> = Object.keys(files).map((phrase: string) => {
  return phrase.split("/").pop()!.replace(".svg", "");
});

export const phrasesPerLevel = phrases.reduce((result: any, phrase) => {
  const level: string = extractLevel(phrase)?.toString() || "indéterminé";
  if (!result[level]) {
    result[level] = [];
  }
  result[level].push(phrase);
  return result;
}, {});

function exists(phrase: string): boolean {
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
