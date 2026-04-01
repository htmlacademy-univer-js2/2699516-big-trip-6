import PointModel from './model/points-model.js';
import TripPresenter from './presenter/trip-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const container = siteMainElement.querySelector('.page-body__container');

const pointsModel = new PointModel();

const presenter = new TripPresenter({
  container: container,
  pointsModel: pointsModel
});

presenter.init();
