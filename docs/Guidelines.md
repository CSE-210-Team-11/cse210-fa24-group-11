# Best Practices

Here's a summary of best practices that we have learned so far:
* Branch Management: Never commit code directly to the main branch. Use feature branches and create pull requests for code changes.
* Issue Tracking: Create an issue for each piece of work, even if it covers a broader context than a specific feature. This helps with project documentation and tracking.
* Commit Message Guidelines: Include the corresponding issue number in every commit message to create proper traceability and link commits to specific issues.
* Code Review Responsibility: Reviewers are just as accountable for code quality as the original authors. Conduct thorough, meaningful reviews and don't approve changes without careful 
  examination.
* Test Coverage: Write comprehensive tests for all new functionality or features added in a pull request. Maintaining high test coverage is crucial for code quality and reliability.
* Pull Request Scope: Keep pull requests focused and relatively small. Aim for:
                    - Single responsibility principle: Each PR should address one specific feature, fix, or improvement
                    - Smaller PRs are easier to review, understand, and merge
                    - If a feature requires extensive changes, consider breaking it into smaller, logical chunks
* Commit Management: Use rebasing to maintain a clean and smooth merge process:
                      Regularly rebase your feature branch against the main branch to:
                      -Incorporate the latest changes from main
                      -Resolve potential conflicts early
                      -Ensure a linear and clean project history
