import { severListener } from './main';

void severListener().then((app) => {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => void app.close());
  }
});
