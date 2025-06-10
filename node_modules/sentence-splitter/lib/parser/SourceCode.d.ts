import { TxtNode, TxtParentNode } from "@textlint/ast-node-types";
import { AbstractParser } from "./AbstractParser.js";
export type PairMark = {
    key: string;
    start: string;
    end: string;
};
export declare class SourceCode {
    private index;
    private source;
    private textCharacters;
    private sourceNode?;
    private contexts;
    consumedContexts: {
        pairMark: PairMark;
        range: readonly [number, number];
        loc: {
            start: {
                line: number;
                column: number;
            };
            end: {
                line: number;
                column: number;
            };
        };
    }[];
    private contextRanges;
    private firstChildPadding;
    private startOffset;
    constructor(input: string | TxtParentNode);
    get length(): number;
    markContextRange(range: [number, number]): void;
    isInContextRange(): boolean;
    enterContext(pairMark: PairMark): void;
    isInContext(pairMark?: PairMark): boolean;
    leaveContext(pairMark: PairMark): void;
    /**
     * Return current offset value
     * @returns {number}
     */
    get offset(): number;
    /**
     * Return current position object.
     * It includes line, column, offset.
     */
    now(): {
        line: number;
        column: number;
        offset: number;
    };
    /**
     * Return true, no more read char
     */
    get hasEnd(): boolean;
    /**
     * read char
     * if can not read, return empty string
     * @returns {string}
     */
    read(over?: number): string | false;
    /**
     * read node
     * if can not read, return empty string
     * @returns {node}
     */
    readNode(over?: number): false | import("@textlint/ast-node-types/lib/src/NodeType.js").Content;
    /**
     * Increment current index
     */
    peek(): void;
    /**
     * Increment node range
     */
    peekNode(node: TxtNode): void;
    /**
     * Seek and Peek
     */
    seekNext(parser: AbstractParser): {
        value: string;
        startPosition: {
            line: number;
            column: number;
            offset: number;
        };
        endPosition: {
            line: number;
            column: number;
            offset: number;
        };
    };
    /**
     * Slice text form the range.
     * @param {number} start
     * @param {number} end
     * @returns {string}
     */
    sliceRange(start: number, end: number): string;
}
//# sourceMappingURL=SourceCode.d.ts.map