import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import TripApi from './api/trip-api.js';
import LoadingView from './view/loading-view.js';
import UiBlocker from './framework/ui-blocker/ui-blocker.js';
import {END_POINT, TimeLimit} from './const.js';
import {createAuthorization} from './utils/auth.js';
import {render, remove} from './framework/render.js';

const siteMainElement = document.querySelector('.page-main');
const container = siteMainElement.querySelector('.page-body__container');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = container.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');

const tripApi = new TripApi(END_POINT, createAuthorization());
const pointsModel = new PointModel({tripApi});
const filterModel = new FilterModel();
const sortModel = new SortModel();

const uiBlocker = new UiBlocker({
  lowerLimit: TimeLimit.LOWER_LIMIT,
  upperLimit: TimeLimit.UPPER_LIMIT,
});

const tripInfoPresenter = new TripInfoPresenter({
  container: tripMainElement,
  pointsModel,
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

  tripInfoPresenter.init();
  filterPresenter.init();
  tripPresenter.init();
};

bootstrap();
