# react-collapse-pane

This is intended to be **the** simple, reliable, configurable, and elegant solution to having splittable, draggable and collapsible panes in your React application. 


## [[click for storybook demo]](https://storybook.collapse-pane.zurg.dev/)

# Getting Started 🚀

Install react-collapse-pane:
```sh
npm i --save-dev react-collapse-pane
```
```sh
yarn add --dev react-collapse-pane
```

Once installed you can import the `SplitPane` component.

```ts
import { SplitPane } from "react-collapse-pane";
```

If you're using Typescript the `SplitPaneProps`, and a few other helper types are also available.
```ts
import { SplitPane, SplitPaneProps, ResizerOptions, CollapseOptions, SplitPaneHooks } from "react-collapse-pane";
```
# Usage 👓

## The Basics - Laying Things Out 📘

The only component you use is `SplitPane`.  This is a wrapper for the children you wish to lay out in a panel form.

There is only 1 required prop, `split`,  which can be either `"horizontal"` or `"vertical"`.  This identifies what the orientation of the split panel will be.

Here's a basic example:
```tsx
<SplitPane split="vertical">
  <div>This is the first div</div>
  <div>This is the second div</div>
  <div>This is the third div</div>
  This is the fourth but not a div!
</SplitPane>
```

?> **Note** There is no limit to the number of divs you have as children.  The `SplitPane` will split them all accordingly.

!> The children can be any valid React child, but if a child is `null` it will be excluded from being split or displayed. 

!> You must have **MORE** than one non-null child in the split-pane otherwise it will log an error and simply render the single child.

## Styling the Resizer 💅

By default there is a 1px divider with some basic CSS.

This is replaceable with the `css` and `hoverCss` options.  No need to worry about pseudo selectors, transitions, animations or anything.  You just have to indicate what the divider should look like **before** and **after**. This is accomplished by having two separate divs, one of which fades out and the other which fades in.

!> **Note!** The css props must be valid `React.CSSProperties` objects.

The sizer also has a grabbable surface that spans the height (or length) of the split and has a default grabbable surface of `1rem`. This is changeable by the `grabberSize` option which can be set to any valid CSS size value for `width` or `height`.  

?> As per default React CSS, a number will be interpreted as a `px` value.


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


## Using a Collapse Button 🤹‍♀️

!> This is the killer feature of this library :eyes:

It's a common need to want to collapse the left or initial panel to give more room for another part of a site or app. This is easily accomplished by including several `CollapseOptions` as a prop to the `SplitPane`.

* `beforeToggleButton` - the element displayed as the collapse button **before** the panel is collapsed.  This is an purely aesthetic component.
* `afterToggleButton` - the element displayed as the collapse button **after** the panel is collapsed.  This is an purely aesthetic component.
* `buttonTransition` - the animation applied to the button appear/disappear.  Possible options are `zoom`, `grow`, `fade`, or `none`.  You can try them out in the storybook.  `none` indicates to keep the button always visible.
* `buttonTransitionTimeout` - the time (in millisecons) that the animation for the appear/disappear of the button will take place
* `buttonPositionOffset` - a positive or negative number that will either add or subtract the flex-basis (starting at 100) of an invisible div before or after the button. e.g. 50 would make the "before" 150 and the "after" 50
* `collapseDirection` - `'left' | 'right' | 'up' | 'down'` - this is used to indicate the direction that it should collapse.  By default collapsing happens left and up for the vertical and horizontal splits respectively.  Valid values for a vertical split are `left` or `right` and valid values for a horizontal split are `up` or `down`
* `collapseSize` - the size of the collapsed panel after it has been collapsed
* `collapseTransitionTimeout` - the duration within the collapse animation will take place
* `overlayCss` - the css applied to a div positioned on top of the content.  The overlay div has an initial opacity of zero which transitions to 1 over the course of the collapse.

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

?> **Note!** When collapsing a panel, the `minSize` value is used to freeze the width of the collapsed panel to its minimum size and hides the rest of the content.  This allows for a smooth collapse animation and is something to keep in mind. Until the animation reaches the min size it will shrink the panel as normal. Try it out for yourself!


## Hooks and Saving State ⚡

The component manages its own state while resizing however also allows an initial state as well as callbacks to save state changes.

These callbacks are in the `hooks` prop:
```ts
onDragStarted?: () => void;
onChange?: (sizes: number[]) => void;
onSaveSizes?: (sizes: number[]) => void;
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
* `initialSizes` is the default flex-basis that's given to the panes.  This can be a simple ratio if it's the first time the render will happen and there's no saved sizes.  e.g.  `[1, 2, 1]` would make the second panel twice as big as its siblings.  If you're saving state this should be the saved size value on a second render.
* `minSizes` is either (1) a minimum size that's given to **all** the panes, or (2) an array of minimum sizes that's given to each pane in order.  Any missing sizes in the array will be assumed default.
* `collapsedSizes` an array of nullable numbers. This keeps track of a pane's size before it was collapsed.  If not collapsed it's null. This will determine which panels are collapsed and what to do when they're uncollapsed.

Typically if this is a controlled component you would have state variables for `initialSizes` and `collapsedSizes` and have callbacks on `onSaveSizes` and `onCollapse` that would save the two data points and pass them back into the `SplitPane` on a remount. The `minSizes` would typically never change.


## RTL Support ( Arabic, Hebrew, Farsi ) 🕋

This library easily supports RTL languages by providing a `direction` prop.  This is only necessary if you're using RTL.

**Note!** 🚨 the `direction` is _only_ applicable if the split is `vertical` 

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