---
# These are optional metadata elements. Feel free to remove any of them.
status: proposed
date: 2024-11-11
decision-makers: Delaware, Kanaad
consulted: Dylan
informed: Yuke, Atishay, Shaobo, Leonard, Daniel
---

# Test Framework Usage

## Context and Problem Statement

We are looking to select a JavaScript testing framework to be used in the project. We need a framework that is reliable, well-maintained and integrates with our Github Actions workflow. 

## Decision Drivers

* Quick setup and minimal configurations.
* Easy integration with Github Actions.
* Good documentation and open-source community support.
* Ability to generate coverage reports.
* Familiar syntax for team members.
* Ease of use for graders who need to make and test changes quickly.

## Considered Options

* [Mocha](https://mochajs.org) - A simple, feature rich Node.js testing framework
* [Jest](https://jestjs.io/) - A delightful JavaScript Testing Framework with a focus on simplicity.
* [Jasmine](https://jasmine.github.io/) - Simple JavaScript Testing
* [Cypress](https://www.cypress.io/) - Test. Automate. Accelerate.
* [Tape](https://www.npmjs.com/package/tape) - Producing test harness for node and browsers.
* [Ava](https://github.com/avajs/ava) - Node.js test runner that lets you develop with confidence.

## Decision Outcome

Chosen option: "Jest", because it provides an all-in-one solution with built-in assertion library, mocking capabilities, and coverage reporting while being well-documented and easy to set up in CI/CD pipelines.

### Consequences
{Blah blah}

### Confirmation

{Blah blah}

## Pros and Cons of the Options

### Jest
* Good, because it's an all-in-one solution (includes a test runner, assertion library, & a mocking framework).
* Good, because it has excellent documentation and community support.
* Good, because it has built-in code coverage reporting.
* Good, because it requires minimal configuration.
* Good, because it has watch mode for development.
* Good, because it's widely used in the industry.
* Neutral, because it might be more than we need for simple tests.

### Mocha
* Good, because it's very flexible.
* Good, because it has a large plugin ecosystem.
* Bad, because it requires more setup and configuration.
* Bad, because it needs additional libraries for features Jest includes out of the box.
* Bad, because it requires separate libraries for different testing needs.

### Jasmine
* Good, because it's stable and mature
* Good, because it has a similar syntax to Jest
* Neutral, because Jest is built on top of Jasmine's testing style
* Bad, because it has fewer features out of the box compared to Jest
* Bad, because it would be redundant with Jest since they serve similar purposes

### AVA
* Good, because it runs tests concurrently by default, making test suites faster
* Good, because it has built-in support for async/await without configuration
* Good, because it has a clean, minimal API
* Good, because it isolates each test file in its own Node.js process, preventing shared state
* Good, because it includes TypeScript support out of the box
* Bad, because parallel test execution can make debugging more difficult
* Bad, because it has a smaller ecosystem compared to Jest or Mocha
* Bad, because the isolated process per test file means higher memory usage
* Bad, because its unique syntax might be unfamiliar to developers used to Jest/Mocha style
* Bad, because snapshot testing requires additional setup unlike Jest

### Tape
* Good, because it's extremely lightweight and has minimal overhead
* Good, because it follows Unix philosophy of doing one thing well
* Good, because it produces TAP output that can be consumed by other tools
* Good, because it has no configuration required to start using
* Good, because it's highly portable and can run in many environments
* Bad, because it lacks built-in watch mode
* Bad, because it requires additional modules for features that come built into Jest
* Bad, because it has no built-in assertion planning
* Bad, because its minimal nature means more setup for advanced features
* Bad, because it lacks built-in code coverage reporting

## More Information

Jest was originally considered alongside other frameworks but proved to be the most straightforward to implement. Initial setup was successful with minimal configuration, and test execution in our GitHub Actions pipeline worked immediately.

For our current needs, Jest's built-in assertion library and coverage reporting mean we don't need to install and configure additional packages. This simplicity will be particularly beneficial for graders who need to make and verify changes quickly.

We should revisit this decision if we find we need more sophisticated end-to-end testing capabilities in the future, at which point we might consider adding Cypress or another E2E testing tool alongside Jest.
