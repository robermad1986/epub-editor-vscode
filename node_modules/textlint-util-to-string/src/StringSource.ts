import type { TxtHtmlNode, TxtNode, TxtNodeLocation, TxtNodeRange, TxtParagraphNode } from "@textlint/ast-node-types";
import { SourcePosition, StructuredSource } from "structured-source";
import unified from "unified";
// @ts-expect-error no type definition
import parse from "rehype-parse";
import { emptyValue, handleReplacerCommand, maskValue, StringSourceReplacerCommand } from "./replacer";
import { UnistNode } from "./UnistNode";

const isTxtNode = (node: unknown): node is TxtNode => {
    return typeof node === "object" && node !== null && "range" in node;
};
const isHtmlNode = (node: StringSourceTxtParentNodeLikeNode | StringSourceTxtTxtNode): node is TxtHtmlNode => {
    return node.type === "Html";
};
const htmlProcessor = unified().use(parse, { fragment: true });
const html2hast = (html: string) => {
    return htmlProcessor.parse(html);
};

const isParentNode = (
    node: UnistNode | TxtNode | StringSourceTxtParentNodeLikeNode
): node is StringSourceTxtParentNodeLikeNode => {
    return "children" in node;
};

/* StringSourceIR example
 Example: **Str**
 {
 // original range
 // [0, 7] = `**Str**`
 original : [start, end]
 // intermediate = trim decoration from Original
 // [2, 5]
 intermediate: [start, end]
 // (generated) value
 generatedValue: "Str"
 // [0, 3]
 generated : [start, end]
 }
 */

type StringSourceIR = {
    original: readonly [number, number];
    intermediate: readonly [number, number];
    generatedValue: string;
    generated?: readonly [number, number];
};

export type StringSourceOptions = {
    replacer?: ({
        node,
        parent
    }: {
        node: TxtNode | UnistNode;
        parent?: StringSourceTxtParentNodeLikeNode;
        maskValue: typeof maskValue;
        emptyValue: typeof emptyValue;
    }) => StringSourceReplacerCommand | undefined;
};
/**
 * TxtTxtNode-like definition
 * It is intentionally loose definition to accept sentences-splitter's node and unist node.
 */
export type StringSourceTxtTxtNode = {
    type: string;
    raw: string;
    range: TxtNodeRange;
    loc: TxtNodeLocation;
    value?: string | null | undefined;
};
/**
 * TxtParentNode-like definition
 * It is intentionally loose definition to accept sentences-splitter's node and unist node.
 */
export type StringSourceTxtParentNodeLikeNode = {
    type: string;
    raw: string;
    range: TxtNodeRange;
    loc: TxtNodeLocation;
    children: (StringSourceTxtTxtNode | StringSourceTxtParentNodeLikeNode)[];
};

export class StringSource {
    private rootNode: StringSourceTxtParentNodeLikeNode;
    private generatedString: string;
    private originalSource: StructuredSource;
    private generatedSource: StructuredSource;
    private tokenMaps: StringSourceIR[];

    constructor(node: StringSourceTxtParentNodeLikeNode, options: StringSourceOptions = {}) {
        this.rootNode = node;
        this.tokenMaps = [];
        this.generatedString = "";
        // pre calculate
        this._stringify({ node: this.rootNode, options });
        this.originalSource = new StructuredSource(this.rootNode.raw);
        this.generatedSource = new StructuredSource(this.generatedString);
    }

    toString() {
        return this.generatedString;
    }

    /**
     * @deprecated use originalIndexFromIndex instead of
     * @param targetIndex
     */
    originalIndexFor(targetIndex: number): number | undefined {
        return this.originalIndexFromIndex(targetIndex);
    }

    /**
     * @deprecated use originalPositionFromPosition instead of
     * @param generatedPosition
     * @param {boolean}  isEnd - is the position end of the node?

     * @returns {Object}
     */
    originalPositionFor(generatedPosition: SourcePosition, isEnd = false): SourcePosition | undefined {
        return this.originalPositionFromPosition(generatedPosition, isEnd);
    }

    /**
     * get original index from generated index value
     * @param {number} generatedIndex - position is a index value.
     * @param {boolean}  isEnd - is the position end of the node?
     * @returns {number|undefined} original
     */
    originalIndexFromIndex(generatedIndex: number, isEnd = false) {
        const hitTokenMaps = this.tokenMaps.filter((tokenMap, index) => {
            const generated = tokenMap.generated;
            const nextTokenMap = this.tokenMaps[index + 1];
            const nextGenerated = nextTokenMap ? nextTokenMap.generated : null;
            if (!generated) {
                return false;
            }
            if (nextGenerated) {
                if (generated[0] <= generatedIndex && generatedIndex <= nextGenerated[0]) {
                    return true;
                }
            } else {
                if (generated[0] <= generatedIndex && generatedIndex <= generated[1]) {
                    return true;
                }
            }
            return false;
        });
        if (hitTokenMaps.length === 0) {
            return;
        }

        /**
         * **Str**ABC
         *     |
         *     |
         *   generatedIndex
         *
         * If isEnd is true, generatedIndex is end of **Str** node.
         * If isEnd is false, generatedIndex is index of ABC node.
         */

        const hitTokenMap = isEnd ? hitTokenMaps[0] : hitTokenMaps[hitTokenMaps.length - 1];
        // <----------->[<------------->|text]
        //              ^        ^
        //   position-generated  intermediate-origin

        // <-------------->[<------------->|text]
        //       |         |
        //  outer adjust   _
        //            inner adjust = 1

        if (!hitTokenMap.generated) {
            console.warn("hitTokenMap.generated is missing", hitTokenMap);
            return;
        }
        const outerAdjust = generatedIndex - hitTokenMap.generated[0];
        const innerAdjust = hitTokenMap.intermediate[0] - hitTokenMap.original[0];
        return outerAdjust + innerAdjust + hitTokenMap.original[0];
    }

    /**
     * get original position from generated position
     * @param {object} position
     * @param {boolean}  isEnd - is the position end of the node?
     * @returns {object} original position
     */
    originalPositionFromPosition(position: SourcePosition, isEnd = false): SourcePosition | undefined {
        if (typeof position.line === "undefined" || typeof position.column === "undefined") {
            throw new Error("position.{line, column} should not undefined: " + JSON.stringify(position));
        }
        const generatedIndex = this.generatedSource.positionToIndex(position);
        if (isNaN(generatedIndex)) {
            // Not Found
            return;
        }
        const originalIndex = this.originalIndexFromIndex(generatedIndex, isEnd);
        if (originalIndex === undefined) {
            return;
        }
        return this.originalSource.indexToPosition(originalIndex);
    }

    /**
     * get original index from generated position
     * @param {object} generatedPosition
     * @param {boolean}  isEnd - is the position end of the node?
     * @returns {number} original index
     */
    originalIndexFromPosition(generatedPosition: SourcePosition, isEnd = false): number | undefined {
        const originalPosition = this.originalPositionFromPosition(generatedPosition, isEnd);
        if (originalPosition === undefined) {
            return;
        }
        return this.originalSource.positionToIndex(originalPosition);
    }

    /**
     * get original position from generated index
     * @param {number} generatedIndex
     * @param {boolean} isEnd - is the position end of the node?
     * @return {object} original position
     */
    originalPositionFromIndex(generatedIndex: number, isEnd = false): SourcePosition | undefined {
        const originalIndex = this.originalIndexFromIndex(generatedIndex, isEnd);
        if (originalIndex === undefined) {
            return;
        }
        return this.originalSource.indexToPosition(originalIndex);
    }

    isParagraphNode(node: TxtNode | StringSourceTxtParentNodeLikeNode): node is TxtParagraphNode {
        return node.type === "Paragraph";
    }

    isStringNode(node: TxtNode | UnistNode): boolean {
        return node.type === "Str";
    }

    /**
     *
     * @param node
     * @returns {string|undefined}
     * @private
     */
    private _getValue(node: TxtNode | UnistNode): string | undefined {
        if ("value" in node && typeof node.value === "string") {
            return node.value;
        } else if ("alt" in node && typeof node.alt === "string") {
            return node.alt;
        } else if ("title" in node) {
            // Ignore link title e.g.) [text](url "title")
            // See https://github.com/azu/textlint-rule-sentence-length/issues/6
            if (node.type === "Link") {
                return;
            }
            if (typeof node.title !== "string") {
                return;
            }
            return node.title;
        } else {
            return;
        }
    }

    private _nodeRangeAsRelative(node: TxtNode | UnistNode): [number, number] {
        if (isTxtNode(node)) {
            // relative from root
            return [node.range[0] - this.rootNode.range[0], node.range[1] - this.rootNode.range[0]];
        } else {
            return [
                (node.position?.start?.offset ?? 0) - this.rootNode.range[0],
                (node.position?.end?.offset ?? 0) - this.rootNode.range[0]
            ];
        }
    }

    private _valueOf({
        node,
        parent,
        options
    }: {
        node: TxtNode | UnistNode;
        parent?: StringSourceTxtParentNodeLikeNode;
        options: StringSourceOptions;
    }): StringSourceIR | undefined {
        if (!node) {
            return;
        }
        const replaceCommand = options?.replacer?.({ node, parent, maskValue, emptyValue });
        const newNode = replaceCommand ? handleReplacerCommand(replaceCommand, node) : node;
        // [padding][value][padding]
        // =>
        // [value][value][value]
        const value = this._getValue(newNode);
        if (!value) {
            return;
        }
        if (parent === null || parent === undefined) {
            return;
        }
        // <p><Str /></p>
        if (this.isParagraphNode(parent) && this.isStringNode(newNode)) {
            return {
                original: this._nodeRangeAsRelative(newNode),
                intermediate: this._nodeRangeAsRelative(newNode),
                generatedValue: value
            };
        }
        // <p><code>code</code></p>
        // => container is <p>
        // <p><strong><Str /></strong></p>
        // => container is <strong>
        const container = this.isParagraphNode(parent) ? newNode : parent;
        const rawValue = "raw" in container ? container.raw : undefined;
        if (rawValue === undefined) {
            return;
        }
        // avoid match ! with ![
        // TODO: indexOf(value, 1) 1 is unexpected ...
        const paddingLeft = rawValue.indexOf(value, 1) === -1 ? 0 : rawValue.indexOf(value, 1);
        const paddingRight = rawValue.length - (paddingLeft + value.length);
        // original range should be relative value from rootNode
        const originalRange = this._nodeRangeAsRelative(container);
        const intermediateRange = [originalRange[0] + paddingLeft, originalRange[1] - paddingRight] as const;
        return {
            original: originalRange,
            intermediate: intermediateRange,
            generatedValue: value
        };
    }

    private _addTokenMap(tokenMap: StringSourceIR) {
        if (tokenMap == null) {
            return;
        }
        let addedTokenMap = Object.assign({}, tokenMap);
        if (this.tokenMaps.length === 0) {
            const textLength = addedTokenMap.intermediate[1] - addedTokenMap.intermediate[0];
            addedTokenMap["generated"] = [0, textLength];
        } else {
            const textLength = addedTokenMap.intermediate[1] - addedTokenMap.intermediate[0];
            addedTokenMap["generated"] = [this.generatedString.length, this.generatedString.length + textLength];
        }
        this.generatedString += tokenMap.generatedValue;
        this.tokenMaps.push(addedTokenMap);
    }

    /**
     * Compute text content of a node.  If the node itself
     * does not expose plain-text fields, `toString` will
     * recursively map
     *
     * @param {Node} node - Node to transform to a string.
     * @param {Node} [parent] - Parent Node of the `node`.
     * @param options
     */
    private _stringify({
        node,
        parent,
        options
    }: {
        node: StringSourceTxtParentNodeLikeNode | StringSourceTxtTxtNode;
        parent?: StringSourceTxtParentNodeLikeNode;
        options: StringSourceOptions;
    }): void | StringSourceIR {
        const currentNode = isHtmlNode(node) ? html2hast(node.value) : node;
        const value = this._valueOf({ node: currentNode, parent: parent, options });
        if (value) {
            return value;
        }
        if (!isParentNode(currentNode)) {
            return;
        }
        currentNode.children.forEach((childNode) => {
            if (!isParentNode(node)) {
                return;
            }
            const tokenMap = this._stringify({
                node: childNode,
                parent: node,
                options
            });
            if (tokenMap) {
                this._addTokenMap(tokenMap);
            }
        });
    }
}
