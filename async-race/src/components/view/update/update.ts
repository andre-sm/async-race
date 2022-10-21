import ElementBuilder from '../element-builder';
import state from '../../state/state';
import requests from '../../../api/requests';
import { CONSTANTS } from '../../../constants/constants';
import { Car } from '../../../interfaces/car';

class UpdateCar extends ElementBuilder {
  brand?: string;
  color?: string;
  sectionName?: string;
  selectedCar?: Car;

  public initialize() {
    state.select('selectedCar').subscribe((selectedCar) => {
      this.selectedCar = selectedCar;
      this.render();
    });
  }

  public render() {
    this.element.innerHTML = `
      <input type="text" class="update-brand-input" list="cars" value="${
        this.selectedCar?.id ? this.selectedCar?.name : ''
      }"/>
      <datalist id="cars">
        <option>Volvo</option>
        <option>Ford</option>
        <option>Audi</option>
        <option>BMW</option>
        <option>Renault</option>
        <option>Mazda</option>
      </datalist>
      <div class="manage-cars__color">
        <label for="update-color">Select color:</label>
        <input type="color" class="update-color-input" id="update-color" name="color" value="${
          this.selectedCar?.id ? this.selectedCar?.color : '#dadada'
        }">
      </div>
      <button class="btn update-btn">Update car</button>
    `;

    const updateBrandInput = this.element.querySelector('.update-brand-input') as HTMLInputElement;
    updateBrandInput.addEventListener('input', (e: Event) => this.updateBrandName(e));

    const updateColorInput = this.element.querySelector('.update-color-input') as HTMLInputElement;
    updateColorInput.addEventListener('input', (e: Event) => this.getColor(e));

    const updateCarBtn = this.element.querySelector('.update-btn') as HTMLButtonElement;
    updateCarBtn.addEventListener('click', (e: Event) => this.updateCar(e));
  }

  private updateBrandName(e: Event) {
    const target = e.target as HTMLInputElement;
    this.brand = target.value;
  }

  private getColor(e: Event) {
    const target = e.target as HTMLInputElement;
    this.color = target.value;
  }

  private updateCar(e: Event) {
    e.preventDefault();
    const carData: Partial<Car> = {
      name: (this.brand || this.selectedCar?.name) as string,
      color: (this.color || this.selectedCar?.color) as string,
    };
    requests.updateCar(carData, this.selectedCar?.id as number);
    state.set({ selectedCar: CONSTANTS.selectedCar });
    state.set({ isUpdateActive: false });
  }
}

export default UpdateCar;
