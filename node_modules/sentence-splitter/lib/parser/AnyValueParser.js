"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyValueParser = void 0;
const logger_js_1 = require("../logger.js");
/**
 * Any value without `parsers`
 */
class AnyValueParser {
    parsers;
    markers;
    /**
     * Eat any value without `parsers.test`
     */
    constructor(options) {
        this.parsers = options.parsers;
        this.markers = options.markers;
    }
    test(sourceCode) {
        if (sourceCode.hasEnd) {
            return false;
        }
        return this.parsers.every((parser) => !parser.test(sourceCode));
    }
    seek(sourceCode) {
        const currentNode = sourceCode.readNode();
        if (!currentNode) {
            // Text mode
            while (this.test(sourceCode)) {
                this.markers.forEach((marker) => marker.mark(sourceCode));
                sourceCode.peek();
            }
            return;
        }
        // node - should not over next node
        const isInCurrentNode = () => {
            const currentOffset = sourceCode.offset;
            return currentNode.range[0] <= currentOffset && currentOffset < currentNode.range[1];
        };
        while (isInCurrentNode() && this.test(sourceCode)) {
            (0, logger_js_1.seekLog)(sourceCode.offset, sourceCode.read());
            this.markers.forEach((marker) => marker.mark(sourceCode));
            sourceCode.peek();
        }
    }
}
exports.AnyValueParser = AnyValueParser;
//# sourceMappingURL=AnyValueParser.js.map