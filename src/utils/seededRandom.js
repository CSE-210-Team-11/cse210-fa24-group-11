// Define the Murmur3Hash function
function MurmurHash3(string) {
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
function Mulberry32(string) {
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
 * 
 * @param {String} seed - The seed to initialize the random function
 * @returns {Function(int?, int?): int} - A function that returns a random integer
 */
export function getSeededRandomInt(seed) {
	return (min = 0, max = 1) =>
		Math.floor(Mulberry32(MurmurHash3(seed)()) * (max - min + 1)) + min;
}

/**
 * 
 * @param {String} seed - The seed to initialize the random function
 * @returns {Function(float?, float?): float} - A function that returns a random float
 */
export function getSeededRandomFloat(seed) {
	return (min = 0, max = 1) =>
		Mulberry32(MurmurHash3(seed)()) * (max - min) + min;
}