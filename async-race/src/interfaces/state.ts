import { Car } from './car';
import { Winner } from './winner';
import { RaceWinner } from './race-winner';
import { Animation } from './animation';
import { Input } from './input';
import { Buttons } from './buttons';

export interface AppState {
  cars: Car[];
  selectedCar: Car;
  totalCars: number;
  totalWinners: number;
  mainScreen: string;
  winsOrderType: string;
  timeOrderType: string;
  sortType: string;
  page: number;
  raceWinner: RaceWinner;
  animationState: Animation[];
  winners: Winner[];
  winnersData: Car[];
  winnersPage: number;
  winsSortActive: boolean;
  timeSortActive: boolean;
  isUpdateActive: boolean;
  inputData: Input;
  buttonsState: Buttons;
}
