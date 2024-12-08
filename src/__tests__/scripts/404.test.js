const { binft, helpers, animation } = require('../../scripts/404');

// Enable fake timers for the entire test suite
jest.useFakeTimers();

describe('binft Function Tests', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div'); // Mock container
        container.id = 'binft';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container); // Cleanup
    });

    test('Initializes correctly and modifies DOM', () => {
        binft(container); // Pass container to binft

        jest.advanceTimersByTime(1000); // Simulate timers

        expect(container.textContent.length).toBeGreaterThan(0); // Text content added
        expect(container.querySelectorAll('span').length).toBeGreaterThan(0); // Spans added
    });
});

describe('Helper Function Tests', () => {
    test('Random color generator (t) returns a valid RGB value', () => {
        const color = helpers.t();
        expect(color).toMatch(/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/); // Check RGB format
    });

    test('Fragment generator (n) creates a document fragment with spans', () => {
        const fragment = helpers.n(5); // Generate 5 spans
        expect(fragment.childNodes.length).toBe(5); // Ensure 5 children
        fragment.childNodes.forEach((node) => {
            expect(node.tagName).toBe('SPAN'); // Ensure each child is a span
        });
    });
});

describe('Animation Logic Tests', () => {
    let mockElement;

    beforeEach(() => {
        mockElement = document.createElement('div'); // Mock element
        document.body.appendChild(mockElement);
        binft(mockElement); // Initialize `c` and `i`
    });

    afterEach(() => {
        document.body.removeChild(mockElement); // Cleanup
    });

    test('Animation updates the configuration object (c)', () => {
        expect(animation.c).toBeDefined(); // Ensure `c` is defined

        jest.advanceTimersByTime(1000); // Simulate animation time

        expect(animation.c.text.length).toBeGreaterThan(0); // Verify text updates
    });
});