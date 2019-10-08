const PORT = 3000
const NUM_TRACK_CALLS = 21

it('Fire the standard Typewriter test suite', function() {
	cy.server()
	cy.route({
		method: 'POST',
		url: 'http://localhost:8765/v1/t',
	}).as('trackCall')

	cy.visit(`http://localhost:${PORT}`)

	// Wait for analytics.js requests to finish.
	for (let i = 0; i < NUM_TRACK_CALLS; i++) {
		cy.wait('@trackCall')
	}

	expect(true).to.equal(true)
})
