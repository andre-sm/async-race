import { RaceWinner } from '../../../interfaces/race-winner';

export function showModal(winner: RaceWinner) {
  const element = document.querySelector('.message-container') as HTMLElement;
  element.innerHTML = `
    <div class="winner-message__name-wrapper">
      <span class="winner-message__title">Winner:</span>
      <span class="winner-message__name">${winner.name}</span>
    </div>
    <div class="winner-message__time-wrapper">
      <span class="winner-message__time">Time:</span>
      <span class="winner-message__race-time">${winner.time}</span>
    </div>
  `;

  element.classList.add('show');
  setTimeout(() => {
    element.classList.remove('show');
    element.innerHTML = '';
  }, 2500);
}
