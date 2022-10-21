import ElementBuilder from '../element-builder';
import Cars from '../cars/cars';
import requests from '../../../api/requests';
import { CONSTANTS } from '../../../constants/constants';
import WinnerMessage from './winner-message';
import { Buttons } from '../../../interfaces/buttons';
import CreateCar from '../create/create';
import UpdateCar from '../update/update';
import state from '../../state/state';

class Garage extends ElementBuilder {
  cars?: Cars;
  createCar?: CreateCar;
  updateCar?: UpdateCar;
  isUpdateActive?: boolean;
  winnerMessage?: WinnerMessage;
  resetBtn?: HTMLButtonElement;
  raceBtn?: HTMLButtonElement;
  buttonsState?: Buttons;

  public initialize() {
    this.buttonsState = state.get('buttonsState');
    this.render();
    this.cars = new Cars({ selector: '.cars' });
    this.createCar = new CreateCar({ selector: '.manage-cars__create-car' });
    this.updateCar = new UpdateCar({ selector: '.manage-cars__update-car' });
    this.winnerMessage = new WinnerMessage({ selector: '.winner-message' });
    this.resetBtn;
    this.raceBtn;

    state.select('isUpdateActive').subscribe((isUpdateActive) => {
      this.isUpdateActive = isUpdateActive;
      this.changeSectionStatus();
    });
  }

  public render() {
    this.element.innerHTML = `
      <div class="container main-container">
        <div class="manage-wrapper">
          <section class="manage-cars">
            <div class="manage-cars__create-car"></div>
            <div class="manage-cars__update-car disabled"></div>
            <div class="manage-cars__buttons">
              <button class="btn race-all-btn ${this.buttonsState?.race ? '' : 'disabled'}">Race!</button>
              <button class="btn ${this.buttonsState?.reset ? '' : 'disabled'} reset-all-btn">Reset</button>
              <button class="btn generate-btn">Generate Cars</button>
            </div>
          </section>
          <section class="winner-message"></section>
        </div>
        <div class="cars"></div>
      </div>
    `;

    const generateBtn = this.element.querySelector('.generate-btn') as HTMLButtonElement;
    generateBtn.addEventListener('click', () => this.generateCars());

    this.raceBtn = this.element.querySelector('.race-all-btn') as HTMLButtonElement;
    this.raceBtn.addEventListener('click', () => this.startRace());

    this.resetBtn = this.element.querySelector('.reset-all-btn') as HTMLButtonElement;
    this.resetBtn?.addEventListener('click', () => this.resetCars());
  }

  private async startRace() {
    this.cars?.raceAll();
    document.body.classList.add('race');
    this.raceBtn?.classList.add('disabled');
    this.resetBtn?.classList.remove('disabled');
    state.set({ buttonsState: { race: false, reset: true } });
  }

  private resetCars() {
    this.cars?.resetAll();
    this.resetBtn?.classList.add('disabled');
    this.raceBtn?.classList.remove('disabled');
    state.set({ raceWinner: { time: '', name: '' } });
    state.set({ buttonsState: { race: true, reset: false } });
    state.set({ animationState: [] });
  }

  private changeSectionStatus() {
    const updateSection = this.element.querySelector('.manage-cars__update-car');
    if (this.isUpdateActive) {
      updateSection?.classList.remove('disabled');
    } else {
      updateSection?.classList.add('disabled');
    }
  }

  private async generateCars() {
    const carsData = Array(CONSTANTS.generateCars)
      .fill(null)
      .map(() => {
        return { name: this.getRandonName(), color: this.getRandomColor() };
      });

    const page = state.get('page');

    Promise.all(
      carsData.map(async (item) => {
        await requests.createCar(item);
      })
    ).then(() => requests.getCars(page));
  }

  private getRandonName() {
    const brandIndex = Math.floor(Math.random() * CONSTANTS.brands.length);
    const modelIndex = Math.floor(Math.random() * CONSTANTS.models.length);
    return `${CONSTANTS.brands[brandIndex]} ${CONSTANTS.models[modelIndex]}`;
  }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

export default Garage;
