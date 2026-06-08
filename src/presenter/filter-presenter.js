import Filter from '../view/filters-view.js';
import { render, replace, remove } from '../framework/render.js';
import { filters } from '../mock/filter.js';
import { FilterType, UpdateType } from '../const.js';
import { filterPointsByType } from '../utils/filter.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ container, filterModel, pointsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filterModel.addObserver(this.#handleModelChange);
    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#renderFilter();
  }

  #getFiltersWithState() {
    const currentFilter = this.#filterModel.getFilter();
    const points = this.#pointsModel.getPoints();

    if (this.#pointsModel.hasLoadError()) {
      return filters.map((filter) => ({
        ...filter,
        isChecked: filter.type === FilterType.EVERYTHING,
        isDisabled: true,
      }));
    }

    return filters.map((filter) => ({
      ...filter,
      isChecked: filter.type === currentFilter,
      isDisabled: filter.type !== FilterType.EVERYTHING
        && filterPointsByType[filter.type](points).length === 0,
    }));
  }

  #renderFilter() {
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new Filter({
      filters: this.#getFiltersWithState(),
      onFilterChange: this.#handleFilterChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      this.#filterComponent.setFilterChangeHandler();
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
    this.#filterComponent.setFilterChangeHandler();
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelChange = () => {
    this.#renderFilter();
  };
}
