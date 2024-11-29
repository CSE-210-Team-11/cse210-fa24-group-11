---
status: proposed
date: 2024-11-23
decision-makers: Delaware, Kanaad
consulted: Dylan
informed: Atishay, Shaobo, Leonard, Yuke, Daniel
---

# Selection of Canvas Library for Tree Generation

## Context and Problem Statement

In order to render trees and show streak progress, we must select a canvas library to perform the tree rendering.
This is a key function of the application, so the chosen library should be relatively easy to work with.

## Decision Drivers

* **Performance** - The chosen library should be highly performant, as several instances need to be rendered on the screen at once.
* **Beauty** - The chosen library should look good, and contribute to a modern beautiful aesthetic.
* **Ability to render svg files and textures** - The library must be able to render textures.
* **Support for animation** - Animation is necessary to show the rendered trees growing.
* **Ease of Use** - The application should be simple to use and to create artwork in.

## Considered Options

* HTML5 Canvas - The built-in solution
* [Two.js](https://two.js.org/) - A two-dimensional drawing api geared towards modern web browsers.
* [Three.js](https://threejs.org) - The most powerful solution

## Decision Outcome

Chosen option: "Two.js", because it is straightforward to use and doesn't have a heavy performance impact.

## Pros and Cons of the Options

### HTML Canvas
* Good, because it is a built-in HTML element.
* Good, because it has been around for a long time and has plenty of documentation
* Bad, because it doesn't have as many useful functions and capabilities
* Bad, because scripting for canvas is difficult
* Bad, because tests demonstrated blurry images on some occasions

### Three.js
* Good, because it is jam-packed with graphics features
* Good, it is simple to set up and begin rendering
* Good, because it has a large community and plenty of support
* Good, because it has excellent documentation
* Bad, because it is a complex system that takes time to learn and use
* Bad, because the performance concerns of using three.js outweigh the graphics needs of the application

### Two.js
* Good, because it is oriented toward two-dimensional graphics and animations, which is aligned with our goals
* Good, because it has code examples and documentation
* Good, because it can render to HTML Canvas using the Canvas API
* Neutral, because it has plenty of documentation, but sometimes lacks clarity of examples
* Neutral, because performance on complex tasks is less than ideal. Our task is not necessarily complex.
* Bad, because it struggles to render svg images in canvas mode
* Bad, because it has a small community of users