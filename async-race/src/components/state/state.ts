import { AppState } from '../../interfaces/state';
import { Store } from './store';

const DEFAULT_STATE: AppState = {
  cars: [],
  selectedCar: {
    id: 0,
    name: '',
    color: '',
  },
  totalCars: 0,
  totalWinners: 0,
  mainScreen: 'garage',
  winsOrderType: 'ASC',
  timeOrderType: 'ASC',
  sortType: 'time',
  page: 1,
  timeSortActive: false,
  winsSortActive: false,
  isUpdateActive: false,
  raceWinner: {
    name: '',
    time: '',
  },
  winners: [],
  winnersData: [],
  winnersPage: 1,
  buttonsState: {
    reset: false,
    race: true,
  },
  animationState: [],
  inputData: {
    createValue: '',
    createColor: '',
    updateValue: '',
    updateColor: '',
  },
};

const state = new Store<AppState>(DEFAULT_STATE);

export default state;
