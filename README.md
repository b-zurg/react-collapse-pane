# react-collapse-pane

This is intended to be a simple, reliable, configurable, and elegant solution to having collapsible panes in your react application. 

![Logo](logo.svg)


# Usage

## The Basics

The only component you must interact with is `SplitPane`.  This serves as a wrapper for the children you wish to layout in a panel form.

Here's the most basic way to use it:
```tsx
  <SplitPane
    split="horizontal"
  >
    <div>This is the first div</div>
    <div>This is the second div</div>
  </SplitPane>
```

## Styling the Resizer

By default there is a 1px divider that starts out `silver` and transitions to `dimgrey` ([css colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) on hover.

However this is easily replaceable by using the `resizerCss` and `resizerHoverCss` props.  You do not have to worry about pseudo selectors, transitions, animations or anything.  You just have to indicate what the divider should look like **before** and **after**.

This is accomplished by having two separate divs, one of which fades out and the other which fades in.

Here's an example:

```tsx
  <SplitPane
    split="vertical"
    resizerCss={{
      width: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    }}
    resizerHoverCss={{
      width: '10px',
      marginLeft: '-10px',
      backgroundImage:
        'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
      backgroundSize: '50px 100%',
      backgroundPosition: '0 50%',
      backgroundRepeat: 'no-repeat',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    }}
    grabberSize="1rem"
  >
    <div>This is the first div</div>
    <div>This is the second div</div>
  </SplitPane>
```

**Note** the css props must be valid `React.CSSProperties` objects.

## Using a Collapse Button

It's a common UX need to want to collapse the left or initial panel to give more room for another part of a site or app. This is easily accomplished by including the `collapseButtonDetails` prop.

Here's an example:

