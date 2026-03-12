/**
 * AVL Tree Implementation in TypeScript
 * Supports step-by-step visualization with rotation tracking
 */

export type RotationType = "LL" | "RR" | "LR" | "RL" | null;

export interface AVLNode {
  id: number;
  data: number;
  height: number;
  balanceFactor: number;
  left: AVLNode | null;
  right: AVLNode | null;
  // Visual positioning
  x?: number;
  y?: number;
  // Animation state
  isNew?: boolean;
  isRotating?: boolean;
  rotationRole?: "pivot" | "child" | "moved";
}

export interface InsertStep {
  stepIndex: number;
  description: string;
  rotationType: RotationType;
  root: AVLNode | null;
  highlightedNodes: number[];
  phase: "insert" | "update" | "rotate" | "done" | "delete" | "successor";
  insertedValue: number;
}

let nodeIdCounter = 0;

function createNode(data: number): AVLNode {
  return {
    id: nodeIdCounter++,
    data,
    height: 1,
    balanceFactor: 0,
    left: null,
    right: null,
    isNew: true,
  };
}

/** Clear isNew flag on all existing nodes (so only newly created node shows green) */
function clearNewFlags(node: AVLNode | null): void {
  if (!node) return;
  node.isNew = false;
  clearNewFlags(node.left);
  clearNewFlags(node.right);
}

function getHeight(node: AVLNode | null): number {
  return node ? node.height : 0;
}

function getBalanceFactor(node: AVLNode | null): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

function updateHeightAndBF(node: AVLNode): void {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  node.balanceFactor = getBalanceFactor(node);
}

/**
 * Right Rotation (fixes LL imbalance)
 *        y                x
 *       / \             /   \
 *      x   T3   =>    T1    y
 *     / \                  / \
 *    T1  T2              T2  T3
 */
function rightRotate(y: AVLNode): AVLNode {
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  updateHeightAndBF(y);
  updateHeightAndBF(x);

  return x;
}

/**
 * Left Rotation (fixes RR imbalance)
 *    x                   y
 *   / \                /   \
 *  T1   y      =>    x     T3
 *      / \          / \
 *     T2  T3      T1  T2
 */
function leftRotate(x: AVLNode): AVLNode {
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  updateHeightAndBF(x);
  updateHeightAndBF(y);

  return y;
}

/** Deep clone a tree node */
export function cloneTree(node: AVLNode | null): AVLNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

/** Insert with step recording */
function insertWithSteps(
  root: AVLNode | null,
  value: number,
  steps: InsertStep[],
  highlightPath: number[],
  inserted: { ok: boolean }
): AVLNode {
  // Base case: insert new node
  if (!root) {
    inserted.ok = true;
    return createNode(value);  // isNew:true set in createNode
  }

  if (value < root.data) {
    highlightPath.push(root.id);
    root.left = insertWithSteps(root.left, value, steps, highlightPath, inserted);
  } else if (value > root.data) {
    highlightPath.push(root.id);
    root.right = insertWithSteps(root.right, value, steps, highlightPath, inserted);
  } else {
    // Duplicate: do not insert
    return root;
  }

  // Update height and balance factor
  updateHeightAndBF(root);

  const bf = root.balanceFactor;

  // LL Case: left heavy, left child is left heavy or balanced
  if (bf > 1 && value < root.left!.data) {
    steps.push({
      stepIndex: steps.length,
      description: `Imbalance detected at node ${root.data} (BF=${bf}). Performing Right Rotation (LL Case).`,
      rotationType: "LL",
      root: cloneTree(root),
      highlightedNodes: [root.id, root.left!.id],
      phase: "rotate",
      insertedValue: value,
    });
    return rightRotate(root);
  }

  // RR Case: right heavy, right child is right heavy or balanced
  if (bf < -1 && value > root.right!.data) {
    steps.push({
      stepIndex: steps.length,
      description: `Imbalance detected at node ${root.data} (BF=${bf}). Performing Left Rotation (RR Case).`,
      rotationType: "RR",
      root: cloneTree(root),
      highlightedNodes: [root.id, root.right!.id],
      phase: "rotate",
      insertedValue: value,
    });
    return leftRotate(root);
  }

  // LR Case: left heavy, right child of left child caused it
  if (bf > 1 && value > root.left!.data) {
    steps.push({
      stepIndex: steps.length,
      description: `Imbalance detected at node ${root.data} (BF=${bf}). Performing Left-Right Rotation (LR Case): first Left Rotate on left child, then Right Rotate on root.`,
      rotationType: "LR",
      root: cloneTree(root),
      highlightedNodes: [root.id, root.left!.id, root.left!.right?.id ?? -1].filter(
        (id) => id !== -1
      ),
      phase: "rotate",
      insertedValue: value,
    });
    root.left = leftRotate(root.left!);
    return rightRotate(root);
  }

  // RL Case: right heavy, left child of right child caused it
  if (bf < -1 && value < root.right!.data) {
    steps.push({
      stepIndex: steps.length,
      description: `Imbalance detected at node ${root.data} (BF=${bf}). Performing Right-Left Rotation (RL Case): first Right Rotate on right child, then Left Rotate on root.`,
      rotationType: "RL",
      root: cloneTree(root),
      highlightedNodes: [root.id, root.right!.id, root.right!.left?.id ?? -1].filter(
        (id) => id !== -1
      ),
      phase: "rotate",
      insertedValue: value,
    });
    root.right = rightRotate(root.right!);
    return leftRotate(root);
  }

  return root;
}

/** Public insert API — returns wasInserted:false when duplicate detected */
export function avlInsert(
  root: AVLNode | null,
  value: number
): { newRoot: AVLNode; steps: InsertStep[]; wasInserted: boolean } {
  const steps: InsertStep[] = [];
  const inserted = { ok: false };

  // Bug fix: clear isNew on all EXISTING nodes so only the new one shows green
  clearNewFlags(root);

  steps.push({
    stepIndex: 0,
    description: `Inserting ${value} into the AVL tree...`,
    rotationType: null,
    root: cloneTree(root),
    highlightedNodes: [],
    phase: "insert",
    insertedValue: value,
  });

  const newRoot = insertWithSteps(root, value, steps, [], inserted);

  if (!inserted.ok) {
    // Duplicate — return unchanged tree, no steps
    return { newRoot: newRoot as AVLNode, steps: [], wasInserted: false };
  }

  // Recalculate all heights/BFs on the final balanced tree
  recalcAll(newRoot);

  steps.push({
    stepIndex: steps.length,
    description: `Insertion of ${value} complete. Tree is balanced.`,
    rotationType: null,
    root: cloneTree(newRoot),
    highlightedNodes: [],
    phase: "done",
    insertedValue: value,
  });

  return { newRoot, steps, wasInserted: true };
}

/** Rebalance a node after deletion, recording rotation steps */
function rebalanceAfterDelete(
  node: AVLNode,
  steps: InsertStep[],
  value: number
): AVLNode {
  updateHeightAndBF(node);
  const bf = node.balanceFactor;

  // Left heavy
  if (bf > 1) {
    const leftBF = getBalanceFactor(node.left);
    if (leftBF >= 0) {
      // LL
      steps.push({
        stepIndex: steps.length,
        description: `Rebalancing after delete: node ${node.data} (BF=${bf}). Right Rotation (LL Case).`,
        rotationType: "LL",
        root: cloneTree(node),
        highlightedNodes: [node.id, node.left!.id],
        phase: "rotate",
        insertedValue: value,
      });
      return rightRotate(node);
    } else {
      // LR
      steps.push({
        stepIndex: steps.length,
        description: `Rebalancing after delete: node ${node.data} (BF=${bf}). Left-Right Rotation (LR Case).`,
        rotationType: "LR",
        root: cloneTree(node),
        highlightedNodes: [node.id, node.left!.id],
        phase: "rotate",
        insertedValue: value,
      });
      node.left = leftRotate(node.left!);
      return rightRotate(node);
    }
  }

  // Right heavy
  if (bf < -1) {
    const rightBF = getBalanceFactor(node.right);
    if (rightBF <= 0) {
      // RR
      steps.push({
        stepIndex: steps.length,
        description: `Rebalancing after delete: node ${node.data} (BF=${bf}). Left Rotation (RR Case).`,
        rotationType: "RR",
        root: cloneTree(node),
        highlightedNodes: [node.id, node.right!.id],
        phase: "rotate",
        insertedValue: value,
      });
      return leftRotate(node);
    } else {
      // RL
      steps.push({
        stepIndex: steps.length,
        description: `Rebalancing after delete: node ${node.data} (BF=${bf}). Right-Left Rotation (RL Case).`,
        rotationType: "RL",
        root: cloneTree(node),
        highlightedNodes: [node.id, node.right!.id],
        phase: "rotate",
        insertedValue: value,
      });
      node.right = rightRotate(node.right!);
      return leftRotate(node);
    }
  }

  return node;
}

/** Find the inorder successor (minimum node in right subtree) */
function minNode(node: AVLNode): AVLNode {
  let cur = node;
  while (cur.left) cur = cur.left;
  return cur;
}

/** Delete with step recording */
function deleteWithSteps(
  root: AVLNode | null,
  value: number,
  steps: InsertStep[],
  deleted: { found: boolean }
): AVLNode | null {
  if (!root) return null;

  if (value < root.data) {
    root.left = deleteWithSteps(root.left, value, steps, deleted);
  } else if (value > root.data) {
    root.right = deleteWithSteps(root.right, value, steps, deleted);
  } else {
    // Found the node to delete
    deleted.found = true;

    if (!root.left || !root.right) {
      // Case 1 & 2: node has 0 or 1 child
      const child = root.left ?? root.right;
      steps.push({
        stepIndex: steps.length,
        description: !root.left && !root.right
          ? `Deleting leaf node ${root.data}.`
          : `Deleting node ${root.data} (has one child — replace with child ${child!.data}).`,
        rotationType: null,
        root: cloneTree(root),
        highlightedNodes: [root.id],
        phase: "delete",
        insertedValue: value,
      });
      return child;
    } else {
      // Case 3: node has two children — use inorder successor
      const successor = minNode(root.right);
      steps.push({
        stepIndex: steps.length,
        description: `Node ${root.data} has two children. Replacing with inorder successor ${successor.data}, then deleting successor from right subtree.`,
        rotationType: null,
        root: cloneTree(root),
        highlightedNodes: [root.id, successor.id],
        phase: "successor",
        insertedValue: value,
      });
      root.data = successor.data;
      root.right = deleteWithSteps(root.right, successor.data, steps, { found: false });
    }
  }

  return rebalanceAfterDelete(root, steps, value);
}

/** Public delete API that returns steps */
export function avlDelete(
  root: AVLNode | null,
  value: number
): { newRoot: AVLNode | null; steps: InsertStep[]; found: boolean } {
  const steps: InsertStep[] = [];
  const deleted = { found: false };

  steps.push({
    stepIndex: 0,
    description: `Searching for node ${value} to delete...`,
    rotationType: null,
    root: cloneTree(root),
    highlightedNodes: [],
    phase: "delete",
    insertedValue: value,
  });

  const newRoot = deleteWithSteps(root, value, steps, deleted);

  if (!deleted.found) {
    return { newRoot: root, steps: [], found: false };
  }

  if (newRoot) {
    recalcAll(newRoot);
    // Bug fix: clear isNew flags — deleted node might have been green
    clearNewFlags(newRoot);
  }

  steps.push({
    stepIndex: steps.length,
    description: `Deletion of ${value} complete. Tree is balanced. ${newRoot ? `New root: ${newRoot.data}` : "Tree is now empty."}`,
    rotationType: null,
    root: cloneTree(newRoot),
    highlightedNodes: [],
    phase: "done",
    insertedValue: value,
  });

  return { newRoot, steps, found: true };
}

function recalcAll(node: AVLNode | null): void {
  if (!node) return;
  recalcAll(node.left);
  recalcAll(node.right);
  updateHeightAndBF(node);
}

/** Assign x,y positions for rendering */
export function assignPositions(
  node: AVLNode | null,
  x: number,
  y: number,
  spread: number
): void {
  if (!node) return;
  node.x = x;
  node.y = y;
  // Use a gentler division so deeper levels don't cramp up instantly
  const childSpread = Math.max(spread / 1.6, 45);
  assignPositions(node.left, x - childSpread, y + 80, childSpread);
  assignPositions(node.right, x + childSpread, y + 80, childSpread);
}

/** Preorder traversal */
export function preorder(node: AVLNode | null): number[] {
  if (!node) return [];
  return [node.data, ...preorder(node.left), ...preorder(node.right)];
}

/** Inorder traversal */
export function inorder(node: AVLNode | null): number[] {
  if (!node) return [];
  return [...inorder(node.left), node.data, ...inorder(node.right)];
}

/** Postorder traversal */
export function postorder(node: AVLNode | null): number[] {
  if (!node) return [];
  return [...postorder(node.left), ...postorder(node.right), node.data];
}

/** Count nodes */
export function countNodes(node: AVLNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

export function resetNodeIdCounter() {
  nodeIdCounter = 0;
}
