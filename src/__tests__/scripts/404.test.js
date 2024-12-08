const { binft, helpers, animation } = require('../../scripts/404');

describe('binft Function Comprehensive Tests', () => {
    let container;
    let originalSetTimeout;
    let setTimeoutMock;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'binft';
        document.body.appendChild(container);

        originalSetTimeout = global.setTimeout;
        setTimeoutMock = jest.fn((callback) => callback());
        global.setTimeout = setTimeoutMock;
    });

    afterEach(() => {
        // Cleanup
        document.body.removeChild(container);
        global.setTimeout = originalSetTimeout;
    });

    test('Initializes correctly and modifies DOM', () => {
        expect(typeof binft).toBe('function');

        binft(container);

        expect(container.textContent.length).toBeGreaterThan(0);
        expect(container.querySelectorAll('span').length).toBeGreaterThan(0);
    });

    test('Handles different text directions', () => {
        const originalAnimation = { ...animation.c };
        
        binft(container);

        expect(['forward', 'backward']).toContain(animation.c.direction);
    });

    test('Handles prefix text and skill text', () => {
        binft(container);

        const animationState = animation.c;
        
        expect(animationState.prefixP).toBeGreaterThanOrEqual(-5);
        expect(animationState.skillI).toBeDefined();
        expect(animationState.skillP).toBeDefined();
    });
});

describe('Helper Function Comprehensive Tests', () => {
    test('Random color generator (t) returns a valid RGB value', () => {
        const color = helpers.t();
        const rgbParts = color.match(/\d+/g).map(Number);
        
        expect(color).toMatch(/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/);
        expect(rgbParts.length).toBe(3);
        rgbParts.forEach(part => {
            expect(part).toBeGreaterThanOrEqual(0);
            expect(part).toBeLessThanOrEqual(255);
        });
    });

    test('Random character generator (e) returns a valid ASCII character', () => {
        const char = helpers.e();
        const charCode = char.charCodeAt(0);
        
        expect(char).toMatch(/^[\x21-\x7e]$/); // Printable ASCII
        expect(charCode).toBeGreaterThanOrEqual(33);
        expect(charCode).toBeLessThanOrEqual(126);
    });

    test('Fragment generator (n) creates a document fragment with styled spans', () => {
        const fragmentSize = 10;
        const fragment = helpers.n(fragmentSize);
        
        expect(fragment.childNodes.length).toBe(fragmentSize);
        fragment.childNodes.forEach(node => {
            expect(node.tagName).toBe('SPAN');
            expect(node.textContent).toMatch(/^[\x21-\x7e]$/);
        });
    });
});

describe('Module Export Tests', () => {
    test('Checks module exports when in Node.js environment', () => {
        const originalModule = global.module;
        global.module = { exports: {} };

        const moduleExports = require('../../scripts/404');

        expect(moduleExports.binft).toBeDefined();
        expect(moduleExports.helpers).toBeDefined();
        expect(moduleExports.animation).toBeDefined();

        global.module = originalModule;
    });

    test('Handles various animation configuration values', () => {
        const { animation } = require('../../scripts/404');

        expect(animation.i).toBe(1);
        expect(animation.c).toBe(1);
        expect(animation.l).toBe(1);
    });
});