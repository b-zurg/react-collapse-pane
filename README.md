# react-collapse-pane

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

Once installed you can import the `SplitPane` component in your code.  If you're using Typescript the `SplitPaneProps` type is also available.
```ts
import { SplitPane, SplitPaneProps } from "react-collapse-pane";
```

# Usage 🛠

## The Basics ⚙

The only component you must interact with is `SplitPane`.  This serves as a wrapper for the children you wish to layout in a panel form.

Here's a basic example:
```tsx

  <SplitPane
    split="vertical"
  >
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

**Note:** As per default react CSS, a number will be interpreted as a `px` value.


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

Here's an example using a `Button` element made with `styled-components` 

```tsx
<SplitPane
  split="vertical"
  collapseOptions={{
    beforeToggleButton: <Button>⬅</Button>,
    afterToggleButton: <Button>➡</Button>,
    overlayCss: { backgroundColor: 'rgb(0, 0, 0, 0.4)' },
    timeout: 300,
    transition: 'zoom',
    collapseSize: 40,
  }}
>
  <div>This is a div</div>
  <div>This is a second div</div>
  <div>This is a third div</div>
  <div>This is a fourth div</div>
</SplitPane>
```

## State and Controlled Components 🌩

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
* `onCollapse` fires


## RTL Support ( Arabic,Hebrew,Farsi ) 🕋

This library easily supports LTR languages by providing a `direction` prop.  This is only necessary if you're using RTL. 

**Note** 😮 the `direction` is _only_ applicable if the split is `vertical` 

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

Much gratitude to their authors, @NeoRaider and @tomkp 
