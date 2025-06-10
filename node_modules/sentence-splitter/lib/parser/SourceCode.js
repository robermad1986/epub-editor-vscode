"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceCode = void 0;
const structured_source_1 = require("structured-source");
const findLastIndex = (array, predicate) => {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i], i, array)) {
            return i;
        }
    }
    return -1;
};
class SourceCode {
    index = 0;
    source;
    textCharacters;
    sourceNode;
    // active context
    contexts = [];
    // These context is consumed
    // It is used for attaching context to AST
    consumedContexts = [];
    contextRanges = [];
    firstChildPadding;
    startOffset;
    constructor(input) {
        if (typeof input === "string") {
            this.textCharacters = input.split("");
            this.source = new structured_source_1.StructuredSource(input);
            this.startOffset = 0;
            this.firstChildPadding = 0;
        }
        else {
            this.sourceNode = input;
            // When pass AST, fist node may be >=
            // Preserve it as `startOffset`
            this.startOffset = this.sourceNode.range[0];
            // start index is startOffset
            this.index = this.startOffset;
            // before line count of Paragraph node
            const lineBreaks = Array.from(new Array(this.sourceNode.loc.start.line - 1)).fill("\n");
            // filled with dummy text( range[0] - lineBreaks.length = empty space should be filled)
            const firstOffset = Array.from(new Array(this.startOffset - lineBreaks.length)).fill("∯");
            const inputCharacters = input.raw.split("");
            this.textCharacters = [...lineBreaks, ...firstOffset, ...inputCharacters];
            this.source = new structured_source_1.StructuredSource(this.textCharacters.join(""));
            if (this.sourceNode.children[0]) {
                // Header Node's children does not start with index 0
                // Example: # Header
                // It firstChildPadding is `2`
                this.firstChildPadding = this.sourceNode.children[0].range[0] - this.startOffset;
            }
            else {
                this.firstChildPadding = 0;
            }
        }
    }
    get length() {
        return this.textCharacters.length;
    }
    // range mark is for abbreviation
    markContextRange(range) {
        this.contextRanges.push(range);
    }
    isInContextRange() {
        const offset = this.offset;
        return this.contextRanges.some((range) => {
            return range[0] <= offset && offset < range[1];
        });
    }
    // context is for pair mark
    enterContext(pairMark) {
        this.contexts.push([pairMark, this.index]);
    }
    isInContext(pairMark) {
        if (!pairMark) {
            return this.contexts.length > 0;
        }
        return this.contexts.some((targetContext) => targetContext[0].key === pairMark.key);
    }
    leaveContext(pairMark) {
        const index = findLastIndex(this.contexts, (context) => context[0].key === pairMark.key);
        if (index !== -1) {
            const consumed = this.contexts[index];
            this.contexts.splice(index, 1);
            const range = [consumed[1], this.index];
            this.consumedContexts.push({
                pairMark: consumed[0],
                range: [consumed[1], this.index],
                loc: this.source.rangeToLocation(range)
            });
        }
    }
    /**
     * Return current offset value
     * @returns {number}
     */
    get offset() {
        return this.index + this.firstChildPadding;
    }
    /**
     * Return current position object.
     * It includes line, column, offset.
     */
    now() {
        const indexWithChildrenOffset = this.offset;
        const position = this.source.indexToPosition(indexWithChildrenOffset);
        return {
            line: position.line,
            column: position.column,
            offset: indexWithChildrenOffset
        };
    }
    /**
     * Return true, no more read char
     */
    get hasEnd() {
        return this.read() === false;
    }
    /**
     * read char
     * if can not read, return empty string
     * @returns {string}
     */
    read(over = 0) {
        const index = this.offset + over;
        if (index < this.startOffset) {
            return false;
        }
        if (0 <= index && index < this.textCharacters.length) {
            return this.textCharacters[index];
        }
        return false;
    }
    /**
     * read node
     * if can not read, return empty string
     * @returns {node}
     */
    readNode(over = 0) {
        if (!this.sourceNode) {
            return false;
        }
        const index = this.offset + over;
        if (index < this.startOffset) {
            return false;
        }
        const matchNodeList = this.sourceNode.children.filter((node) => {
            // <p>[node]</p>
            //         ^
            //        range[1]
            // `< range[1]` prevent infinity loop
            // https://github.com/azu/sentence-splitter/issues/9
            return node.range[0] <= index && index < node.range[1];
        });
        if (matchNodeList.length > 0) {
            // last match
            // because, range is overlap two nodes
            return matchNodeList[matchNodeList.length - 1];
        }
        return false;
    }
    /**
     * Increment current index
     */
    peek() {
        this.index += 1;
    }
    /**
     * Increment node range
     */
    peekNode(node) {
        this.index += node.range[1] - node.range[0];
    }
    /**
     * Seek and Peek
     */
    seekNext(parser) {
        const startPosition = this.now();
        parser.seek(this);
        const endPosition = this.now();
        const value = this.sliceRange(startPosition.offset, endPosition.offset);
        return {
            value,
            startPosition,
            endPosition
        };
    }
    /**
     * Slice text form the range.
     * @param {number} start
     * @param {number} end
     * @returns {string}
     */
    sliceRange(start, end) {
        return this.textCharacters.slice(start, end).join("");
    }
}
exports.SourceCode = SourceCode;
//# sourceMappingURL=SourceCode.js.map