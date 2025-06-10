"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewLineParser = void 0;
/**
 * New Line Parser
 */
class NewLineParser {
    test(sourceCode) {
        const string = sourceCode.read();
        if (!string) {
            return false;
        }
        return /[\r\n]/.test(string);
    }
    seek(sourceCode) {
        while (this.test(sourceCode)) {
            sourceCode.peek();
        }
    }
}
exports.NewLineParser = NewLineParser;
//# sourceMappingURL=NewLineParser.js.map