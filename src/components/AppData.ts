import { Model } from './base/Model';
import { IProductItem, IAppState, IOrder, IContactsForm, IAddressForm, IFormErrors, } from '../types/index';

export type CatalogChangeEvent = {
  catalog: IProductItem[]
};

export class Product extends Model<IProductItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	isOrdered: boolean;
	index: number;
	getIdProductItem(): string {
		return this.id;
	}
}

export class AppState extends Model<IAppState> {
  basket: IProductItem[] = [];
  _catalog: IProductItem[];
  _order: IOrder = {
      email: '',
      phone: '',
      items: [],
      total: null,
      address: '',
      payment: ''
  };
  formErrors: IFormErrors = {};

  get order() {
		return this._order;
	}

	getOrderAPI() {
		const orderApi: IOrder = {
			payment: this._order.payment,
			email: this._order.email,
			phone: this._order.phone,
			address: this._order.address,
			total: 0,
			items: [],
		};
		orderApi.items = this._order.items.map((item) => item.id);
		orderApi.total = this.getTotal();
		return orderApi;
	}

	addToBasket(item: Product) {
		if (this.findOrderItem(item) === null) {
			this._order.items.push(item);
			this.emitChanges('basket:changed');
		}
	}

	removeFromBasket(item: Product) {
		this._order.items = this._order.items.filter((el) => el.id != item.id);
		this.emitChanges('basket:changed');
	}

	clearBasket() {
		this._order.items = [];
		this.emitChanges('basket:changed');
	}

	getTotal() {
		this._order.total = this._order.items.reduce((prev, current) => prev + current.price, 0);
		return this._order.total;
	}

	getProducts(): Product[] {
		return this._catalog;
	}

	findOrderItem(item: Product) {
		const orderItemIndex = this._order.items.findIndex(
			(id) => id.getIdProductItem() === item.id
		);

		if (orderItemIndex !== -1) {
			return orderItemIndex;
		} else {
			return null;
		}
	}

	updateCounter(): number {
		return this.basket.length;
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: Product) {
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
