import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICard } from '../types';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
	onDelete?: () => void;
	onSubmit?: () => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _index: HTMLSpanElement;
	protected _button?: HTMLButtonElement;
	protected _button_delete?: HTMLButtonElement;


	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._description = container.querySelector(`.${blockName}__description`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`,container);
		this._index = container.querySelector('.basket__item-index');
		this._button = container.querySelector(`.button`);
		this._button_delete = container.querySelector('.basket__item-delete');


		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}

		if (this._button) {
			this._button.addEventListener('click', (event) => {
					event.preventDefault();
					actions?.onSubmit()
			})
	}

		if (this._button_delete) {
			this._button_delete.addEventListener('click', () => {
					actions.onDelete()
			})
	}

	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

  set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (!value) {
			this.setDisabled(this._button, true);
			this.setText(this._button, 'Недоступно для покупки');
		}
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
    if (value == "софт-скил") {
        this.toggleClass(this._category, "card__category_soft-skill");
    }
    else if (value == 'другое') {
        this.toggleClass(this._category, "card__category_other");
    }
    else if (value == 'дополнительное') {
        this.toggleClass(this._category, "card__category_more");
    }
    else if (value == 'кнопка') {
        this.toggleClass(this._category, "card__category_button");
    }
    else if (value == 'хард-скил') {
        this.toggleClass(this._category, "card__category_hard-skill");
    }
}
}