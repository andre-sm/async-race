import './sass/style.scss';
import App from './components/app/app';

window.onload = () => {
  const app = new App();
  app.getData();
};
