import * as seededRandom from "../../tree/seededRandom.js";

describe("Seeded Random Tests", () => {
    beforeEach(() => {
        seededRandom.reseed("test-seed"); // Reseed before each test
    });

    test("randInt should return a random integer between 1 and 10", () => {
        const result = seededRandom.randInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
    });

    test("randInt should return a random integer between 0 and 1", () => {
        const result = seededRandom.randInt(0, 1);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
    });

    test("randFloat should return a random float between 0 and 1", () => {
        const result = seededRandom.randFloat(0, 1);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
    });

    test("reseed should change the output of randInt", () => {
        const firstResult = seededRandom.randInt(1, 10);
        seededRandom.reseed("another-seed");
        const secondResult = seededRandom.randInt(1, 10);
        expect(firstResult).not.toBe(secondResult); // Expect different results
    });

    test("same seed should have the same output of randInt", () => {
        seededRandom.reseed("seed");
        const firstResult = seededRandom.randInt(1, 10);
        seededRandom.reseed("seed");
        const secondResult = seededRandom.randInt(1, 10);
        expect(firstResult).toBe(secondResult); // Expect same results
    });

    test("same seed should have the same output of randFloat", () => {
        seededRandom.reseed("another-seed");
        const firstResult = seededRandom.randFloat(1, 10);
        seededRandom.reseed("another-seed");
        const secondResult = seededRandom.randFloat(1, 10);
        expect(Math.abs(firstResult - secondResult)).toBeLessThan(1e-6); // Expect same results
    });

    // Test MurmurHash3
    test("MurmurHash3 should produce consistent hash for the same input", () => {
        const input = "test-string";
        const hash1 = seededRandom.MurmurHash3(input)();
        const hash2 = seededRandom.MurmurHash3(input)();
        expect(hash1).toBe(hash2); // Expect same hash for the same input
    });

    test("MurmurHash3 should produce different hashes for different inputs", () => {
        const hash1 = seededRandom.MurmurHash3("input1")();
        const hash2 = seededRandom.MurmurHash3("input2")();
        expect(hash1).not.toBe(hash2); // Expect different hashes for different inputs
    });

    // Test Mulberry32
    test("Mulberry32 should produce consistent output for the same input", () => {
        const input = 12345; // Example input
        const randomFunc1 = seededRandom.Mulberry32(input);
        const randomFunc2 = seededRandom.Mulberry32(input);
        expect(randomFunc1()).toBe(randomFunc2()); // Expect same output for the same input
    });

    test("Mulberry32 should produce different outputs for different inputs", () => {
        const randomFunc1 = seededRandom.Mulberry32(12345);
        const randomFunc2 = seededRandom.Mulberry32(67890);
        expect(randomFunc1()).not.toBe(randomFunc2()); // Expect different outputs for different inputs
    });

    // Additional Tests for Edge Cases
    test("MurmurHash3 should handle empty string", () => {
        const hash = seededRandom.MurmurHash3("")();
        expect(hash).toBeDefined(); // Ensure it produces a hash
    });

    test("MurmurHash3 should handle long strings", () => {
        const longString = "a".repeat(1000); // A long string of 'a's
        const hash = seededRandom.MurmurHash3(longString)();
        expect(hash).toBeDefined(); // Ensure it produces a hash
    });

    test("MurmurHash3 should produce different hashes for different character sets", () => {
        const hash1 = seededRandom.MurmurHash3("abc")();
        const hash2 = seededRandom.MurmurHash3("123")();
        expect(hash1).not.toBe(hash2); // Expect different hashes
    });

    test("Mulberry32 should handle different numeric inputs", () => {
        const randomFunc1 = seededRandom.Mulberry32(0);
        const randomFunc2 = seededRandom.Mulberry32(1);
        expect(randomFunc1()).not.toBe(randomFunc2()); // Expect different outputs
    });
});
