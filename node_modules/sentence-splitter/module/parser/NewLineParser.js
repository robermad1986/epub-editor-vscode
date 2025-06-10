/**
 * New Line Parser
 */
export class NewLineParser {
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
//# sourceMappingURL=NewLineParser.js.map