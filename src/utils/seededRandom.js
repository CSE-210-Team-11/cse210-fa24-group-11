let rand;

/**
 * A hash function based on MurmurHash3's mixing function, developed by bryc
 * @param {string} str - The string to be hashed
 * @returns {() => number} - A function that returns a 32 bit hash value
 */
function xmur3(str) {
	let h = 1779033703 ^ str.length;
	for (let i = 0; i < str.length; i++)
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
	h = (h << 13) | (h >>> 19);
	return () => {
		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return (h ^= h >>> 16) >>> 0;
	};
}

/**
 * A transformation of the fmix32 finalizer from MurmurHash3 into a PRNG
 * @param {number} a - A 32 bit value used as the initial state of the PRNG
 * @returns {() => number} - The random number generator function
 */
function splitmix32(a) {
	return () => {
		a |= 0;
		a = (a + 0x9e3779b9) | 0;
		let t = a ^ (a >>> 16);
		t = Math.imul(t, 0x21f0aaad);
		t = t ^ (t >>> 15);
		t = Math.imul(t, 0x735a2d97);
		return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
	};
}

/**
 * Reseeds the random generator
 * @param {String} seed - The seed for the random function
 */
export function reseed(seed) {
	rand = splitmix32(xmur3(seed)());
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
