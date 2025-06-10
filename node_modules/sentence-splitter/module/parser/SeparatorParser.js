export const DefaultOptions = {
    separatorCharacters: [
        ".", // period
        "．", // (ja) zenkaku-period
        "。", // (ja) 句点
        "?", // question mark
        "!", //  exclamation mark
        "？", // (ja) zenkaku question mark
        "！" // (ja) zenkaku exclamation mark
    ]
};
/**
 * Separator parser
 */
export class SeparatorParser {
    options;
    separatorCharacters;
    constructor(options) {
        this.options = options;
        this.separatorCharacters =
            options && options.separatorCharacters ? options.separatorCharacters : DefaultOptions.separatorCharacters;
    }
    test(sourceCode) {
        if (sourceCode.isInContext()) {
            return false;
        }
        if (sourceCode.isInContextRange()) {
            return false;
        }
        const firstChar = sourceCode.read();
        const nextChar = sourceCode.read(1);
        if (!firstChar) {
            return false;
        }
        if (!this.separatorCharacters.includes(firstChar)) {
            return false;
        }
        // Need space after period
        // Example: "This is a pen. This is not a pen."
        // It will avoid false-position like `1.23`
        if (firstChar === ".") {
            if (nextChar) {
                return /[\s\t\r\n]/.test(nextChar);
            }
            else {
                return true;
            }
        }
        return true;
    }
    seek(sourceCode) {
        while (this.test(sourceCode)) {
            sourceCode.peek();
        }
    }
}
//# sourceMappingURL=SeparatorParser.js.map