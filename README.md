# react-collapse-pane

This is intended to be **the** simple, reliable, configurable, and elegant solution to having collapsible panes in your react application. 

<img src="logo.svg" alt="logo" style="width:100%"/>

# Usage

## The Basics

The only component you must interact with is `SplitPane`.  This serves as a wrapper for the children you wish to layout in a panel form.

Here's a basic example:
```tsx
import { SplitPane } from "react-collapse-pane";

...

  <SplitPane
    split="vertical"
  >
    <div>This is the first div</div>
    <div>This is the second div</div>
    <div>This is the third div</div>
    <div>This is the fourth div</div>
  </SplitPane>
```

This will split the children 

Notice that there is no limit to the number of divs you have inside here.  The library will split them all accordingly.

## Styling the Resizer

By default there is a 1px divider that starts out `silver` and transitions to `dimgrey` ([css colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) on hover.


However this is easily replaceable by using the `css` and `hoverCss` options.  You do not have to worry about pseudo selectors, transitions, animations or anything.  You just have to indicate what the divider should look like **before** and **after**.

The sizer also has a grabbable surface that spans the length of the split and has a default grabbable surface of `1rem`. Thsiis changeable by the `grabberSize` option which can be set to any valid CSS size value for `width` or `height`.  

**Note:** As per default react CSS, a number will be interpreted as a `px` value.

This is accomplished by having two separate divs, one of which fades out and the other which fades in.

Here's an example:

```tsx

  const resizerOptions: SplitPaneProps['resizerOptions'] = {
    css: {
      width: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    },
    hoverCss: {
      width: '10px',
      marginLeft: '-10px',
      backgroundImage:
        'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
      backgroundSize: '50px 100%',
      backgroundPosition: '0 50%',
      backgroundRepeat: 'no-repeat',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    },
    grabberSize: '1rem',
  };
  
  ...

  <SplitPane
    split="vertical"
    resizerOptions={resizerOptions}
>
    <div>This is the first div</div>
    <div>This is the second div</div>
  </SplitPane>
```

**Note** the css props must be valid `React.CSSProperties` objects.

## Using a Collapse Button

It's a common UX need to want to collapse the left or initial panel to give more room for another part of a site or app. This is easily accomplished by including several `CollapseOptions` as a prop to the `SplitPane`.

* `beforeToggleButton` - the element displayed as the collapse button **before** the panel is collapsed.  This is a purely aesthetic component.
* `afterToggleButton` - the element displayed as the collapse button **after** the panel is collapsed.  This is a purely aesthetic component.

Here's an example using a `Button` element made with `styled-components` 

```tsx
...

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
      resizerOptions={resizerOptions}
    >
      <div>This is a div</div>
      <div>This is a second div</div>
      <div>This is a third div</div>
      <div>This is a fourth div</div>
    </SplitPane>

```
