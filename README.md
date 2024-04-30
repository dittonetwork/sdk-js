# @ditto-network js sdk monorepo

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### Commits convention

We use commits convention and linting commits (via git hooks). \
For convince use `npm run commit` for calling interactive cli that allows you to choose appropriate type and scope for commit (list of scopes and types are in `commitlint.config.ts`).

## Feature development process
1. Create new branch from 'master' branch
2. Develop feature
3. Commit changes (don't forget about linting commits)
4. Push changes to remote branch
5. Create pull request to 'master' branch
6. Make sure that all checks are passed
7. Wait for review and approval
8. Publish new version to releases and npm:
   - run locally `npx nx release --dry-run` and check that if everything is ok (versions bumped correctly, changelog looks good).
   - run `./gh-release` script (make sure that you have `GH_TOKEN` in `.env` file). This script will create new release on github and commit new changelog.
   - now you have built packages in `./dist` folder and you are ready for publishing packages. run `npx nx release publish` and follow instructions.
9. Merge pull request to 'master' branch
