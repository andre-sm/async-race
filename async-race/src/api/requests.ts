import state from '../components/state/state';
import { queryParams } from '../interfaces/queryParams';
import { CONSTANTS } from '../constants/constants';
import { Car } from '../interfaces/car';
import { EngineData } from '../interfaces/engine-data';
import { Winner } from '../interfaces/winner';

class Requests {
  baseUrl: string;
  path;

  constructor() {
    this.baseUrl = 'http://127.0.0.1:3000';
    this.path = {
      garage: '/garage',
      engine: '/engine',
      winners: '/winners',
    };
  }

  public async getCar(carId: number): Promise<Car | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}${this.path?.garage}/${carId}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async getCars(page: number): Promise<void> {
    try {
      const params: queryParams[] = [
        { key: '_page', value: page },
        { key: '_limit', value: CONSTANTS.carsPerPage },
      ];

      const response = await fetch(`${this.baseUrl}${this.path?.garage}${this.getQueryString(params)}`);
      const data: Car[] = await response.json();
      const totalCars = Number(response.headers.get('X-Total-Count'));
      state.set({ totalCars });
      state.set({ cars: data });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  private getQueryString(queryParams: queryParams[]) {
    return queryParams.length ? `?${queryParams.map((item) => `${item.key}=${item.value}`).join('&')}` : '';
  }

  public async createCar(carData: Partial<Car>): Promise<void> {
    try {
      await fetch(`${this.baseUrl}${this.path?.garage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async deleteCar(carId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}${this.path?.garage}/${carId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async updateCar(carData: Partial<Car>, id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${this.path?.garage}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });
      await response.json();
      const curPage = state.get('page');
      this.getCars(curPage);
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async startEngine(id: number): Promise<EngineData | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}${this.path?.engine}?id=${id}&status=started`, {
        method: 'PATCH',
      });
      return await response.json();
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async stopEngine(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}${this.path?.engine}?id=${id}&status=stopped`, {
        method: 'PATCH',
      });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async driveCar(id: number): Promise<{ success: boolean } | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}${this.path?.engine}?id=${id}&status=drive`, {
        method: 'PATCH',
      });
      return response.ok ? await response.json() : { success: false };
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async getWinners(page: number, sortType: string, orderType = 'ASC'): Promise<void> {
    try {
      const params: queryParams[] = [
        { key: '_page', value: page },
        { key: '_sort', value: sortType },
        { key: '_order', value: orderType },
        { key: '_limit', value: CONSTANTS.winnersPerPage },
      ];

      const response = await fetch(`${this.baseUrl}${this.path?.winners}${this.getQueryString(params)}`);
      const winners = await response.json();
      const totalWinners = Number(response.headers.get('X-Total-Count'));

      const winnersData = await Promise.all(
        winners.map(async (winner: Winner) => {
          return await requests.getCar(winner.id);
        })
      );

      state.set({ totalWinners });
      state.set({ winnersData });
      state.set({ winners });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async checkWinner(id: number): Promise<Winner | boolean | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}${this.path?.winners}/${id}`, {
        method: 'GET',
      });
      return response.ok ? await response.json() : response.ok;
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async createWinner(carData: Winner): Promise<void> {
    try {
      await fetch(`${this.baseUrl}${this.path?.winners}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async updateWinner(carData: Partial<Winner>, id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}${this.path?.winners}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }

  public async deleteWinner(carId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}${this.path?.winners}/${carId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.log('Error', (e as Error).toString());
    }
  }
}

const requests = new Requests();

export default requests;
