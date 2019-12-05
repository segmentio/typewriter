const PORT = 3000
const NUM_TRACK_CALLS = 25

it('Fire the standard Typewriter test suite', function() {
	cy.server()
	cy.route({
		method: 'POST',
		url: 'http://localhost:8765/v1/t',
	}).as('trackCall')

	cy.wait(500)
	cy.visit(`http://localhost:${PORT}`)
	cy.wait(500)

	// Wait for analytics.js requests to finish.
	cy.wait(
		Array(NUM_TRACK_CALLS)
			.fill()
			.map(_ => '@trackCall')
	)

	expect(true).to.equal(true)
})
