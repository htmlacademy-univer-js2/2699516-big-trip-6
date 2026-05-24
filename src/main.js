import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripApi from './api/trip-api.js';
import LoadingView from './view/loading-view.js';
import UiBlocker from './framework/ui-blocker/ui-blocker.js';
import {END_POINT, AUTHORIZATION, TimeLimit} from './const.js';
import {render, remove} from './framework/render.js';

const siteMainElement = document.querySelector('.page-main');
const container = siteMainElement.querySelector('.page-body__container');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = container.querySelector('.trip-events');

const tripApi = new TripApi(END_POINT, AUTHORIZATION);
const pointsModel = new PointModel({tripApi});
const filterModel = new FilterModel();
const sortModel = new SortModel();

const uiBlocker = new UiBlocker({
  lowerLimit: TimeLimit.LOWER_LIMIT,
  upperLimit: TimeLimit.UPPER_LIMIT,
});

const filterPresenter = new FilterPresenter({
  container: filtersContainer,
  filterModel,
  pointsModel,
});

const tripPresenter = new TripPresenter({
  container,
  pointsModel,
  filterModel,
  sortModel,
  uiBlocker,
});

const bootstrap = async () => {
  const loadingComponent = new LoadingView();
  render(loadingComponent, tripEventsContainer);

  await pointsModel.init();

  remove(loadingComponent);

  filterPresenter.init();
  tripPresenter.init();
};

bootstrap();
