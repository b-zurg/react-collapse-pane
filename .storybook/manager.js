import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';
import { configureActions } from '@storybook/addon-actions';

addons.setConfig({
  theme: create({
    base: "dark",

    appContentBg: 'white',
    appBorderColor: 'silver',
    barBg: 'white',
    appBg: "#3e3e3e",

    textColor: 'rgba(211,211,211,1.9)',
    textInverseColor: 'rgba(211,211,211,1.9)',

    brandTitle: 'react-collapse-pane',
    brandUrl: "https://github.com/b-zurg/react-collapse-pane",
    brandImage: "https://github.com/b-zurg/react-collapse-pane/raw/master/logo.svg?sanitize=true",
  }),
});


configureActions({
  depth: 5,
  limit: 5,
});
