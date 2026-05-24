import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filters) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => `
        <div class="trip-filters__filter">
          <input id="filter-${filter.type}"
                 class="trip-filters__filter-input visually-hidden"
                 type="radio"
                 name="trip-filter"
                 value="${filter.type}"
                 ${filter.isChecked ? 'checked' : ''}
                 ${filter.isDisabled ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.name}</label>
        </div>
      `).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class Filter extends AbstractView {
  #filters = [];
  #onFilterChange = null;

  constructor({ filters, onFilterChange }) {
    super();
    this.#filters = filters;
    this.#onFilterChange = onFilterChange;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  setFilterChangeHandler() {
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.classList.contains('trip-filters__filter-input')) {
      this.#onFilterChange(evt.target.value);
    }
  };
}
