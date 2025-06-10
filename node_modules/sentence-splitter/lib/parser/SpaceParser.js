"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceParser = void 0;
/**
 * Space parser
 */
class SpaceParser {
    test(sourceCode) {
        const string = sourceCode.read();
        if (!string) {
            return false;
        }
        // space without new line
        return /[^\S\n\r]/.test(string);
    }
    seek(sourceCode) {
        while (this.test(sourceCode)) {
            sourceCode.peek();
        }
    }
}
exports.SpaceParser = SpaceParser;
//# sourceMappingURL=SpaceParser.js.map