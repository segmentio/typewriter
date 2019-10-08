const PORT = 3000

it('Fire the standard Typewriter test suite', function() {
	cy.visit(`http://localhost:${PORT}`)
	// Wait for analytics.js requests to finish.
	cy.wait(2000)
	expect(true).to.equal(true)
})
