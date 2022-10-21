import { getCarIcon } from './car-icon';
import { Car } from '../../../interfaces/car';
import { Animation } from '../../../interfaces/animation';
import state from '../../state/state';
import requests from '../../../api/requests';
import { showModal } from '../garage/winner-modal';
import { EngineData } from '../../../interfaces/engine-data';

class CarView {
  car: Car;
  distance?: number;
  element: HTMLElement;
  page?: number;
  startRaceBtn?: HTMLButtonElement;
  resetRaceBtn?: HTMLButtonElement;
  carsAnimationData: { animationId: number | null; distance: number };
  constructor(car: Car, distance: number) {
    this.car = car;
    this.distance = distance;
    this.element = document.createElement('div');
    this.element.setAttribute('data-id', `${this.car.id}`);
    this.element.classList.add('car');
    this.page = state.get('page');
    this.carsAnimationData = { animationId: null, distance: 0 };
    this.startRaceBtn;
    this.resetRaceBtn;
  }

  public render() {
    this.element.innerHTML = `
          <h3 class="car__name">${this.car.name}</h3>
          <div class="car__race">
            <div class="car__race-btns">
              <button class="btn ${this.distance ? 'disabled' : 'enabled'} start-race-btn">Go!</button>
              <button class="btn ${this.distance ? 'enabled' : 'disabled'} reset-race-btn">Reset</button>
              <button class="btn select-btn">Select</button>
              <button class="btn delete-btn">Remove</button>
            </div>
            <div class="car__road">
              <i class="car-icon" id="${this.car.id}" style="transform: translateX(${
      this.distance ? this.distance : 0
    }px)">
                ${getCarIcon(this.car.color)}
              </i>
              <div class="car__finish"></div>
            </div>
          </div>
    `;

    const deleteBtn = this.element.querySelector('.delete-btn') as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => this.deleteCar());

    const selectBtn = this.element.querySelector('.select-btn') as HTMLButtonElement;
    selectBtn.addEventListener('click', () => this.selectCar());

    this.startRaceBtn = this.element.querySelector('.start-race-btn') as HTMLButtonElement;
    this.startRaceBtn.addEventListener('click', () => this.startRace());

    this.resetRaceBtn = this.element.querySelector('.reset-race-btn') as HTMLButtonElement;
    this.resetRaceBtn.addEventListener('click', () => this.resetRace());

    return this.element;
  }

  private deleteCar() {
    requests.deleteCar(this.car.id).then(() => requests.getCars(this.page as number));
    requests.deleteWinner(this.car.id);
  }

  private selectCar() {
    const stateCars = state.get('cars');
    const currentCarData = stateCars.filter((car) => car.id === this.car.id)[0];
    state.set({ selectedCar: { ...currentCarData } });
    state.set({ isUpdateActive: true });
  }

  public async startRace(isCompetition = false) {
    const car = document.getElementById(`${this.car.id}`) as HTMLElement;
    const raceDistance = this.getRaceDistance(car);

    this.startRaceBtn?.classList.replace('enabled', 'disabled');
    this.resetRaceBtn?.classList.replace('disabled', 'enabled');

    const carData: EngineData | undefined = await requests.startEngine(this.car.id);
    if (!carData) {
      return;
    }
    const raceTime = Math.round(carData.distance / carData.velocity);

    this.carsAnimationData = this.animateCar(car, raceTime, raceDistance);

    const response = await requests.driveCar(this.car.id);
    if (!response) {
      return;
    }
    const distance = this.carsAnimationData.distance;

    const animationCarState: Animation = { id: this.car.id, distance: Math.round(distance) };
    const animationState = state.get('animationState');
    animationState.push(animationCarState);
    state.set({ animationState: animationState });

    if (!response.success) {
      const currentAnimId = this.carsAnimationData.animationId;
      if (currentAnimId) {
        window.cancelAnimationFrame(currentAnimId);
      }
    } else {
      if (isCompetition && state.get('raceWinner').name === '') {
        state.set({ raceWinner: { time: raceTime.toString(), name: this.car.name } });
        showModal({ time: raceTime.toString(), name: this.car.name });

        const response = await requests.checkWinner(this.car.id);
        if (!response) {
          const newWinner = { id: this.car.id, wins: 1, time: raceTime };
          await requests.createWinner(newWinner);
        } else {
          if (response !== true) {
            const bestTime = raceTime < response.time ? raceTime : response.time;
            await requests.updateWinner({ time: bestTime, wins: response.wins + 1 }, this.car.id);
          }
        }
      }
    }
    return response;
  }

  private getRaceDistance(car: HTMLElement) {
    const finish = document.querySelector('.car__finish') as HTMLElement;
    const carCenter = car.offsetLeft + car.offsetWidth / 2;
    const finishCenter = finish.offsetLeft + finish.offsetWidth / 2;
    return finishCenter - carCenter;
  }

  private animateCar(car: HTMLElement, duration: number, raceDistance: number) {
    let left = 0;
    let start: number | null = null;
    const animationStore: { animationId: number | null; distance: number } = { animationId: null, distance: 0 };

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      left = (raceDistance / duration) * Math.round(timestamp - start);
      car.style.transform = `translateX(${left}px)`;

      if (left < raceDistance) {
        animationStore.animationId = window.requestAnimationFrame(animate);
      }
      animationStore.distance = left;
    }

    animationStore.animationId = window.requestAnimationFrame(animate);
    return animationStore;
  }

  public resetRace() {
    const currentAnimId = this.carsAnimationData.animationId;
    if (currentAnimId) {
      window.cancelAnimationFrame(currentAnimId);
    }
    requests.stopEngine(this.car.id);
    const car = document.getElementById(`${this.car.id}`) as HTMLElement;
    car.style.transform = `translateX(0px)`;

    this.resetRaceBtn?.classList.replace('enabled', 'disabled');
    this.startRaceBtn?.classList.replace('disabled', 'enabled');
  }
}

export default CarView;
