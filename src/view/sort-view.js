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
          <label class="trip-sort__btn" for="sort-${sort.type}">${sort.name}</label>
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
    this.element.addEventListener('change', this.#sortChangeHandler);
  }

  #sortChangeHandler = (evt) => {
    if (evt.target.classList.contains('trip-sort__input')) {
      this.#onSortChange(evt.target.value);
    }
  };
}
