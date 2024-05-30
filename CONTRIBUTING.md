# Contributing to Ditto Network JS SDK

We welcome contributions to the Ditto Network JS SDK! Please follow the process below to contribute.

## Feature Development Process

1. **Create a Branch**: Create a new branch from the `master` branch.
2. **Develop the Feature**: Implement your feature or fix.
3. **Commit Changes**: Ensure commits follow the convention using `npm run commit`.
   - We use commit conventions and linting commits (via git hooks).
   - For convenience, use `npm run commit` for an interactive CLI that allows you to choose the appropriate type and scope for commits (list of scopes and types are in `commitlint.config.ts`).
4. **Push Changes**: Push your changes to the remote branch.
5. **Create a Pull Request**: Open a pull request to the `master` branch.
6. **Pass Checks**: Ensure all checks pass.
7. **Review and Approval**: Wait for review and approval.
8. **Merge**: Once approved, merge the pull request to the `master` branch.

## Release Process

1. **Stabilize Master**: Ensure the `master` branch is stable and all tests pass.
2. **Run Release Script**: Execute `npm run release` to:
   - Bump the version.
   - Update the changelog.
   - Commit these changes.
   - Tag the commit with the new version.
3. **Push Changes**: Push the changes and the tag to the remote repository.

### Automated Release Workflow

- A CI/CD pipeline will be triggered by the new tag and will:
  1. Verify all tests pass.
  2. Build the packages.
  3. Publish the packages to npm.
  4. Create a GitHub release using `GITHUB_TOKEN`.

### Post-Release

- Merge any hotfix branches or subsequent feature branches following the same process.
- Ensure the `master` branch remains the source of truth.

## Using the Local NPM Registry with Verdaccio

This project uses Verdaccio to set up a local npm registry for testing packages before publishing them to a public npm registry. This allows you to test your packages in an isolated environment.

### Useful Commands

1. **Start the Local Registry**: Start the Verdaccio server:

    ```sh
    npm run local-registry
    ```

2. **Publish Packages Locally**: Once the Verdaccio server is running, publish your packages to the local registry:

    ```sh
    npm publish --registry http://localhost:4873
    ```

3. **Use Packages from Local Registry**: Set the npm registry to the local Verdaccio instance to install packages from there:

    ```sh
    npm set registry http://localhost:4873
    ```

4. **Revert to Public Registry**: Revert back to the public npm registry after testing:

    ```sh
    npm set registry https://registry.npmjs.org
    ```
