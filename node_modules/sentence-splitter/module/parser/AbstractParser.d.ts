import { SourceCode } from "./SourceCode.js";
export declare abstract class AbstractParser {
    /**
     * Return true if the parser allow to next
     * @param source
     */
    abstract test(source: SourceCode): boolean;
    abstract seek(source: SourceCode): void;
}
//# sourceMappingURL=AbstractParser.d.ts.map