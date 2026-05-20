import * as assert from 'assert';
import { hexToRgb01, rgb01ToHex } from '../../src/helpers/colorHelpers';

describe('hexToRgb01', () => {
    it('converts 6-char hex to 0-1 floats', () => {
        const [r, g, b] = hexToRgb01('#ff0000');
        assert.strictEqual(r, 1);
        assert.strictEqual(g, 0);
        assert.strictEqual(b, 0);
    });

    it('converts 3-char hex by doubling digits', () => {
        const [r, g, b] = hexToRgb01('#fff');
        assert.strictEqual(r, 1);
        assert.strictEqual(g, 1);
        assert.strictEqual(b, 1);
    });

    it('converts 3-char hex #abc consistently with 6-char #aabbcc', () => {
        assert.deepStrictEqual(hexToRgb01('#abc'), hexToRgb01('#aabbcc'));
    });

    it('converts #000000 to all zeros', () => {
        assert.deepStrictEqual(hexToRgb01('#000000'), [0, 0, 0]);
    });
});

describe('rgb01ToHex', () => {
    it('converts 0-1 floats to 6-char lowercase hex', () => {
        assert.strictEqual(rgb01ToHex(1, 0, 0), '#ff0000');
    });

    it('zero-pads single-digit hex channels', () => {
        assert.strictEqual(rgb01ToHex(0, 0, 0), '#000000');
    });

    it('round-trips 6-char hex values', () => {
        const cases = ['#ff4400', '#aabbcc', '#123456', '#ffffff'];
        for (const hex of cases) {
            assert.strictEqual(rgb01ToHex(...hexToRgb01(hex)), hex, `round-trip failed for ${hex}`);
        }
    });

    it('round-trips 3-char hex values (as 6-char output)', () => {
        assert.strictEqual(rgb01ToHex(...hexToRgb01('#abc')), '#aabbcc');
        assert.strictEqual(rgb01ToHex(...hexToRgb01('#fff')), '#ffffff');
    });
});
