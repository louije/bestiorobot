export type MonsterCode = "AQUA" | "CLAN" | "GOUR" | "PHIL";
export type MonsterSlug = "aquatique" | "clanique" | "gourmand" | "philanthrope";
export type LevelSlug = number;
export type BoardSlug = string;

import { error } from "@sveltejs/kit";
import texts from "@/data/texts.json";

type Tree = Record<MonsterSlug, Record<LevelSlug, string[]>>;
type Route = [MonsterSlug?, LevelSlug?, BoardSlug?];
export type Data = {
  texts?: Record<string, string>;
  phrase?: Phrase;
  navigation?: BoardNavigation;
}
type Phrase = {
  boardName?: string;
  level: LevelSlug;
  monster: MonsterSlug;
  board?: BoardSlug;
  file?: () => Promise<unknown>;
};
export type BoardNavigation = {
  index?: number;
  max?: number;
  previous?: string;
  next?: string;
  monsters?: Array<MonsterSlug>;
  redirect?: string;
}

const monsters: Record<MonsterCode, MonsterSlug> = {
  "AQUA": "aquatique",
  "CLAN": "clanique",
  "GOUR": "gourmand",
  "PHIL": "philanthrope"
};

export const monsterColors: Record<MonsterSlug, string> = {
  "aquatique": "#97ff7b",
  "clanique": "#f47516",
  "gourmand": "#8352b2",
  "philanthrope": "#48bfed",
}

export default class Finder {
  files: Record<string, () => Promise<unknown>>;
  phrases: string[];
  tree: Tree;
  current: Route | undefined;
  texts: Record<string, Record<string, string>>;
  isOutro = false;

  constructor() {
    this.files = import.meta.glob("@/phrases/*.svg");
    this.phrases = this._getPhrases();
    this.texts = texts;
    this.tree = this._buildTree();
  }

  go(route: Route, opts = { outro: false }) {
    const { outro } = opts;
    this.setCurrent(route, { outro });

    return this.getCurrent();
  }

  setCurrent(route: Route, { outro }: { outro: boolean }): void {
    this.current = route;
    let valid = false;
    if (route[2]) {
      valid = this._checkBoard(route[0] as MonsterSlug, route[1] as LevelSlug, route[2] as BoardSlug);
    } else if (route[1]) {
      valid = this._checkLevel(route[0] as MonsterSlug, route[1] as LevelSlug);
    } else if (route[0]) {
      valid = this._checkMonster(route[0]);
      this.isOutro = outro;
    } else {
      valid = true;
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
    if (!monster || !level) { return; }
    
    const phrase = (board) ? this.tree[monster][level][this._extractBoard(board)] : undefined;
    return {
      boardName: phrase,
      level,
      monster,
      board,
      file: (phrase) ? this.files[`/src/phrases/${phrase}.svg`] : undefined,
    };
  }

  _textForCurrent(): Record<string, string> | undefined {
    if (!this.current) {
      return this.texts.intro;
    }
    if (this.isOutro) {
      return this.texts.outro;
    }
    const [monster, level] = this.current;
    if (level) {
      return this.texts[`level-${level}`];
    }
    if (!monster) {
      return this.texts.intro;
    }
  }

  _getBoardNavigation(): BoardNavigation | undefined {
    const [monster, level, board] = this.current || [];
    if (!monster) {
      return {
        monsters: Object.values(monsters),
      }
    }
    if (this.isOutro) {
      const lastLevelForMonster = Object.keys(this.tree[monster]).length;
      return {
        monsters: Object.values(monsters),
        previous: `/${monster}/${lastLevelForMonster}`,
      }
    }
    if (level && !board)  {
      const firstBoard = `/${monster}/${level}/a`;
      if (level === 1) {
        return {
          redirect: firstBoard,
        }
      }
      const previousBoard = this._indexToBoard(this.tree[monster][level - 1].length - 1);
      return {
        next: firstBoard,
        previous: `/${monster}/${level - 1}/${previousBoard}`,
      }
    }
    if (!level || !board) { return; }

    const index = this._extractBoard(board);
    const boards = this.tree[monster][level];
    const max = boards.length;

    const levelURL = `/${monster}/${level}`;
    let previous;
    let next;

    if (index !== 0) {
      const previousBoardComponent = this._indexToBoard(index - 1);
      previous = `${levelURL}/${previousBoardComponent}`;
    } else if (level !== 1) {
      previous = `/${monster}/${level}/`;
    } else {
      previous = "/";
    }

    if (index !== max - 1) {
      const nextBoardComponent = this._indexToBoard(index + 1);
      next = `${levelURL}/${nextBoardComponent}`;
    } else if (this.tree[monster][level + 1]) {
      next = `/${monster}/${level + 1}/`;
    } else {
      next = `/${monster}/outro`;
    }

    return {
      index,
      max,
      previous,
      next,
    };
  }
}
