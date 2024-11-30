import { randFloat, randInt, reseed } from "../../utils/seededRandom.js";

describe("Random Library", () => {
	// Reset the random seed before each test to ensure predictability
	beforeEach(() => {
		reseed("test-seed");
	});

	describe("reseed function", () => {
		it("should set a new seed for random number generation", () => {
			// Seed the generator with a specific seed
			reseed("first-seed");
			const firstResult1 = randFloat();
			const firstResult2 = randFloat();

			// Reseed with the same seed should produce the same sequence
			reseed("first-seed");
			expect(randFloat()).toBeCloseTo(firstResult1);
			expect(randFloat()).toBeCloseTo(firstResult2);

			// Different seed should produce different results
			reseed("second-seed");
			const secondResult = randFloat();
			expect(secondResult).not.toBeCloseTo(firstResult1);
		});
	});

	describe("randInt function", () => {
		it("should generate random integers within the specified range", () => {
			// Test default range (0 to 1)
			const defaultResult = randInt();
			expect(defaultResult).toBeGreaterThanOrEqual(0);
			expect(defaultResult).toBeLessThanOrEqual(1);
			expect(Number.isInteger(defaultResult)).toBe(true);

			// Test custom range
			const min = 10;
			const max = 20;
			const customResult = randInt(min, max);
			expect(customResult).toBeGreaterThanOrEqual(min);
			expect(customResult).toBeLessThanOrEqual(max);
			expect(Number.isInteger(customResult)).toBe(true);
		});

		it("should generate consistent results with the same seed", () => {
			reseed("consistent-seed");
			const result1 = randInt(0, 100);

			reseed("consistent-seed");
			const result2 = randInt(0, 100);

			expect(result1).toBe(result2);
		});
	});

	describe("randFloat function", () => {
		it("should generate random floats within the specified range", () => {
			// Test default range (0 to 1)
			const defaultResult = randFloat();
			expect(defaultResult).toBeGreaterThanOrEqual(0);
			expect(defaultResult).toBeLessThan(1);

			// Test custom range
			const min = 10.5;
			const max = 20.7;
			const customResult = randFloat(min, max);
			expect(customResult).toBeGreaterThanOrEqual(min);
			expect(customResult).toBeLessThan(max);
			expect(Number.isInteger(customResult)).toBe(false);
		});

		it("should generate consistent results with the same seed", () => {
			reseed("consistent-seed");
			const result1 = randFloat(0, 100);

			reseed("consistent-seed");
			const result2 = randFloat(0, 100);

			expect(result1).toBeCloseTo(result2);
		});

		it("should distribute values somewhat uniformly", () => {
			const iterations = 10000;
			const min = 0;
			const max = 1;
			let sum = 0;

			for (let i = 0; i < iterations; i++) {
				sum += randFloat(min, max);
			}

			const average = sum / iterations;
			// The average should be close to the midpoint of the range
			expect(average).toBeCloseTo((min + max) / 2, 1);
		});
	});

	describe("Random Number Generation Properties", () => {
		it("should generate different sequences for different seeds", () => {
			const seeds = ["seed1", "seed2", "seed3"];
			const results = seeds.map((seed) => {
				reseed(seed);
				return randFloat();
			});

			// Ensure all generated numbers are unique
			const uniqueResults = new Set(results);
			expect(uniqueResults.size).toBe(seeds.length);
		});
	});
});
