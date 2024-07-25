import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICard, ICardActions } from '../types';

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _index: HTMLElement;
	protected _button: HTMLButtonElement; // кнопка для действия
	protected _buttonName?: string; // текст кнопки

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._description = container.querySelector(`.${blockName}__description`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._index = container.querySelector('.basket__item-index');
		this._button = container.querySelector(`.button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set buttonName(value: string) {
		this.setText(this._button, value);
	}

	buttonVisibility(value: number | null) {
		//если товар бесценен, кнопка неактивна
		if (value === null) {
			if (this._button) {
				this._button.disabled = true;
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set index(value: string) {
		this._index.textContent = value;
	}

	get index(): string {
		return this._index.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		this.buttonVisibility(value);
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		if (value == 'софт-скил') {
			this.toggleClass(this._category, 'card__category_soft-skill');
		} else if (value == 'другое') {
			this.toggleClass(this._category, 'card__category_other');
		} else if (value == 'дополнительное') {
			this.toggleClass(this._category, 'card__category_more');
		} else if (value == 'кнопка') {
			this.toggleClass(this._category, 'card__category_button');
		} else if (value == 'хард-скил') {
			this.toggleClass(this._category, 'card__category_hard-skill');
		}
	}

	get category(): string {
		return this._category.textContent || '';
	}
}
