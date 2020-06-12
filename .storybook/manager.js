import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: "dark",
    appContentBg: 'white',
    appBorderColor: 'grey',
    barBg: 'white',
    brandTitle: 'react-collapse-pane',
    appBorderColor: 'silver',

  }),
});