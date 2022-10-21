import ElementBuilder from '../element-builder';
import { Winner } from '../../../interfaces/winner';
import { Car } from '../../../interfaces/car';
import { getCarIcon } from '../cars/car-icon';
import state from '../../state/state';
import { CONSTANTS } from '../../../constants/constants';
import requests from '../../../api/requests';

export default class Winners extends ElementBuilder {
  winners?: Winner[];
  totalWinners?: number;
  winnersCarData?: Car[];
  page?: number;
  winsOrderType?: string;
  timeOrderType?: string;
  sortType?: string;
  winsSortActive?: boolean;
  timeSortActive?: boolean;
  public initialize() {
    state.select('winners').subscribe((winners) => {
      this.winners = winners;
      this.totalWinners = state.get('totalWinners');
      this.page = state.get('winnersPage');
      this.winnersCarData = state.get('winnersData');
      this.winsOrderType = state.get('winsOrderType');
      this.timeOrderType = state.get('timeOrderType');
      this.sortType = state.get('sortType');
      this.winsSortActive = state.get('winsSortActive');
      this.timeSortActive = state.get('timeSortActive');
      this.render();
      this.changePaginationStatus();
    });
  }

  public render() {
    const winners = this.winners
      ?.map((item, i) => {
        const car = this.winnersCarData?.find((elem) => elem.id === item.id);
        const winner = new WinnerView(item, i + 1, car as Car, this.page as number);
        return winner.render();
      })
      ?.join('');

    this.element.innerHTML = `
    <div class="container main-container">
      <section class="winners">
        <div class="winners__info">
          <h1 class="winners__title">Winners (${this.totalWinners})</h1>
          <h2 class="cars__page">Page ${this.page}</h2>
        </div>
        <div class="winners__table-wrapper">
          <table class="winners__table table">
            <thead class="table__head">
              <tr class="table__row">
                <th class="table__head-cell">№</th>
                <th class="table__head-cell">Car</th>
                <th class="table__head-cell">Name</th>
                <th class="table__head-cell wins-cell ${this.winsSortActive ? 'active' : ''} ${
      this.winsSortActive && this.winsOrderType === 'ASC' ? 'rotate' : ''
    }">
                  <span>Wins</span>
                  <i class="sort-icon"></i>
                </th>
                <th class="table__head-cell time-cell ${this.timeSortActive ? 'active' : ''} ${
      this.timeSortActive && this.timeOrderType === 'ASC' ? 'rotate' : ''
    }">
                  <span>Best time (s)</span>
                  <i class="sort-icon"></i>
                </th>
              </tr>
            </thead>
            <tbody class="table__body">
              ${winners}
            </tbody>
          </table>
        </div>  
        <div class="winners__pagination">
          <button class="btn disabled prev-btn">Prev</button>
          <button class="btn disabled next-btn">Next</button>
        </div>
      </section>
    </div>
    `;

    const prevBtn = this.element.querySelector('.prev-btn') as HTMLButtonElement;
    prevBtn.addEventListener('click', () => this.getPrevPage());

    const nextBtn = this.element.querySelector('.next-btn') as HTMLButtonElement;
    nextBtn.addEventListener('click', () => this.getNextPage());

    const winsCell = this.element.querySelector('.wins-cell') as HTMLElement;
    winsCell.addEventListener('click', () => this.sortByWins());

    const timeCell = this.element.querySelector('.time-cell') as HTMLElement;
    timeCell.addEventListener('click', () => this.sortByTime());
  }

  private sortByWins() {
    state.set({ winsSortActive: true });
    state.set({ timeSortActive: false });
    state.set({ timeOrderType: 'ASC' });

    this.winsOrderType = this.winsOrderType === 'ASC' ? 'DESC' : 'ASC';
    this.sortType = 'wins';
    state.set({ winsOrderType: this.winsOrderType });
    state.set({ sortType: this.sortType });
    requests.getWinners(this.page as number, this.sortType as string, this.winsOrderType as string);
  }

  private sortByTime() {
    state.set({ timeSortActive: true });
    state.set({ winsSortActive: false });
    state.set({ winsOrderType: 'ASC' });

    this.timeOrderType = this.timeOrderType === 'ASC' ? 'DESC' : 'ASC';
    this.sortType = 'time';
    state.set({ timeOrderType: this.timeOrderType });
    state.set({ sortType: this.sortType });
    requests.getWinners(this.page as number, this.sortType as string, this.timeOrderType as string);
  }

  private changePaginationStatus() {
    const prevBtn = this.element.querySelector('.prev-btn');
    const nextBtn = this.element.querySelector('.next-btn');

    if ((this.page as number) > 1) {
      prevBtn?.classList.replace('disabled', 'enabled');
    }

    if ((this.page as number) * CONSTANTS.winnersPerPage < (this.totalWinners as number)) {
      nextBtn?.classList.replace('disabled', 'enabled');
    } else {
      nextBtn?.classList.replace('enabled', 'disabled');
    }
  }

  private getPrevPage() {
    (this.page as number) -= 1;
    state.set({ winnersPage: this.page });
    const orderType = this.winsSortActive ? this.winsOrderType : this.timeOrderType;
    requests.getWinners(this.page as number, this.sortType as string, orderType as string);
  }

  private getNextPage() {
    (this.page as number) += 1;
    state.set({ winnersPage: this.page });
    const orderType = this.winsSortActive ? this.winsOrderType : this.timeOrderType;
    requests.getWinners(this.page as number, this.sortType as string, orderType as string);
  }
}

class WinnerView {
  winner: Winner;
  index: number;
  car: Car;
  page: number;
  constructor(winner: Winner, index: number, car: Car, page: number) {
    this.winner = winner;
    this.index = index;
    this.car = car;
    this.page = page;
  }

  public render() {
    const pageCarCounter = (this.page - 1) * CONSTANTS.winnersPerPage + this.index;
    return `
      <tr class="table__row">
        <td class="table__body-cell">${pageCarCounter}</td>
        <td class="table__body-cell">
          <i class="table__car-icon">${getCarIcon(this.car.color)}</i>
        </td>
        <td class="table__body-cell">${this.car?.name}</td>
        <td class="table__body-cell">${this.winner.wins}</td>
        <td class="table__body-cell">${this.winner.time}</td>
      </tr>
    `;
  }
}
