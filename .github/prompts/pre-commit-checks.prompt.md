# Pre-Commit Checks

Use this prompt before making a final commit or declaring a change ready to merge.

Context:

- Follow the repo-wide guide in [.github/copilot-instructions.md](../copilot-instructions.md).
- Apply any matching path-specific instructions from [.github/instructions](../instructions/).

Your job:

1. Inspect the changed files and determine which packages or subsystems were touched.
2. Select the smallest required checks for those changes using the repo-wide and path-specific instructions.
3. Run the checks, fix failures that are in scope, and rerun until they pass or you hit a real blocker.
4. Only say the work is ready for a final commit if the required checks passed, or if you clearly explain why a required check could not be run.
5. Do not skip checks silently. Do not describe work as "done" if tests, lint, typecheck, or build validation still fail.

Expected behavior:

- For package changes, run the relevant package build and test commands.
- For dependency, lockfile, or repo-wide config changes, include the relevant root checks.
- Prefer the smallest sufficient check set first, then broaden only when the change affects shared behavior.

Final response format:

- `Touched areas:` short list
- `Checks run:` exact commands and whether they passed
- `Fixes made while validating:` short list, if any
- `Remaining blockers:` only if something is still failing or could not be run
- `Commit readiness:` `ready` or `not ready`
