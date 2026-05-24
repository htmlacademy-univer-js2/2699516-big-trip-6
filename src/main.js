import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const container = siteMainElement.querySelector('.page-body__container');
const filtersContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointModel();
const filterModel = new FilterModel();
const sortModel = new SortModel();

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
});

filterPresenter.init();
tripPresenter.init();
