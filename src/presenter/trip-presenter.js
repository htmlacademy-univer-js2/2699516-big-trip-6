import Point from '../view/route-point-view.js';
import CreateForm from '../view/form-edit-view.js';
import TripEvents from '../view/trip-events-view.js';

import { render, RenderPosition } from '../render.js';

const INITIAL_POINTS_COUNT = 3;

export default class TripPresentor {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new CreateForm(), this.container, RenderPosition.BEFOREEND);
    render(new TripEvents(), this.container, RenderPosition.BEFOREEND);
    
    for (let i = 0; i < INITIAL_POINTS_COUNT; i++) {
      render(new Point(), this.container, RenderPosition.BEFOREEND);
    }
  }
}