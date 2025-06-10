import { SourceCode } from "./SourceCode.js";
import { AbstractMarker } from "./AbstractMarker.js";
/**
 * Mark pair character
 * PairMarker aim to mark pair string as a single sentence.
 *
 * For example, Following sentence has two period(。). but it should treat a single sentence
 *
 * > I hear "I'm back to home." from radio.
 *
 */
export declare class PairMaker implements AbstractMarker {
    private PAIR_MARKS_KEY_Map;
    mark(sourceCode: SourceCode): void;
}
//# sourceMappingURL=PairMaker.d.ts.map