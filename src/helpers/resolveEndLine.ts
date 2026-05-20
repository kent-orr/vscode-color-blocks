export interface DocLike {
	readonly lineCount: number;
	lineAt(line: number): { isEmptyOrWhitespace: boolean };
}

export interface CommentRef {
	startLine: number;
	content: string;
}

export interface ResolveEndLineOptions {
	nLines?: number;
	matchString?: string;
	commentsAfter?: ReadonlyArray<CommentRef>;
}

export const resolveEndLine = (
	commentEndLineNumber: number,
	doc: DocLike,
	opts: ResolveEndLineOptions,
): number => {
	const lastLine = doc.lineCount - 1;

	if (opts.nLines !== undefined)
		return Math.min(commentEndLineNumber + opts.nLines, lastLine);

	if (opts.matchString !== undefined) {
		const needle = opts.matchString;
		for (const c of opts.commentsAfter ?? []) {
			if (c.startLine > commentEndLineNumber && c.content.includes(needle))
				return Math.max(commentEndLineNumber, Math.min(c.startLine - 1, lastLine));
		}
	}

	let lineNumber = commentEndLineNumber + 1;
	let nLinesAfterComment = 0;
	while (lineNumber <= lastLine && !doc.lineAt(lineNumber).isEmptyOrWhitespace) {
		nLinesAfterComment++;
		lineNumber++;
	}
	return Math.min(commentEndLineNumber + nLinesAfterComment, lastLine);
};
