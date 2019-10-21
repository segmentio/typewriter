import { Namer } from '../src/generators/namer'
import { camelCase } from 'lodash'

describe('Namer', () => {
	let namer: Namer

	function resetNamer() {
		namer = new Namer({
			reservedWords: ['do', 'if', 'then', 'for', 'let', 'new'],
			quoteChar: "'",
			allowedIdentifierStartingChars: 'A-Za-z_$',
			allowedIdentifierChars: 'A-Za-z0-9_$',
		})
	}

	resetNamer()

	describe('escapeString', () => {
		test("doesn't change valid strings", () => {
			expect(namer.escapeString('is it happening?')).toEqual('is it happening?')
		})
		test('handles a single quote to be escaped', () => {
			expect(namer.escapeString("it's happening!!")).toEqual("it\\'s happening!!")
		})
		test('handles escaping multiple quotes', () => {
			expect(namer.escapeString("it's testing time, Finn's dog said")).toEqual(
				"it\\'s testing time, Finn\\'s dog said"
			)
		})
	})

	describe('register', () => {
		beforeEach(resetNamer)

		test("doesn't change names in single-cardinality namespaces", () => {
			expect(namer.register('test123', 'example')).toEqual('test123')
			expect(namer.register('abcABC123_$', 'another example')).toEqual('abcABC123_$')
		})
		test('sanitizes names with special chars', () => {
			expect(namer.register('~!@#%^&*()_$+', 'example')).toEqual('___________$_')
			expect(namer.register('testing with whitespace', 'example')).toEqual(
				'testing_with_whitespace'
			)
		})
		test('sanitizes names with reserved words', () => {
			expect(namer.register('if', 'example')).toEqual('if_')
			expect(namer.register('ifthen', 'example')).toEqual('ifthen')
		})
		test('handles name collisions in the same namespace', () => {
			expect(namer.register('order-completed', 'example')).toEqual('order_completed')
			expect(namer.register('order-completed', 'example')).toEqual('order_completed1')
			expect(namer.register('order_completed', 'example')).toEqual('order_completed2')
			expect(namer.register('order-completed', 'another example')).toEqual('order_completed')
		})
		test('handles name collisions with a transform', () => {
			expect(namer.register('order-completed', 'example', { transform: camelCase })).toEqual(
				'orderCompleted'
			)
			expect(namer.register('order_completed', 'example', { transform: camelCase })).toEqual(
				'orderCompleted1'
			)
			expect(namer.register('order=completed', 'example')).toEqual('order_completed')
		})
		test('handles resolving collision using prefixes', () => {
			expect(
				namer.register('order-completed', 'example', {
					prefixes: ['FooBar'],
				})
			).toEqual('order_completed')
			expect(
				namer.register('order_completed', 'example', {
					prefixes: ['FooBar'],
				})
			).toEqual('FooBar_order_completed')
			expect(
				namer.register('order completed', 'example', {
					prefixes: ['FooBar'],
				})
			).toEqual('order_completed1')
		})
		test('handles transforming prefixes', () => {
			expect(
				namer.register('order-completed', 'example', {
					prefixes: ['FooBar'],
					transform: camelCase,
				})
			).toEqual('orderCompleted')
			expect(
				namer.register('order_completed', 'example', {
					prefixes: ['FooBar'],
					transform: camelCase,
				})
			).toEqual('fooBarOrderCompleted')
		})
		test('handles caching names by id', () => {
			expect(
				namer.register('order-completed', 'example', {
					id: '123',
				})
			).toEqual('order_completed')
			expect(
				namer.register('order-completed', 'example', {
					id: '123',
				})
			).toEqual('order_completed')
			expect(
				namer.register('order-completed', 'example', {
					id: '456',
				})
			).toEqual('order_completed1')
		})
	})
})
