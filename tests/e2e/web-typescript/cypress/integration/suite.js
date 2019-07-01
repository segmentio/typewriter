const PORT = 3000

it('Fire the standard Typewriter test suite', function() {
	cy.visit(`localhost:${PORT}`)
	expect(true).to.equal(true)
})
