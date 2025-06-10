import type { TxtParagraphNode, TxtParentNode, TxtStrNode, TxtTextNode } from "@textlint/ast-node-types";
import { DefaultOptions as DefaultSentenceSplitterOptions, SeparatorParserOptions } from "./parser/SeparatorParser.js";
import { AbbrMarkerOptions, DefaultOptions as DefaultAbbrMarkerOptions } from "./parser/AbbrMarker.js";
export declare const SentenceSplitterSyntax: {
    readonly WhiteSpace: "WhiteSpace";
    readonly Punctuation: "Punctuation";
    readonly Sentence: "Sentence";
    readonly Str: "Str";
    readonly PairMark: "PairMark";
};
export type SentencePairMarkContext = {
    type: "PairMark";
    range: readonly [startIndex: number, endIndex: number];
    loc: {
        start: {
            line: number;
            column: number;
        };
        end: {
            line: number;
            column: number;
        };
    };
};
export type TxtSentenceNodeChildren = TxtParentNode["children"][number] | TxtWhiteSpaceNode | TxtPunctuationNode | TxtStrNode;
export type TxtSentenceNode = Omit<TxtParentNode, "type" | "children"> & {
    readonly type: "Sentence";
    /**
     * SentenceNode includes some context information
     * - "PairMark": pair mark information
     */
    readonly contexts: SentencePairMarkContext[];
    children: TxtSentenceNodeChildren[];
};
export type TxtWhiteSpaceNode = Omit<TxtTextNode, "type"> & {
    readonly type: "WhiteSpace";
};
export type TxtPunctuationNode = Omit<TxtTextNode, "type"> & {
    readonly type: "Punctuation";
};
export type SentenceSplitterTxtNode = TxtSentenceNode | TxtWhiteSpaceNode | TxtPunctuationNode | TxtStrNode;
export type SentenceSplitterTxtNodeType = (typeof SentenceSplitterSyntax)[keyof typeof SentenceSplitterSyntax];
export type TxtParentNodeWithSentenceNodeContent = TxtParentNode["children"][number] | SentenceSplitterTxtNode;
export type TxtParentNodeWithSentenceNode = Omit<TxtParentNode, "children"> & {
    children: TxtParentNodeWithSentenceNodeContent[];
};
export { DefaultAbbrMarkerOptions, DefaultSentenceSplitterOptions };
export interface splitOptions {
    /**
     * Separator & AbbrMarker options
     */
    SeparatorParser?: SeparatorParserOptions;
    AbbrMarker?: AbbrMarkerOptions;
}
/**
 * split `text` into Sentence nodes
 */
export declare function split(text: string, options?: splitOptions): TxtParentNodeWithSentenceNode["children"];
/**
 * Convert Paragraph Node to Paragraph node that convert children to Sentence node
 * This Node is based on TxtAST.
 * See https://github.com/textlint/textlint/blob/master/docs/txtnode.md
 */
export declare function splitAST(paragraphNode: TxtParagraphNode, options?: splitOptions): TxtParentNodeWithSentenceNode;
//# sourceMappingURL=sentence-splitter.d.ts.map