import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate(sorts) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sorts.map((sort) => `
        <div class="trip-sort__item  trip-sort__item--${sort.type}">
          <input id="sort-${sort.type}"
                 class="trip-sort__input  visually-hidden"
                 type="radio"
                 name="trip-sort"
                 value="${sort.type}"
                 ${sort.isChecked ? 'checked' : ''}
                 ${sort.isDisabled ? 'disabled' : ''}>
          <label class="trip-sort__btn" data-sort-type="${sort.type}" for="sort-${sort.type}">${sort.name}</label>
        </div>
      `).join('')}
    </form>
  `;
}

export default class Sort extends AbstractView {
  #sorts = [];
  #onSortChange = null;

  constructor({ sorts, onSortChange }) {
    super();
    this.#sorts = sorts;
    this.#onSortChange = onSortChange;
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }

  setSortChangeHandler() {
    this.element.addEventListener('click', this.#sortClickHandler);
  }

  #sortClickHandler = (evt) => {
    const sortButton = evt.target.closest('[data-sort-type]');

    if (!sortButton) {
      return;
    }

    const sortType = sortButton.dataset.sortType;
    const sortInput = this.element.querySelector(`#sort-${sortType}`);

    if (!sortInput || sortInput.disabled) {
      return;
    }

    this.#onSortChange(sortType);
  };
}
