const { binft, helpers, animation } = require('../../scripts/404');

describe('binft Function Tests', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'binft';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    test('Initializes correctly and modifies DOM', () => {
        expect(typeof binft).toBe('function');

        binft(container);

        expect(container.textContent.length).toBeGreaterThan(0);
        expect(container.querySelectorAll('span').length).toBeGreaterThan(0);
    });
});

describe('Helper Function Tests', () => {
    test('Random color generator (t) returns a valid RGB value', () => {
        const color = helpers.t();
        expect(color).toMatch(/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/);
    });

    test('Random character generator (e) returns a valid ASCII character', () => {
        const char = helpers.e();
        expect(char).toMatch(/^[\x21-\x7e]$/); // Printable ASCII
    });

    test('Fragment generator (n) creates a document fragment with spans', () => {
        const fragment = helpers.n(5);
        expect(fragment.childNodes.length).toBe(5);
        fragment.childNodes.forEach(node => {
            expect(node.tagName).toBe('SPAN');
        });
    });
});

describe('Animation Logic Tests', () => {
    test('Animation initialization (i) updates the configuration object (c)', () => {
        const { c, i } = animation;

        const mockElement = document.createElement('div');
        c.text = '';
        i(mockElement);

        expect(c.text.length).toBeGreaterThan(0);
    });
});