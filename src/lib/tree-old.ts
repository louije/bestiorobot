export class Tree {
  root: Node;

  constructor() {
    this.root = new Node();
  }
}

type Root = null;
type NodeOrRoot = Node | Root;

class Node {
  parent: NodeOrRoot;
  children: Array<Node>;
  payload: any;

  constructor(parent: NodeOrRoot = null, payload: any = null) {
    this.parent = parent;
    this.children = [];
    this.payload = payload;
  }
}

class IndexPath {
  coordinates: Array<number>;

  constructor(path = [0]) {
    this.coordinates = path;
  }
}

export class Journey {
  path: IndexPath;
  tree: Tree;

  constructor(tree: Tree) {
    this.tree = tree;
    this.path = new IndexPath();
  }

  // Get current node
  get currentNode() {
    let node: Node = this.tree.root;

    for (let i = 0; i < this.path.coordinates.length; i++) {
      let index = this.path.coordinates[i];
      node = node.children[index];
    }

    return node;
  }

  // Returns children at current index path
  get children() {
    return this.currentNode.children;
  }

  // Advances to one of the child nodes
  down(childIndex: number) {
    const newPath = [...this.path.coordinates, childIndex];
    this.move(newPath);
  }

  // Navigate to other children
  left(index: number) {
    const newPath = [...this.path.coordinates];
    const currentIndex = newPath.pop();
    if (currentIndex === undefined) {
      throw InvalidPathError;
    }
    newPath.push(currentIndex - index);
    this.move(newPath);
  }

  right(index: number) {
    const newPath = [...this.path.coordinates];
    const currentIndex = newPath.pop();
    if (currentIndex === undefined) {
      throw InvalidPathError;
    }
    newPath.push(currentIndex + index);
    this.move(newPath);
  }

  // Back up to a parent
  up(levels: number) {
    const newPath = [...this.path.coordinates];
    newPath.splice(newPath.length - levels);
    this.move(newPath);
  }

  // Move to a new path
  move(path: Array<number>) {
    if (this.isValidPath(path)) {
      this.path = new IndexPath(path);
    } else {
      throw new InvalidPathError();
    }
    console.log("new path", this.path);
  }

  // Check if path is valid
  isValidPath(path: Array<number>) {
    let node: Node = this.tree.root;

    for (let i = 0; i < path.length; i++) {
      let index = path[i];
      let child = node.children[index];

      if (!child) {
        return false;
      }

      node = child;
    }

    return true;
  }
}

class InvalidPathError extends Error {}

export function setupTree(numGen: number, maxNumChildren: number) {
  let tree = new Tree();
  let root = tree.root;
  let currentGen = [root];
  let nextGen: Array<Node> = [];

  for (let i = 0; i < numGen; i++) {
    currentGen.forEach((node) => {
      let numChildren = Math.max(2, Math.floor(Math.random() * maxNumChildren));
      for (let j = 0; j <= numChildren; j++) {
        let child = new Node(node);
        node.children.push(child);
        nextGen.push(child);
      }
    });
    currentGen = nextGen;
    nextGen = [];
  }

  return tree;
}
