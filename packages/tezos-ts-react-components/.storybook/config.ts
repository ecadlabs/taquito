import { configure, addParameters } from '@storybook/react';
// automatically import all files ending in *.stories.tsx
const req = require.context('../stories', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

import yourTheme from './theme';

addParameters({
  options: {
    theme: yourTheme
  }
});

configure(loadStories, module);
