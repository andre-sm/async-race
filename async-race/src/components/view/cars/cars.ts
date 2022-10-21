import ElementBuilder from '../element-builder';
import state from '../../state/state';
import { CONSTANTS } from '../../../constants/constants';
import { Car } from '../../../interfaces/car';
import { Animation } from '../../../interfaces/animation';
import CarView from './car';
import requests from '../../../api/requests';

export default class Cars extends ElementBuilder {
  cars?: Car[];
  page?: number;
  totalCars?: number;
  pageElem?: HTMLElement | null;
  animationState?: Animation[];
  carsInstances?: CarView[];
  resetBtn?: HTMLButtonElement;
  raceBtn?: HTMLButtonElement;
  public initialize() {
    state.select('cars').subscribe((cars) => {
      this.cars = cars;
      this.totalCars = state.get('totalCars');
      this.page = state.get('page');
      this.animationState = state.get('animationState');
      this.render();
      this.changePaginationStatus();
    });
    this.resetBtn = document.querySelector('.reset-all-btn') as HTMLButtonElement;
    this.raceBtn = this.element.querySelector('.race-all-btn') as HTMLButtonElement;
  }

  public render() {
    this.carsInstances = this.cars?.map((item) => {
      const distance = this.animationState?.find((el) => el.id === item.id);
      return new CarView(item, distance?.distance as number);
    });

    this.element.innerHTML = `
      <div class="cars__info">
        <h1 class="cars__title">Garage (${this.totalCars})</h1>
        <h2 class="cars__page">Page #${this.page}</h2>
      </div>  
      <div class="cars__garage"></div>
      <div class="cars__pagination">
        <button class="btn disabled prev-btn">Prev</button>
        <button class="btn enabled next-btn">Next</button>
      </div>
    `;

    const carContainer = this.element.querySelector('.cars__garage');
    this.carsInstances?.forEach((item) => {
      carContainer?.append(item.render());
    });

    const prevBtn = this.element.querySelector('.prev-btn') as HTMLButtonElement;
    prevBtn.addEventListener('click', () => this.getPrevPage());

    const nextBtn = this.element.querySelector('.next-btn') as HTMLButtonElement;
    nextBtn.addEventListener('click', () => this.getNextPage());
  }

  public resetAll() {
    this.carsInstances?.forEach((item) => item.resetRace());
  }

  public raceAll() {
    const promises = this.carsInstances?.map((item) => item.startRace(true)) as Promise<void>[];
    Promise.all(promises).then(() => {
      document.body.classList.remove('race');
    });
  }

  private changePaginationStatus() {
    const prevBtn = this.element.querySelector('.prev-btn');
    const nextBtn = this.element.querySelector('.next-btn');

    if ((this.page as number) > 1) {
      prevBtn?.classList.replace('disabled', 'enabled');
    }

    if ((this.page as number) * CONSTANTS.carsPerPage < (this.totalCars as number)) {
      nextBtn?.classList.replace('disabled', 'enabled');
    } else {
      nextBtn?.classList.replace('enabled', 'disabled');
    }
  }

  private getPrevPage() {
    (this.page as number) -= 1;
    state.set({ page: this.page });
    requests.getCars(this.page as number);
    state.set({ animationState: [] });
    state.set({ raceWinner: { time: '', name: '' } });
  }

  private getNextPage() {
    (this.page as number) += 1;
    state.set({ page: this.page });
    requests.getCars(this.page as number);
    state.set({ animationState: [] });
    state.set({ raceWinner: { time: '', name: '' } });
  }
}
