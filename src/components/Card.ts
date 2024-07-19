import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IButtonOptions {
	disabledButton: boolean;
	buttonText: string;
}

export interface ICard {
	title: string;
	description: string;
	id: string;
	price: number | null;
	category: string;
	image: string;
	button?: string;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _button?: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions, buttonOptions?: IButtonOptions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._description = container.querySelector(`.${blockName}__description`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`,container);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}


    if (buttonOptions?.disabledButton) {
			this.setDisabled(this._button, true);
			this.setText(this._button, buttonOptions.buttonText);
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
        this.toggleClass(this._category, "card__category_soft");
    }
    else if (value == 'другое') {
        this.toggleClass(this._category, "card__category_other");
    }
    else if (value == 'дополнительное') {
        this.toggleClass(this._category, "card__category_additional");
    }
    else if (value == 'кнопка') {
        this.toggleClass(this._category, "card__category_button");
    }
    else if (value == 'хард-скил') {
        this.toggleClass(this._category, "card__category_hard");
    }
}
}