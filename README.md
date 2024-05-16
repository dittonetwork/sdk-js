# Ditto Network JS SDK

A JavaScript SDK for interacting with the Ditto Network — we pioneer a Smart Account experience.

> [!WARNING]  
> THESE ARE STILL IN DEVELOPMENT AND CAN BE CHANGED AT ANY TIME.


## Feature Development Process

> We use commit conventions and linting commits (via git hooks). \
  For convenience, use `npm run commit` for an interactive CLI that allows you to choose the appropriate type and scope for commits (list of scopes and types are in `commitlint.config.ts`).

1. Create a new branch from the 'master' branch.
2. Develop the feature.
3. Commit changes (ensure commits follow the convention using `npm run commit`).
4. Push changes to the remote branch.
5. Create a pull request to the 'master' branch.
6. Ensure all checks pass.
7. Wait for review and approval.
8. Merge the pull request to the 'master' branch.


## Release Process

1. Ensure the `master` branch is stable and all tests pass.
2. Run `npm run release` to:
   - Bump the version.
   - Update the changelog.
   - Commit these changes.
   - Tag the commit with the new version.
3. Push the changes and the tag to the remote repository.


### Automated Release Workflow

- A CI/CD pipeline will be triggered by the new tag and will:
  1. Verify all tests pass.
  2. Build the packages.
  3. Publish the packages to npm.
  4. Create a GitHub release using `GH_TOKEN`.


### Post-Release

- Merge any hotfix branches or subsequent feature branches following the same process.
- Ensure the `master` branch remains the source of truth.


## Using the Local NPM Registry with Verdaccio

This project uses Verdaccio to set up a local npm registry for testing packages before publishing them to a public npm registry. This allows you to test your packages in an isolated environment.


### Useful Commands

1. **Start the Local Registry**: Start the Verdaccio server:

    ```sh
    nx run ditto-network:local-registry
    ```

2. **Publish Packages Locally**: Once the Verdaccio server is running, publish your packages to the local registry:

    ```sh
    npm publish --registry http://localhost:4873
    ```
