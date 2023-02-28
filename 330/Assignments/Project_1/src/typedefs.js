/* 
https://jsdoc.app/index.html
https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
*/

/**
 * @typedef {number[]} baseStatArray  hp, attack, defense, special-attack, special-defense, speed
 *
 * @typedef {Object} pokemonObject
 * @property {number} id
 * @property {string} name
 * @property {string} url - PokeAPI url
 * @property {string} sprite - sprite url
 * @property {string[]} types
 * 
 * @typedef {Object} basicPokemonObject
 * @property {number} id
 * @property {string} name
 * @property {string} url - PokeAPI url
 * 
 * 
 * @typedef {basicPokemonObject[]} basicPokemonArray
 */

/** @type {pokemonArray} */
let pokemon;