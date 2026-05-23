import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate(sorts) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sorts.map((sort) => `
        <div class="trip-sort__item trip-sort__item--${sort.type}">
          <input id="sort-${sort.type}" 
                 class="trip-sort__input visually-hidden" 
                 type="radio" 
                 name="trip-sort" 
                 value="sort-${sort.type}"
                 ${sort.isChecked ? 'checked' : ''}
                 ${sort.isDisabled ? 'disabled' : ''}>
          <label class="trip-sort__btn" for="sort-${sort.type}">${sort.name}</label>
        </div>
      `).join('')}
    </form>
  `;
}

export default class Sort extends AbstractView{
  #sorts = [];

  constructor(sorts) {
    super();
    this.#sorts = sorts;
  }

  get template(){
    return createSortTemplate(this.#sorts);
  }
}
