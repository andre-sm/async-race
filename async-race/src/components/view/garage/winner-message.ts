import ElementBuilder from '../element-builder';
import { RaceWinner } from '../../../interfaces/race-winner';
import state from '../../state/state';

class WinnerMessage extends ElementBuilder {
  raceWinner?: RaceWinner;

  public initialize() {
    state.select('raceWinner').subscribe((raceWinner) => {
      this.raceWinner = raceWinner;
      this.render();
    });
  }

  public render() {
    this.element.innerHTML = `
    <div class="winner-message__name-wrapper">
      <span class="winner-message__title">Race Winner:</span>
      <span class="winner-message__name">${this.raceWinner?.name}</span>
    </div>
    <div class="winner-message__time-wrapper">
      <span class="winner-message__time">Time:</span>
      <span class="winner-message__race-time">${this.raceWinner?.time}</span>
    </div>
    <span class="line-one"></span>
    <span class="line-two"></span>
    <span class="line-three"></span>
    <span class="line-four"></span>
    `;
  }
}

export default WinnerMessage;
