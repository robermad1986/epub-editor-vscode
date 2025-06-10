const isDebug = typeof process === "object" && process?.env?.DEBUG === "sentence-splitter";
export function seekLog(offset, current) {
    if (!isDebug) {
        return;
    }
    console.log("sentence-splitter: " + offset, current);
}
export function nodeLog(message, sourceCode) {
    if (!isDebug) {
        return;
    }
    if (!sourceCode) {
        console.log("sentence-splitter: " + message);
        return;
    }
    const currentNode = sourceCode.readNode();
    if (!currentNode) {
        console.log("sentence-splitter: " + message);
        return;
    }
    const RowLength = 50;
    const currentChar = (sourceCode.read() || "").replace(/\n/g, "\\n");
    const nodeValue = currentNode.raw.replace(/\n/g, "\\n");
    console.log("sentence-splitter: " +
        sourceCode.offset +
        " " +
        message +
        " |" +
        currentChar +
        "| " +
        " ".repeat(RowLength - currentChar.length - message.length) +
        nodeValue);
}
export function debugLog(...message) {
    if (!isDebug) {
        return;
    }
    console.log("sentence-splitter: ", ...message.map((m) => {
        // make one line if it is multiline
        return typeof m === "string" ? m.replace(/\n/g, "\\n") : m;
    }));
}
//# sourceMappingURL=logger.js.map