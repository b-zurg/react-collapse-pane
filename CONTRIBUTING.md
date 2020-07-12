# Thanks!

It's great that you want to contribute to this library and make things better.

Below you'll find a general outline of how to use TSDX, which handles the boilerplate around managing a react component lib.

# Updating Documentation

All documentation exists in the `./docs` subfolder and is powered by [docsify](https://docsify.js.org/#/quickstart). 

Currently there is only one `README.md` file in the `docs` folder, but this can be expanded into more files if necessary (unlikely).

To run the documentation site install docsify globally: 
```sh
npm i docsify-cli -g
```

Then you can run the following command and open the URL locally for the documentation site. 
```sh
docsify serve docs
```


# Developer User Guide

Let’s get you oriented with what’s here and how to use it.

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)

## Commands

[TSDX](https://github.com/jaredpalmer/tsdx) scaffolds the library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

The recommended workflow is to run [TSDX](https://github.com/jaredpalmer/tsdx) in one terminal:

```
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run either example playground or storybook:

### [Storybook](https://storybook.js.org/)

Run inside another terminal:

```
npm run storybook
```

This loads the stories from `./stories`.

### Example

Then run the example inside another:

```
cd example
npm i
npm start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**, [we use Parcel's aliasing](https://github.com/palmerhq/tsdx/pull/88/files).

To do a one-off build, use `npm run build.

To run tests, use `npm test`.

## Configuration

Static code checking is [set up ](https://github.com/palmerhq/tsdx/pull/45/files) with `prettier`, `eslint`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### [Jest](https://jestjs.io/) Testing

Jest tests are set up to run with `npm test`. This runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.

### Setup Files

This is the folder structure:

```
/example
  index.html
  index.tsx            # test the component here in a demo app
  package.json
  tsconfig.json
/src
  components/           # the source files for the SplitPane and supporting components
  hooks/                # hooks used across components
  types/                # global and other general type definitions
  index.tsx             # the export point for the SplitPane component
/test
  splitpane.test.tsx    # High level tests for the exported copmonent
.gitignore
package.json
README.md 
tsconfig.json
```

### Rollup

TSDX uses [Rollup v1.x](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### Github Actions
A github actions workflow is set up to automatically release changes based on [semantic-release](https://github.com/semantic-release/semantic-release). This is only something to note, but releases and publishes to npm are fully automated based on commmit messages.

### Conventional Commits

This repo follows the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification.

Please use it in your commit messages.


## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations.

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Using the Playground

```
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**!

## Named Exports

[always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

For styling the components we're using a mixture of react's inline styles (for rapidly changing styles) and [styled-components](https://styled-components.com/)