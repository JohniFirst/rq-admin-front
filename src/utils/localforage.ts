import type { ForageKeys } from '@/enums/localforage'
import localforage from 'localforage'

class Forage {
	/**
	 * Retrieves an item from the localforage storage by its key.
	 *
	 * @param {ForageKeys} key - The key of the item to retrieve.
	 * @return {Promise<T>} A promise that resolves to the value of the item.
	 * @throws {Error} If there is an error while retrieving the item.
	 */
	getItem<T>(key: ForageKeys): Promise<T> {
		return new Promise((resolve) => {
			try {
				localforage.getItem(key).then((value) => {
					return resolve(value as T)
				})
			} catch (err) {
				throw new Error(err as string)
			}
		})
	}

	/**
	 * Sets an item in the localforage storage.
	 *
	 * @param {ForageKeys} key - The key of the item to be set.
	 * @param {object | string} value - The value of the item to be set.
	 * @throws {Error} If there is an error while setting the item.
	 */
	setItem(key: ForageKeys, value: object | string) {
		try {
			if (typeof value !== 'string') {
				value = JSON.stringify(value)
			}

			localforage.setItem(key, value)
		} catch (err) {
			throw new Error(err as string)
		}
	}

	/**
	 * Removes an item from the localforage storage.
	 *
	 * @param {ForageKeys} key - The key of the item to be removed.
	 * @throws {Error} If there is an error while removing the item.
	 */
	removeItem(key: ForageKeys) {
		try {
			localforage.removeItem(key)
		} catch (err) {
			throw new Error(err as string)
		}
	}

	/**
	 * Clears all items from the local storage.
	 *
	 * @throws {Error} If an error occurs while clearing the local storage.
	 */
	clear() {
		try {
			localforage.clear()
		} catch (err) {
			throw new Error(err as string)
		}
	}
}

export const forage = new Forage()
