/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { MonsterCode, LevelSlug, IllegalValue } from "./finder";

type Phrase = {
  phrase: string;
  level: LevelSlug;
  monster: MonsterCode;
  file: () => Promise<any>;
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

export const phrasesPerMonster = phrases.reduce((result: any, phrase) => {
  const monster: string = extractMonster(phrase) || "indéterminé";
  if (!result[monster]) {
    result[monster] = [];
  }
  result[monster].push(phrase);
  return result;
}, {})

export const phrasesPerMonsterPerLevel = phrases.reduce((result: any, phrase) => {
  const level: string = extractLevel(phrase)?.toString() || "indéterminé";
  const monster: string = extractMonster(phrase) || "indéterminé";
  if (!result[monster]) {
    result[monster] = {};
  }
  if (!result[monster][level]) {
    result[monster][level] = [];
  }
  result[monster][level].push(phrase);
  return result;
}, {});

function exists(phrase: string): boolean {
  return phrases.indexOf(phrase) !== -1;
}

function extractLevel(phrase: string): LevelSlug {
  const match = phrase.match(/^N(\d+)/);
  if (match && match.length > 0) {
    return parseInt(match[1]) as LevelSlug;
  }
}

function extractMonster(phrase: string): MonsterCode {
  const match = phrase.match(/(AQUA|CLAN|GOUR|PHIL)/);
  if (match && match.length > 0) {
    return match[1] as MonsterCode;
  }
}

export function loadPhrase(phrase: string): MaybePhrase {
  if (exists(phrase)) {
    return {
      phrase,
      level: extractLevel(phrase),
      monster: extractMonster(phrase),
      file: files[`/src/phrases/${phrase}.svg`]
    };
  }
}
