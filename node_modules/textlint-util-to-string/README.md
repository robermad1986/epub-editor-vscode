# textlint-util-to-string [![Actions Status: test](https://github.com/textlint/textlint-util-to-string/workflows/test/badge.svg)](https://github.com/textlint/textlint-util-to-string/actions?query=workflow%3A"test")

Convert `Paragraph` Node to plain text with SourceMap.
It means that you can get original position from plain text.

This library is for [textlint](https://github.com/textlint/textlint "textlint") and [textstat](https://github.com/azu/textstat "textstat").

## Installation

    npm install textlint-util-to-string

## Terminology

The concepts `position` and `index` are the same with [TxtAST Interface](https://textlint.github.io/docs/txtnode.html) and [textlint/structured-source](https://github.com/textlint/structured-source).

- `position` is a `{ line, column }` object.
  - The `column` property of `position` is **0-based**.
  - The `line` property of `position` is **1-based**.
- `index` is an offset number.
  - The `index` property is **0-based**.

## API

### `new StringSource(node: TxtParentNode, options?: StringSourceOptions)`

Create new `StringSource` instance for `paragraph` Node.

### `toString(): string`

Get plain text from `Paragraph` Node.

This plain text is concatenated from `value` of all children nodes of `Paragraph` Node.

```ts
import { StringSource } from "textlint-util-to-string";
const report = function (context) {
    const { Syntax, report, RuleError } = context;
    return {
        // "This is **a** `code`."
        [Syntax.Paragraph](node) {
            const source = new StringSource(node);
            const text = source.toString(); // => "This is a code."
        }
    }
};
```

In some cases, you may want to replace some characters in the plain text for avoiding false positives.
You can replace `value` of children nodes by `options.replacer`.

`options.replacer` is a function that takes a `node` and commands like `maskValue` or `emptyValue`.
If you want to modify the `value` of the node, return command function calls.

```ts
// "This is a `code`."
const source = new StringSource(paragraphNode, {
    replacer({ node, maskValue }) {
        if (node.type === Syntax.Code) {
            return maskValue("_"); // code => ____
        }
    }
});
console.log(source.toString()); // => "This is a ____."
```

- `maskValue(character: string)`: mask the `value` of the node with the given `character`.
- `emptyValue()`: replace the `value` of the node with an empty string.

### `originalIndexFromIndex(generatedIndex): number | undefined`

Get original index from generated index value

### `originalPositionFromPosition(position): Position | undefined`

Get original position from generated position

### `originalIndexFromPosition(generatedPosition): number | undefined`

Get original index from generated position

### `originalPositionFromIndex(generatedIndex): Position | undefined`

Get original position from generated index

## Examples

Create plain text from `Paragraph` Node and get original position from plain text.

```js
import assert from "assert";
import { StringSource } from "textlint-util-to-string";
const report = function (context) {
    const { Syntax, report, RuleError } = context;
    return {
        // "This is [Example！？](http://example.com/)"
        [Syntax.Paragraph](node) {
            const source = new StringSource(node);
            const text = source.toString(); // => "This is Example！？"
            // "Example" is located at the index 8 in the plain text
            //  ^
            const index1 = result.indexOf("Example");
            assert.strictEqual(index1, 8);
            // The "Example" is located at the index 9 in the original text
            assert.strictEqual(source.originalIndexFromIndex(index1), 9);
            assert.deepStrictEqual(source.originalPositionFromPosition({
                line: 1,
                column: 8
            }), {
                line: 1,
                column: 9
            });

            // Another example with "！？", which is located at 15 in the plain text
            // and at 16 in the original text
            const index2 = result.indexOf("！？");
            assert.strictEqual(index2, 15);
            assert.strictEqual(source.originalIndexFromIndex(index2), 16);
        }
    }
};
```

### Integration with sentence-splitter

[sentence-splitter](https://github.com/textlint-rule/sentence-splitter) splits a paragraph into sentences.
You can pass the Sentence node to `StringSource` to get the plain text of the sentence.

```ts
import assert from "assert";
import { splitAST, SentenceSplitterSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string";
import type { TextlintRuleModule } from "@textlint/types";
const report: TextlintRuleModule<Options> = function (context) {
    const { Syntax, report, RuleError } = context;
    return {
        // "First sentence. Second sentence."
        [Syntax.Paragraph](node) {
          // { children: [Sentence, WhiteSpace, Sentence] }
          const sentenceRoot = splitAST(node);
          // ["First sentence." node, "Second sentence." node]
          const sentences = sentenceRoot.children.filter((node) => node.type === SentenceSplitterSyntax.Sentence);
          for (const sentence of sentences) {
            const sentenceSource = new StringSource(sentence);
            const sentenceText = sentenceSource.toString();
            console.log(sentenceText);
            const sentenceIndex = sentenceText.indexOf("sentence");
            const originalSentenceIndex = sentenceSource.originalIndexFromIndex(sentenceIndex);
            console.log({ sentenceIndex, originalSentenceIndex });
          }
        }
    }
};
export default report;
```

## Rules that use this library

- [textlint-rule-first-sentence-length: textlint rule that limit maximum length of First sentence of the section.](https://github.com/textlint-rule/textlint-rule-first-sentence-length)
- [textlint-rule-en-max-word-count: textlint rule that specify the maximum word count of a sentence.](https://github.com/textlint-rule/textlint-rule-en-max-word-count)
- [textlint-rule-spellchecker: textlint rule to check spellings with native spellchecker](https://github.com/nodaguti/textlint-rule-spellchecker)


## FAQ

### Why return relative position from rootNode?

```js
const AST = {...}
const rootNode = AST.children[10];
const source = new StringSource(rootNode);
source.originalIndexFor(0); // should be 0
```

To return relative position easy to compute position(We think).

One space has a single absolute position, The other should be relative position.

## Related Libraries

- <https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule#rule-libraries>

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
