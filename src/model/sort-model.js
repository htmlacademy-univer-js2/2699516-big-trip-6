import Observable from '../framework/observable.js';
import { SortType } from '../const.js';

export default class SortModel extends Observable {
  #sortType = SortType.DAY;

  getSortType() {
    return this.#sortType;
  }

  setSortType(updateType, sortType) {
    this.#sortType = sortType;
    this._notify(updateType, sortType);
  }

  resetSortType() {
    this.#sortType = SortType.DAY;
  }
}
