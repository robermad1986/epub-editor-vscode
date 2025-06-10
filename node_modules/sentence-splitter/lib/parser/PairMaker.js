"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PairMaker = void 0;
const logger_js_1 = require("../logger.js");
const DEFAULT_PAIR_MARKS = [
    {
        key: "double quote",
        start: `"`,
        end: `"`
    },
    {
        key: "angled bracket",
        start: `[`,
        end: `]`
    },
    {
        key: "round bracket",
        start: `(`,
        end: `)`
    },
    {
        key: "curly brace",
        start: `{`,
        end: `}`
    },
    {
        key: "かぎ括弧",
        start: `「`,
        end: `」`
    },
    {
        key: "丸括弧",
        start: `（`,
        end: `）`
    },
    {
        key: "二重かぎ括弧",
        start: `『`,
        end: `』`
    },
    {
        key: "波括弧",
        start: `｛`,
        end: `｝`
    },
    {
        key: "角括弧",
        start: `［`,
        end: `］`
    },
    {
        key: "重角括弧",
        start: `〚`,
        end: `〛`
    },
    {
        key: "隅付き括弧",
        start: `【`,
        end: `】`
    },
    {
        key: "二重隅付き括弧",
        start: `《`,
        end: `》`
    }
];
/**
 * Mark pair character
 * PairMarker aim to mark pair string as a single sentence.
 *
 * For example, Following sentence has two period(。). but it should treat a single sentence
 *
 * > I hear "I'm back to home." from radio.
 *
 */
class PairMaker {
    PAIR_MARKS_KEY_Map = new Map(DEFAULT_PAIR_MARKS.flatMap((mark) => {
        return [
            [mark.start, mark],
            [mark.end, mark]
        ];
    }));
    mark(sourceCode) {
        const string = sourceCode.read();
        if (!string) {
            return;
        }
        const pairMark = this.PAIR_MARKS_KEY_Map.get(string);
        if (!pairMark) {
            return;
        }
        // if current is in a context, should not start other context.
        // PairMaker does not support nest context by design.
        if (!sourceCode.isInContext(pairMark)) {
            const isStart = pairMark.start === string;
            if (isStart) {
                (0, logger_js_1.debugLog)(`PairMaker -> enterContext: ${string} `);
                sourceCode.enterContext(pairMark);
            }
        }
        else {
            const isEnd = pairMark.end === string;
            // check that string is end mark?
            if (isEnd) {
                (0, logger_js_1.debugLog)(`PairMaker -> leaveContext: ${string} `);
                sourceCode.leaveContext(pairMark);
            }
        }
    }
}
exports.PairMaker = PairMaker;
//# sourceMappingURL=PairMaker.js.map