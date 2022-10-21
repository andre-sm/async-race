import { AppView } from '../view/appView';
import requests from '../../api/requests';
import state from '../state/state';

class App {
  view: AppView;

  constructor() {
    this.view = new AppView({ selector: '#root' });
  }

  public getData() {
    const page = state.get('page');
    requests.getCars(page);
  }
}

export default App;
