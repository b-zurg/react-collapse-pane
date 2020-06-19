# react-collapse-pane
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This is intended to be **the** simple, reliable, configurable, and elegant solution to having collapsible panes in your react application. 



<a href="https://react-collapse-pane.zurg.dev" target="_blank"><img src="logo.svg" alt="logo" style="width:100%"/></a>


# Getting Started :rocket:

Install react-collapse-pane:
```bash
npm i --save-dev react-collapse-pane
```
```bash
yarn add --dev react-collapse-pane
```

Once installed you can import the `SplitPane` component in your code.

```ts
import { SplitPane } from "react-collapse-pane";
```

If you're using Typescript the `SplitPaneProps`, as well as a few other helper types type is also available.
```ts
import { SplitPane, SplitPaneProps, ResizerOptions, CollapseOptions, SplitPaneHooks } from "react-collapse-pane";
```
# Usage 🛠

## The Basics ⚙

The only component you must interact with is `SplitPane`.  This serves as a wrapper for the children you wish to layout in a panel form.

Here's a basic example:
```tsx
<SplitPane split="vertical">
  <div>This is the first div</div>
  <div>This is the second div</div>
  <div>This is the third div</div>
  This is the fourth but not a div!
</SplitPane>
```

This will split the children.  The children can be any valid react child.  If a child is `null` it will be excluded from being split or displayed.

Notice that there is no limit to the number of divs you have inside here.  The library will split them all accordingly.

## Styling the Resizer 💅

By default there is a 1px divider that starts out `silver` and transitions to `dimgrey` ([css colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) on hover.

However this is easily replaceable by using the `css` and `hoverCss` options.  You do not have to worry about pseudo selectors, transitions, animations or anything.  You just have to indicate what the divider should look like **before** and **after**. This is accomplished by having two separate divs, one of which fades out and the other which fades in.

The sizer also has a grabbable surface that spans the length of the split and has a default grabbable surface of `1rem`. Thsiis changeable by the `grabberSize` option which can be set to any valid CSS size value for `width` or `height`.  

**Note!** 🚨  As per default react CSS, a number will be interpreted as a `px` value.


Here's an example:

```tsx
<SplitPane
  split="vertical"
  resizerOptions={{
    css: {
      width: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    },
    hoverCss: {
      width: '3px',
      background: '1px solid rgba(102, 194, 255, 0.5)',
    },
    grabberSize: '1rem',
  }}
>
  <div>This is the first div</div>
  <div>This is the second div</div>
</SplitPane>
```

**Note** the css props must be valid `React.CSSProperties` objects.

## Using a Collapse Button 🤹‍♀️

It's a common UX need to want to collapse the left or initial panel to give more room for another part of a site or app. This is easily accomplished by including several `CollapseOptions` as a prop to the `SplitPane`.

* `beforeToggleButton` - the element displayed as the collapse button **before** the panel is collapsed.  This is a purely aesthetic component.
* `afterToggleButton` - the element displayed as the collapse button **after** the panel is collapsed.  This is a purely aesthetic component.
* `overlayCss` - the css applied to a div positioned on top of the content.
* `buttonTransition` - the animation applied to the button appear/disappear.  Possible options are `zoom`, `grow`, or `fade`
* `buttonTransitionTimeout` - the time (in millisecons) that the animation for the appear/disappear of the button will take place
* `buttonPositionOffset` - a positive or negative number that will either add or subtract the flex-basis (starting at 100) of an invisible div before or after the button. e.g. 50 would make the "before" 150 and the "after" 50
* `collapseSize` - the size of the collapsed panel after it has been collapsed
* `collapseTransitionTimeout` - the duration within the collapse animation will take place

Here's an example using a `Button` element imported from elsewhere. 

```tsx
<SplitPane
  split="vertical"
  collapseOptions={{
    beforeToggleButton: <Button>⬅</Button>,
    afterToggleButton: <Button>➡</Button>,
    overlayCss: { backgroundColor: "black" },
    buttonTransition: "zoom",
    buttonPositionOffset: -20,
    collapsedSize: 50,
    collapseTransitionTimeout: 350,
  }}
>
  <div>This is a div</div>
  <div>This is a second div</div>
  <div>This is a third div</div>
  <div>This is a fourth div</div>
</SplitPane>
```

## Hooks and Saving State 🌩

The component manages its own state while resizing however also allows an initial state as well as callbacks to save state changes.

These callbacks are in the `hooks` prop:
```ts
onDragStarted?: () => void;
onChange?: (sizes: number[]) => void;
onDragFinished?: (sizes: number[]) => void;
onCollapse?: (collapsedSizes: Nullable<number>[]) => void;
```
* `onDragStarted` fires as soon as you click down on a resizer and begin moving
* `onSaveSizes` fires when the movement of a resizer is finished and the mouse lifts **OR** when a panel is collapsed - as both of these trigger size changes.
* `onChange` fires on every size change, which can be **quite** often
* `onCollapse` fires whenever a panel is collapsed, and keeps track of the previously collapsed panes

The initial state is passed in with these three props:

```ts
initialSizes?: number[];
minSizes?: number | number[];
collapsedSizes?: Nullable<number>[];
```
* `initialSizes` is the default flex-basis that's given to the panes
* `minSizes` is either (1) a minimum size that's given to **all** the panes, or (2) an array of minimum sizes that's given to each pane in order.  Any missing sizes in the array will be assumed default.
* `collapsedSizes` an array of nullable numbers. This keeps track of a pane's size before it was collapsed.  If not collapsed it's null. This will determine which panels are collapsed and what to do when they're uncollapsed.


## RTL Support ( Arabic, Hebrew, Farsi ) 🕋

This library easily supports LTR languages by providing a `direction` prop.  This is only necessary if you're using RTL. 

**Note!** 🚨 the `direction` is _only_ applicable if the split is `vertical` 

e.g.
```tsx
      <div style={{ direction: 'rtl' }}>
        <SplitPane
          split="vertical"
          direction="rtl"
        >
          <div>اللوحة الأولى</div>
          <div>اللوحة الثانية</div>
          <div>اللوحة الثالثة</div>
          <div>اللوحة الرابعة</div>
        </SplitPane>
      </div>
```

# Credit and Attribution 🙏

This project did not start off from scratch.  The foundation of the project was the excellently written [react-multi-split-pane](https://github.com/neoraider/react-multi-split-pane) library which is itself a typescript rewrite of the [react-split-pane](https://github.com/tomkp/react-split-pane) library.  

Much gratitude to their authors, [@NeoRaider](https://github.com/NeoRaider) and [@tomkp](https://github.com/tomkp) 

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://blog.b3k.us"><img src="https://avatars2.githubusercontent.com/u/31712?v=4" width="100px;" alt=""/><br /><sub><b>Benjamin Black</b></sub></a><br /><a href="https://github.com/b-zurg/react-collapse-pane/commits?author=b" title="Tests">⚠️</a> <a href="https://github.com/b-zurg/react-collapse-pane/commits?author=b" title="Documentation">📖</a> <a href="https://github.com/b-zurg/react-collapse-pane/commits?author=b" title="Code">💻</a> <a href="#design-b" title="Design">🎨</a> <a href="#example-b" title="Examples">💡</a> <a href="#platform-b" title="Packaging/porting to new platform">📦</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!