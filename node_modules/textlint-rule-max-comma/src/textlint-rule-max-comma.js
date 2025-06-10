// LICENSE : MIT
"use strict";
import { splitAST, SentenceSplitterSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string"

function countOfComma(text) {
    return text.split(",").length - 1;
}

const defaultOptions = {
    // default: allowed command count
    max: 4
};
export default function (context, options = defaultOptions) {
    const maxComma = options.max || defaultOptions.max;
    const { Syntax, RuleError, report, locator } = context;
    return {
        [Syntax.Paragraph](node) {
            const paragraphSentence = splitAST(node)
            const sentences = paragraphSentence.children.filter(node => node.type === SentenceSplitterSyntax.Sentence) ?? [];
            sentences.forEach(sentence => {
                // Remove Code node for avoiding false-positive in `CODE`
                // This `sum(0,1,2,3,4,5,6,7,8,9,10)` is ok
                // → This is ok
                const source = new StringSource(sentence, {
                    replacer: ({ node, maskValue }) => {
                        if (node.type === Syntax.Code) {
                            return maskValue("_");
                        }
                    }
                });
                const sentenceValue = source.toString();
                const count = countOfComma(sentenceValue);
                if (count > maxComma) {
                    const lastCommandIndex = sentenceValue.lastIndexOf(",");
                    report(node, new RuleError(`This sentence exceeds the maximum count of comma. Maximum is ${maxComma}.`, {
                        padding: locator.at(source.originalIndexFromIndex(lastCommandIndex))
                    }));
                }
            });
        }
    }
}
