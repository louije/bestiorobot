export type MonsterCode = "AQUA" | "CLAN" | "GOUR" | "PHIL";
export type MonsterSlug = "aquatique" | "clanique" | "gourmand" | "philanthrope";
export type LevelSlug = number;
export type BoardSlug = string;

type Phrase = {
  phrase: string;
  level: LevelSlug;
  monster: MonsterSlug;
  board: BoardSlug;
  file: () => Promise<unknown>;
};
type Tree = Record<MonsterSlug, Record<LevelSlug, string[]>>
type Route = [MonsterSlug, LevelSlug, BoardSlug]

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

  constructor() {
    this.files = import.meta.glob("@/phrases/*.svg");
    this.phrases = this._getPhrases();
    this.tree = this._buildTree();
  }

  fileForRoute(route: Route): Phrase {
    const [monster, level, board] = route;
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

  checkMonster(m: string): boolean {
    return Object.values(monsters).indexOf(m as MonsterSlug) !== -1;
  }
  
  checkLevel(m: MonsterSlug, l: string): boolean {
    return m in this.tree && l in this.tree[m];
  }
  
  checkBoard(m: MonsterSlug, l: LevelSlug, b: string): boolean {
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
}
