/**
 * AVL Tree Implementation — Java Reference
 * DSA Project: Self-Balancing Binary Search Tree
 *
 * This is the original Java implementation that the web visualizer is based on.
 * It demonstrates all four rotation cases: LL, RR, LR, RL.
 *
 * Time Complexity: O(log n) for Insert, Search, Delete
 * Space Complexity: O(n) for storage, O(log n) for recursion stack
 */

import java.util.*;
import java.util.function.*;

// ─────────────────────────────────────────────────────────────────────────────
// AVL Node
// ─────────────────────────────────────────────────────────────────────────────
class AVLNode {
    int data;
    int h;                  // height of subtree rooted at this node
    AVLNode left, right;

    public AVLNode(int data) {
        this.data = data;
        this.h = 1;         // newly inserted node has height 1
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// AVL Tree Operations
// ─────────────────────────────────────────────────────────────────────────────
class Solution {

    /**
     * Insert a value into the AVL tree.
     * Returns the (possibly new) root of the subtree.
     *
     * After each insertion the balance factor (BF) is checked at each ancestor.
     * If |BF| > 1, the appropriate rotation is applied:
     *   BF = height(left) - height(right)
     */
    AVLNode insert(AVLNode root, int x) {
        // 1. Standard BST insert
        if (root == null) return new AVLNode(x);

        if (x < root.data)
            root.left = insert(root.left, x);
        else if (x > root.data)
            root.right = insert(root.right, x);
        else
            return root;   // duplicates are ignored

        // 2. Update height of current node
        updateHeight(root);

        // 3. Check balance and rotate if needed
        int bf = getBF(root);

        // ── LL Case: Left heavy, and new node is in left subtree of left child
        if (bf == +2 && getBF(root.left) >= 0) {
            System.out.println("LL Case → Right Rotate on " + root.data);
            return rightRotate(root);
        }

        // ── RR Case: Right heavy, and new node is in right subtree of right child
        if (bf == -2 && getBF(root.right) <= 0) {
            System.out.println("RR Case → Left Rotate on " + root.data);
            return leftRotate(root);
        }

        // ── LR Case: Left heavy, but new node is in right subtree of left child
        if (bf == +2 && getBF(root.left) < 0) {
            System.out.println("LR Case → Left Rotate on left child, then Right Rotate on " + root.data);
            root.left = leftRotate(root.left);
            return rightRotate(root);
        }

        // ── RL Case: Right heavy, but new node is in left subtree of right child
        if (bf == -2 && getBF(root.right) > 0) {
            System.out.println("RL Case → Right Rotate on right child, then Left Rotate on " + root.data);
            root.right = rightRotate(root.right);
            return leftRotate(root);
        }

        return root;
    }

    /**
     * Left Rotation (fixes RR imbalance)
     *
     *    x                y
     *   / \              / \
     *  T1   y    →→→   x    T3
     *      / \         / \
     *     T2  T3      T1  T2
     */
    AVLNode leftRotate(AVLNode x) {
        AVLNode y  = x.right;
        AVLNode T2 = y.left;

        // Perform rotation
        y.left  = x;
        x.right = T2;

        // Update heights (x first, then y since y is now parent)
        updateHeight(x);
        updateHeight(y);

        return y;   // new root
    }

    /**
     * Right Rotation (fixes LL imbalance)
     *
     *       y                x
     *      / \             /   \
     *     x   T3   →→→   T1    y
     *    / \                  / \
     *   T1  T2              T2  T3
     */
    AVLNode rightRotate(AVLNode y) {
        AVLNode x  = y.left;
        AVLNode T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left  = T2;

        // Update heights
        updateHeight(y);
        updateHeight(x);

        return x;   // new root
    }

    /** Update height: 1 + max(leftHeight, rightHeight) */
    void updateHeight(AVLNode node) {
        if (node == null) return;
        node.h = 1 + Math.max(
            node.left  == null ? 0 : node.left.h,
            node.right == null ? 0 : node.right.h
        );
    }

    /**
     * Balance Factor = height(leftSubtree) - height(rightSubtree)
     * AVL property: |BF| ≤ 1 at every node
     */
    int getBF(AVLNode node) {
        if (node == null) return 0;
        return (node.left  == null ? 0 : node.left.h) -
               (node.right == null ? 0 : node.right.h);
    }

    /** Pre-order traversal: Root → Left → Right */
    void preorder(AVLNode root) {
        if (root == null) return;
        System.out.print(root.data + " ");
        preorder(root.left);
        preorder(root.right);
    }

    /** In-order traversal: Left → Root → Right (gives sorted output) */
    void inorder(AVLNode root) {
        if (root == null) return;
        inorder(root.left);
        System.out.print(root.data + " ");
        inorder(root.right);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Driver
// ─────────────────────────────────────────────────────────────────────────────
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();

        AVLNode r = null;
        Solution s = new Solution();

        // Pretty-printer for the tree
        TreePrinter<AVLNode> tp = new TreePrinter<>(
            n -> n.data + "(BF=" + (
                (n.left == null ? 0 : n.left.h) -
                (n.right == null ? 0 : n.right.h)
            ) + ")",
            n -> n.left,
            n -> n.right
        );

        System.out.println("=".repeat(50));
        System.out.println(" AVL TREE INSERTION DEMO");
        System.out.println("=".repeat(50));

        while (num-- != 0) {
            int x = sc.nextInt();
            System.out.println("\n>>> Inserting: " + x);
            r = s.insert(r, x);
            System.out.println("    BF of root (" + r.data + ") = " + s.getBF(r));
            tp.printTree(r);
            System.out.println();
        }

        System.out.println("─".repeat(50));
        System.out.print("Preorder:  ");
        s.preorder(r);
        System.out.println();

        System.out.print("Inorder:   ");
        s.inorder(r);
        System.out.println();
        System.out.println("─".repeat(50));
        System.out.println("Final tree height: " + (r == null ? 0 : r.h));
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pretty Print Binary Tree — TreePrinter<T>
// ─────────────────────────────────────────────────────────────────────────────
class TreePrinter<T> {
    private java.util.function.Function<T, String> getLabel;
    private java.util.function.Function<T, T> getLeft;
    private java.util.function.Function<T, T> getRight;

    private boolean squareBranches = false;
    private boolean lrAgnostic = false;
    private int hspace = 2;

    public TreePrinter(
        java.util.function.Function<T, String> getLabel,
        java.util.function.Function<T, T> getLeft,
        java.util.function.Function<T, T> getRight
    ) {
        this.getLabel = getLabel;
        this.getLeft  = getLeft;
        this.getRight = getRight;
    }

    public void printTree(T root) {
        List<TreeLine> lines = buildTreeLines(root);
        if (lines.isEmpty()) return;
        int minLeft  = lines.stream().mapToInt(l -> l.leftOffset).min().orElse(0);
        int maxRight = lines.stream().mapToInt(l -> l.rightOffset).max().orElse(0);
        for (TreeLine line : lines) {
            System.out.println(
                spaces(-(minLeft - line.leftOffset)) + line.line +
                spaces(maxRight - line.rightOffset)
            );
        }
    }

    private List<TreeLine> buildTreeLines(T root) {
        if (root == null) return java.util.Collections.emptyList();

        String rootLabel = getLabel.apply(root);
        List<TreeLine> leftLines  = buildTreeLines(getLeft.apply(root));
        List<TreeLine> rightLines = buildTreeLines(getRight.apply(root));

        int leftCount  = leftLines.size();
        int rightCount = rightLines.size();
        int minCount   = Math.min(leftCount, rightCount);
        int maxCount   = Math.max(leftCount, rightCount);

        int maxRootSpacing = 0;
        for (int i = 0; i < minCount; i++) {
            int sp = leftLines.get(i).rightOffset - rightLines.get(i).leftOffset;
            if (sp > maxRootSpacing) maxRootSpacing = sp;
        }
        int rootSpacing = maxRootSpacing + hspace;
        if (rootSpacing % 2 == 0) rootSpacing++;

        List<TreeLine> all = new ArrayList<>();
        String rendered = rootLabel.replaceAll("\\e\\[[\\d;]*[^\\d;]", "");
        all.add(new TreeLine(rootLabel, -(rendered.length()-1)/2, rendered.length()/2));

        int leftAdjust = 0, rightAdjust = 0;

        if (leftLines.isEmpty() && !rightLines.isEmpty()) {
            all.add(new TreeLine("\\", 1, 1));
            rightAdjust = 2;
        } else if (!leftLines.isEmpty() && rightLines.isEmpty()) {
            all.add(new TreeLine("/", -1, -1));
            leftAdjust = -2;
        } else if (!leftLines.isEmpty()) {
            if (rootSpacing == 1) {
                all.add(new TreeLine("/ \\", -1, 1));
                rightAdjust = 2; leftAdjust = -2;
            } else {
                for (int i = 1; i < rootSpacing; i += 2)
                    all.add(new TreeLine("/" + spaces(i) + "\\", -((i+1)/2), (i+1)/2));
                rightAdjust = rootSpacing/2 + 1;
                leftAdjust  = -(rootSpacing/2 + 1);
            }
        }

        for (int i = 0; i < maxCount; i++) {
            if (i >= leftLines.size()) {
                TreeLine r = rightLines.get(i);
                r.leftOffset += rightAdjust; r.rightOffset += rightAdjust;
                all.add(r);
            } else if (i >= rightLines.size()) {
                TreeLine l = leftLines.get(i);
                l.leftOffset += leftAdjust; l.rightOffset += leftAdjust;
                all.add(l);
            } else {
                TreeLine l = leftLines.get(i), r = rightLines.get(i);
                int adj = rootSpacing == 1 ? 3 : rootSpacing;
                all.add(new TreeLine(
                    l.line + spaces(adj - l.rightOffset + r.leftOffset) + r.line,
                    l.leftOffset + leftAdjust, r.rightOffset + rightAdjust
                ));
            }
        }
        return all;
    }

    private static String spaces(int n) {
        if (n <= 0) return "";
        return " ".repeat(n);
    }

    private static class TreeLine {
        String line; int leftOffset, rightOffset;
        TreeLine(String line, int lo, int ro) { this.line=line; leftOffset=lo; rightOffset=ro; }
    }
}
