import config from './config'

export async function init() {
	console.log('TODO: implement init function')

	const cfg = await config.get()
	console.log(cfg)
	/*
  // if config file exists
    // read values, use as defaults
  
  // ask what languages should be generated

  // ask where the clients should be written to
  
  // const token = `get a token`
    // if a token is available in the path
      // ask if they want to use it (show the first N chars, the rest hidden)
      // maybe fetch information on it from the API (who owns it, workspaces it has access to, etc.)
    // if not, ask if a user wants to generate a token
      // if so, ask for an email and password
      // hit the API and fetch a token
      // print out the token with some information on it
      // store the fetched token in TYPEWRITER_TOKEN in the env
    // if not, ask if the user wants to provide a script that will fetch the token
      // if so, take the command and execute it to fetch a TYPEWRITER_TOKEN. If the output isn't a string or 
      // a token isn't added to the env, notify the user that it failed.
  
  // Fetch the Tracking Plans from that workspace (show number of events, name, last updated?, ...)
    // Offer a multi-select of the Tracking Plans, to indicate which to install
  
  // Ask whether you'd like to select events or sync all
    // Select which events to sync: multi-select again
    */
}

export async function generate() {
	console.log('TODO: implement generate')
}

export async function prod() {
	console.log('TODO: implement prod generate')
}

export async function update() {
	console.log('TODO: implement update')
}

export async function token() {
	console.log('TODO: implement token')
}
