import ElementBuilder from './element-builder';
import Header from './header/header';
import Garage from './garage/garage';
import Winners from './winners/winners';
import Footer from './footer/footer';
import state from '../state/state';

export class AppView extends ElementBuilder {
  header?: Header;
  garage?: Garage;
  footer?: Footer;
  winners?: Winners;
  mainScreen?: string;

  public initialize() {
    this.render();
    this.header = new Header({ selector: '.header' });
    state.select('mainScreen').subscribe((mainScreen) => {
      this.mainScreen = mainScreen;
      this.renderMainScreen();
    });
    this.footer = new Footer({ selector: '.footer' });
  }

  public render() {
    this.element.innerHTML = `
      <div class="header"></div>
      <main class="main"></main>
      <footer class="footer"></footer>
      <div class="message-container"></div>
    `;
  }

  private renderMainScreen() {
    const main = state.get('mainScreen');
    if (main === 'garage') {
      new Garage({ selector: '.main' });
    } else {
      new Winners({ selector: '.main' });
    }
  }
}
