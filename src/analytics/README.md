# Bootstrapping typewriter

We use `typewriter` for analytics in `typewriter`. Because of that, we store a copy of the generated client in git, to avoid a circular dependency during the build step.

Keep in mind that you don't need to check-in the generated client in your application. Simply include a call to `typewriter build` in your build step to generate all the clients you need.
