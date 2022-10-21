import ElementBuilder from '../element-builder';
import state from '../../state/state';
import requests from '../../../api/requests';

class Header extends ElementBuilder {
  public initialize() {
    this.render();
  }

  public render() {
    this.element.innerHTML = `
      <div class="header">
        <div class="container header__wrapper">
          <a href="./" class="header__logo">Async Race</a>
          <div class="header__links">
            <span class="garage-link active">Garage</span>
            <span class="winners-link">Winners</span>
          </div>  
        </div>
      </div>
    `;

    const garageLink = this.element.querySelector('.garage-link') as HTMLButtonElement;
    garageLink.addEventListener('click', (e) => this.setGarageToMain(e));

    const winnersLink = this.element.querySelector('.winners-link') as HTMLButtonElement;
    winnersLink.addEventListener('click', (e) => this.setWinnersToMain(e));
  }

  private setGarageToMain(e: Event) {
    const target = e.target as HTMLElement;
    target.classList.add('active');
    const winnersLink = target.nextElementSibling;
    winnersLink?.classList.remove('active');

    state.set({ mainScreen: 'garage' });
  }

  private setWinnersToMain(e: Event) {
    const target = e.target as HTMLElement;
    target.classList.add('active');
    const garageLink = target.previousElementSibling;
    garageLink?.classList.remove('active');

    const winnersPage = state.get('winnersPage');
    const sortType = state.get('sortType');
    const winsSortActive = state.get('winsSortActive');
    const timeSortActive = state.get('timeSortActive');
    const orderType = winsSortActive ? state.get('winsOrderType') : timeSortActive ? state.get('timeOrderType') : 'ASC';
    requests.getWinners(winnersPage, sortType, orderType);

    state.set({ mainScreen: 'winners' });
  }
}

export default Header;
