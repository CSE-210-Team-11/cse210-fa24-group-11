let rand;

// Define the Murmur3Hash function
export function MurmurHash3(string) {
	let i = 0;
	let hash = 0;
	for (i, hash = 1779033703 ^ string.length; i < string.length; i++) {
		const bitwise_xor_from_character = hash ^ string.charCodeAt(i);
		hash = Math.imul(bitwise_xor_from_character, 3432918353);
		hash = (hash << 13) | (hash >>> 19);
	}
	return () => {
		// Return the hash that you can use as a seed
		hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
		hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
		return (hash ^= hash >>> 16) >>> 0;
	};
}

// Define the Mulberry32 function
export function Mulberry32(string) {
	return () => {
		let for_bit32_mul = (string += 0x6d2b79f5);
		const cast32_one = for_bit32_mul ^ (for_bit32_mul >>> 15);
		const cast32_two = for_bit32_mul | 1;
		for_bit32_mul = Math.imul(cast32_one, cast32_two);
		for_bit32_mul ^=
			for_bit32_mul +
			Math.imul(for_bit32_mul ^ (for_bit32_mul >>> 7), for_bit32_mul | 61);
		return ((for_bit32_mul ^ (for_bit32_mul >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Reseeds the random generator
 * @param {String} seed - The seed for the random function
 */
export function reseed(seed) {
	rand = Mulberry32(MurmurHash3(seed)());
}

/**
 * Returns a random integer between min and max, inclusive
 * @param {number} min - The lower bound, must be an Integer
 * @param {number} max - The upper bound, must be an Integer
 * @returns {number} - A random integer
 */
export function randInt(min = 0, max = 1) {
	return Math.floor(rand() * (max - min + 1)) + min;
}

/**
 * Returns a random float between min and max, inclusive
 * @param {number} min - The lower bound, must be a Float
 * @param {number} max - The upper bound, must be a Float
 * @returns {number} - A random float
 */
export function randFloat(min = 0, max = 1) {
	return rand() * (max - min) + min;
}
