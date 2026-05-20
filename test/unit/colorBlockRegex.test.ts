import * as assert from 'assert';
import { colorBlockRegex } from '../../src/helpers/colorBlockRegex';

const exec = (input: string) => {
	colorBlockRegex.lastIndex = 0;
	return colorBlockRegex.exec(input);
};

describe('colorBlockRegex', () => {
	describe('existing forms (regression)', () => {
		const validCases: Array<[string, { color: string; lines?: string }]> = [
			['{#abc,2}', { color: '#abc', lines: '2' }],
			['{#123456,2}', { color: '#123456', lines: '2' }],
			['{color:#123,2}', { color: '#123', lines: '2' }],
			['{color:#123,lines:2}', { color: '#123', lines: '2' }],
			['{#123,lines:2}', { color: '#123', lines: '2' }],
			['{ #123 , 2 }', { color: '#123', lines: '2' }],
			['{ color : #123 , lines : 2 }', { color: '#123', lines: '2' }],
			['{ color : #123 }', { color: '#123' }],
			['{#abc}', { color: '#abc' }],
			['{orangered}', { color: 'orangered' }],
			['{orangered,2}', { color: 'orangered', lines: '2' }],
			['{color:orangered}', { color: 'orangered' }],
			['{color:orangered,2}', { color: 'orangered', lines: '2' }],
		];

		for (const [input, expected] of validCases) {
			it(`parses ${input}`, () => {
				const match = exec(input);
				assert.ok(match, `expected ${input} to match`);
				assert.strictEqual(match!.groups!.color, expected.color);
				assert.strictEqual(match!.groups!.lines, expected.lines);
				assert.strictEqual(match!.groups!.matchString, undefined);
			});
		}

		const invalidCases = [
			'{ lines : 2 }',
			'{,lines:2}',
			'{#abg,2}',
			'{#ab,2}',
		];

		for (const input of invalidCases) {
			it(`rejects ${input}`, () => {
				assert.strictEqual(exec(input), null);
			});
		}
	});

	describe('quoted match-string forms', () => {
		const validCases: Array<[string, { color: string; matchString: string }]> = [
			[`{#abc, 'Section 2'}`, { color: '#abc', matchString: 'Section 2' }],
			[`{#abc,"Section 2"}`, { color: '#abc', matchString: 'Section 2' }],
			[`{ #abc , 'A B C' }`, { color: '#abc', matchString: 'A B C' }],
			[`{#abc, until: 'Section 2'}`, { color: '#abc', matchString: 'Section 2' }],
			[`{#abc, until:"Section 2"}`, { color: '#abc', matchString: 'Section 2' }],
			[`{orangered, 'foo'}`, { color: 'orangered', matchString: 'foo' }],
			[`{#abc, 'a, b: c'}`, { color: '#abc', matchString: 'a, b: c' }],
			[`{#abc, ''}`, { color: '#abc', matchString: '' }],
		];

		for (const [input, expected] of validCases) {
			it(`parses ${input}`, () => {
				const match = exec(input);
				assert.ok(match, `expected ${input} to match`);
				assert.strictEqual(match!.groups!.color, expected.color);
				assert.strictEqual(match!.groups!.matchString, expected.matchString);
				assert.strictEqual(match!.groups!.lines, undefined);
			});
		}

		const invalidCases = [
			`{#abc, 'unterminated}`,
			`{#abc, 4, 'x'}`,
			`{#abc, 'foo', 'bar'}`,
			`{#abc, 'mixed"}`,
		];

		for (const input of invalidCases) {
			it(`rejects ${input}`, () => {
				assert.strictEqual(exec(input), null);
			});
		}
	});
});
