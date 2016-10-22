import Chance from 'chance';
const chance = new Chance();
/*
 * Returns a random string
 * @param {Number} size - Optional length of string, defaults to 5
 * @returns {String} Random string
 */
export default function createId(size = 5) {
    return chance.string({
        length: size,
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    });
}
