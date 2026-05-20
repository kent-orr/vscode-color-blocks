import * as assert from 'assert';
import { resolveEndLine, DocLike, CommentRef } from '../../src/helpers/resolveEndLine';

const docOf = (emptyLines: number[], total: number): DocLike => ({
	lineCount: total,
	lineAt: (n: number) => ({ isEmptyOrWhitespace: emptyLines.includes(n) }),
});

describe('resolveEndLine', () => {
	describe('explicit line count', () => {
		it('returns commentEndLineNumber + nLines', () => {
			assert.strictEqual(resolveEndLine(10, docOf([], 100), { nLines: 4 }), 14);
		});

		it('clamps to last line of document', () => {
			assert.strictEqual(resolveEndLine(18, docOf([], 20), { nLines: 100 }), 19);
		});

		it('takes precedence over matchString if both supplied', () => {
			const commentsAfter: CommentRef[] = [
				{ startLine: 12, content: ' Section 2' },
			];
			assert.strictEqual(
				resolveEndLine(10, docOf([], 100), { nLines: 2, matchString: 'Section 2', commentsAfter }),
				12,
			);
		});
	});

	describe('matchString', () => {
		const commentsAfter: CommentRef[] = [
			{ startLine: 7, content: ' some unrelated text' },
			{ startLine: 15, content: ' Section 2 ----' },
			{ startLine: 30, content: ' Section 3 ----' },
		];

		it('returns line before the next matching comment', () => {
			assert.strictEqual(
				resolveEndLine(5, docOf([], 100), { matchString: 'Section 2', commentsAfter }),
				14,
			);
		});

		it('is case-sensitive (falls back when case differs)', () => {
			const after: CommentRef[] = [{ startLine: 15, content: ' section 2 ----' }];
			// no match -> fallback to until-empty-line at line 8
			assert.strictEqual(
				resolveEndLine(5, docOf([8], 100), { matchString: 'Section 2', commentsAfter: after }),
				7,
			);
		});

		it('ignores comments at or before commentEndLineNumber', () => {
			const after: CommentRef[] = [
				{ startLine: 5, content: ' Section 2 ----' },
				{ startLine: 25, content: ' Section 2 ----' },
			];
			assert.strictEqual(
				resolveEndLine(10, docOf([], 100), { matchString: 'Section 2', commentsAfter: after }),
				24,
			);
		});

		it('falls back to until-empty-line when no later comment matches', () => {
			const after: CommentRef[] = [{ startLine: 20, content: ' nothing relevant' }];
			// empty at line 12 -> nLinesAfterComment = 6, end = 11
			assert.strictEqual(
				resolveEndLine(5, docOf([12], 100), { matchString: 'Section 2', commentsAfter: after }),
				11,
			);
		});

		it('falls back when commentsAfter is empty/undefined', () => {
			assert.strictEqual(
				resolveEndLine(5, docOf([8], 100), { matchString: 'Section 2' }),
				7,
			);
		});

		it('handles matching comment on the very next line', () => {
			const after: CommentRef[] = [{ startLine: 6, content: ' Section 2 ----' }];
			// endLine clamped up to commentEndLineNumber (cannot retreat)
			assert.strictEqual(
				resolveEndLine(5, docOf([], 100), { matchString: 'Section 2', commentsAfter: after }),
				5,
			);
		});

		it('stops at last content line when blank lines precede the matched comment', () => {
			// lines 13 and 14 are blank, matched comment at 15
			const after: CommentRef[] = [{ startLine: 15, content: ' Section 2 ----' }];
			assert.strictEqual(
				resolveEndLine(5, docOf([13, 14], 100), { matchString: 'Section 2', commentsAfter: after }),
				12,
			);
		});
	});

	describe('until-empty-line default', () => {
		it('walks to first empty line', () => {
			assert.strictEqual(resolveEndLine(5, docOf([10], 100), {}), 9);
		});

		it('returns commentEndLineNumber when next line is already empty', () => {
			assert.strictEqual(resolveEndLine(5, docOf([6], 100), {}), 5);
		});

		it('is bound-safe when no empty line exists before EOF', () => {
			assert.strictEqual(resolveEndLine(5, docOf([], 10), {}), 9);
		});
	});
});
