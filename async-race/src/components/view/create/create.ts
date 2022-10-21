import ElementBuilder from '../element-builder';
import requests from '../../../api/requests';
import state from '../../state/state';
import { Input } from '../../../interfaces/input';

class CreateCar extends ElementBuilder {
  brand?: string;
  color?: string;
  inputData?: Input;

  public initialize() {
    this.inputData = state.get('inputData');
    this.render();
  }

  public render() {
    this.element.innerHTML = `
      <input type="text" class="create-brand-input" list="cars" value="${
        this.inputData?.createValue ? this.inputData?.createValue : ''
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
        <label for="$create-color">Select color:</label>
        <input type="color" class="create-color-input" name="color" value="${
          this.inputData?.createColor ? this.inputData?.createColor : '#dadada'
        }">
      </div>
      <button class="btn create-btn">Create car</button>
    `;

    const createBrandInput = this.element.querySelector('.create-brand-input') as HTMLInputElement;
    createBrandInput.addEventListener('input', (e: Event) => this.getBrandName(e));

    const createColorInput = this.element.querySelector('.create-color-input') as HTMLInputElement;
    createColorInput.addEventListener('input', (e: Event) => this.getColor(e));

    const createCarBtn = this.element.querySelector('.create-btn') as HTMLButtonElement;
    createCarBtn.addEventListener('click', () => this.createCar());
  }

  private getBrandName(e: Event) {
    const target = e.target as HTMLInputElement;
    this.brand = target.value;

    const inputData = state.get('inputData');
    state.set({
      inputData: { ...inputData, createValue: this.brand || '' },
    });
  }

  private getColor(e: Event) {
    const target = e.target as HTMLInputElement;
    this.color = target.value;

    const inputData = state.get('inputData');
    state.set({
      inputData: { ...inputData, createColor: this.color || '' },
    });
  }

  private async createCar() {
    const carData = { name: this.brand, color: this.color };
    await requests.createCar(carData);
    const page = state.get('page');
    requests.getCars(page);

    const inputData = state.get('inputData');
    state.set({
      inputData: { ...inputData, createValue: '', createColor: '' },
    });
    this.initialize();
  }
}

export default CreateCar;
