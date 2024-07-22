import { Model } from './base/Model';
import {
	ICard,
	IAppState,
	IOrder,
	IContactsForm,
	IAddressForm,
	FormErrors,
} from '../types/index';

export type CatalogChangeEvent = {
	catalog: CardItem[];
};

export class CardItem extends Model<ICard> {
	title: string;
	description: string;
	id: string;
	price: number | null;
	category: string;
	image: string;
	index: number;
	button: string;
	total: number;
}

export class AppState extends Model<IAppState> {
	basket: CardItem[] = [];
	catalog: CardItem[];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		total: null,
		address: '',
		payment: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

  setCatalog(items: ICard[]) {
    this.catalog = items.map((item) => new CardItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  removeFromBasket(item: CardItem) {
    this.basket = this.basket.filter(val => val.id != item.id)
    this.emitChanges('basket:changed')

    this.basket.forEach(card => {
        this.order.items.push(card.id)
        this.order.items = [card.id]
    })
  }

  addToBasket(item: CardItem) {
		this.basket.push(item)
    this.order.items.push(item.id)
    this.emitChanges('basket:changed')
  }

  clearBasket() {
    this.basket.forEach(id => {
        this.removeFromBasket(id);
    });
  }

	getTotal() {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	setPreview(item: CardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

  setAddressField(field: keyof IAddressForm, value: string) {
    this.order[field] = value;

		if (this.validateAddress()) {
			this.events.emit('order:ready', this.order);
		}
  }

	validateAddress() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать адрес эл. почты';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('formErrorsContacts:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}
