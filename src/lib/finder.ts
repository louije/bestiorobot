export type MonsterCode = "AQUA" | "CLAN" | "GOUR" | "PHIL";
export type MonsterSlug = "aquatique" | "clanique" | "gourmand" | "philanthrope";
export type LevelSlug = number;
export type BoardSlug = string;

import { error } from "@sveltejs/kit";
import texts from "@/text/text.json";

type Phrase = {
  phrase: string;
  level: LevelSlug;
  monster: MonsterSlug;
  board: BoardSlug;
  file: () => Promise<unknown>;
};
type Tree = Record<MonsterSlug, Record<LevelSlug, string[]>>;
type Route = [MonsterSlug, LevelSlug?, BoardSlug?];
type Data = {
  texts?: Record<string, string>;
  phrase?: Phrase;
  navigation?: BoardNavigation;
}
type BoardNavigation = {
  index: number;
  max: number;
  previousBoard: string | undefined;
  nextBoard: string | undefined;
  nextLevel: string | undefined;
}

const monsters: Record<MonsterCode, MonsterSlug> = {
  "AQUA": "aquatique",
  "CLAN": "clanique",
  "GOUR": "gourmand",
  "PHIL": "philanthrope"
};

export default class Finder {
  files: Record<string, () => Promise<unknown>>;
  phrases: string[];
  tree: Tree;
  current: Route | undefined;
  texts: Record<string, Record<string, string>>;

  constructor() {
    this.files = import.meta.glob("@/phrases/*.svg");
    this.phrases = this._getPhrases();
    this.texts = texts;
    this.tree = this._buildTree();
  }

  go(route: Route) {
    this.setCurrent(route);
    return this.getCurrent();
  }

  setCurrent(route: Route) {
    this.current = route;
    let valid = false;
    if (route[2]) {
      valid = this._checkBoard(route[0], route[1] as LevelSlug, route[2] as BoardSlug);
    } else if (route[1]) {
      valid = this._checkLevel(route[0], route[1] as LevelSlug);
    } else {
      valid = this._checkMonster(route[0]);
    }
    if (!valid) {
      throw error(404, "Invalid route");
    }
  }

  getCurrent(): Data {
    const data = {} as Data;
    data.texts = this._textForCurrent();
    data.phrase = this._phraseForCurrent();
    data.navigation = this._getBoardNavigation();
    return data;
  }

  _getPhrases() {
    const phrases: Array<string> = Object.keys(this.files).map((phrase: string) => {
      return phrase.split("/").pop()?.replace(".svg", "");
    }).filter((phrase) => phrase !== undefined) as Array<string>;
    return phrases.sort();
  }

  _buildTree(): Tree {
    return this.phrases.reduce((result: Tree, phrase: string) => {
      const monster = this._extractMonster(phrase);
      if (!result[monster]) {
        result[monster] = {};
      }
  
      const level = this._extractLevel(phrase);
      if (!result[monster][level]) {
        result[monster][level] = [];
      }
  
      result[monster][level].push(phrase);
      return result;
    }, {} as Tree);
  }

  _checkMonster(m: string): boolean {
    return Object.values(monsters).indexOf(m as MonsterSlug) !== -1;
  }
  
  _checkLevel(m: MonsterSlug, l: LevelSlug): boolean {
    return m in this.tree && l in this.tree[m];
  }
  
  _checkBoard(m: MonsterSlug, l: LevelSlug, b: string): boolean {
    const boardIndex = this._extractBoard(b);
    return m in this.tree && l in this.tree[m] && this.tree[m][l][boardIndex] !== undefined;
  }
  
  _extractMonster(phrase: string): MonsterSlug {
    const monsterCodes = Object.keys(monsters);
    const monster = monsterCodes.find((m) => phrase.includes(m));
    if (!monster) {
      throw new Error("Monster not found");
    }
    return monsters[monster as MonsterCode];
  }
  
  _extractLevel(phrase: string): LevelSlug {
    const match = phrase.match(/^N(\d+)/);
    if (match && match.length > 0) {
      return parseInt(match[1]) as LevelSlug;
    }
    throw new Error("Level not found");
  }
  
  _extractBoard(letter: string) {
    if (!/^[a-z]$/.test(letter)) {
      throw new Error("Board not found.");
    }
    return letter.charCodeAt(0) - "a".charCodeAt(0);
  }

  _indexToBoard(index: number) {
    return String.fromCharCode(index + "a".charCodeAt(0));
  }

  _phraseForCurrent(): Phrase | undefined {
    const [monster, level, board] = this.current || [];
    if (!monster || !level || !board) { return; }
    
    const boardIndex = this._extractBoard(board);
    const phrase = this.tree[monster][level][boardIndex];
    return {
      phrase,
      level,
      monster,
      board,
      file: this.files[`/src/phrases/${phrase}.svg`],
    };
  }

  _textForCurrent(): Record<string, string> | undefined {
    if (!this.current) {
      return this.texts.intro;
    }
    const level = this.current[1];
    if (level) {
      return this.texts[`level-${level}`];
    }
  }

  _getBoardNavigation(): BoardNavigation | undefined {
    const [monster, level, board] = this.current || [];
    if (!monster || !level || !board) {
      return;
    }
    const index = this._extractBoard(board);
    const boards = this.tree[monster][level];
    const max = boards.length;

    const levelURL = `/${monster}/${level}`;
    let previousBoard;
    let nextBoard;
    let nextLevel;

    if (index !== 0) {
      const previousBoardComponent = this._indexToBoard(index - 1);
      previousBoard = `${levelURL}/${previousBoardComponent}`;
    }

    if (index !== max - 1) {
      const nextBoardComponent = this._indexToBoard(index + 1);
      nextBoard = `${levelURL}/${nextBoardComponent}`;
    }

    if (this.tree[monster][level + 1]) {
      nextLevel = `/${monster}/${level + 1}`;
    } else {
      nextLevel = `/${monster}/outro`;
    }

    return {
      index,
      max,
      previousBoard,
      nextBoard,
      nextLevel,
    };
  }
}
