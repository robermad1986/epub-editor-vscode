/**
 * Space parser
 */
export class SpaceParser {
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
//# sourceMappingURL=SpaceParser.js.map