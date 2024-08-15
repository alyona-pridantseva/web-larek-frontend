import { Model } from '../base/Model';
import {
	ICard,
	IAppState,
	IOrder,
	IContactsForm,
	IAddressForm,
	FormErrors,
	IOrderPerson,
	IAppForm
} from '../../types/index';


export class AppState extends Model<IAppState> {
	basket: ICard[] = [];
	catalog: ICard[];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		total: 0,
		address: '',
		payment: '',
	};
	preview: string | null;

  setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	updateCardsBasket(){
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	clearBasket() {
    this.basket = [];
    this.updateCardsBasket();
  };

	addToBasket(item: ICard) {
		if (this.basket.indexOf(item) === -1){
			this.basket.push(item);
			this.updateCardsBasket();
		}
	}

  removeFromBasket(item: ICard) {
    this.basket = this.basket.filter(val => val.id != item.id)
		this.updateCardsBasket();
    // this.emitChanges('basket:changed')
  }

	getTotal() {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	clearDataOrder() { //очистка данных о заказе(кэш)
    this.order = {
    email: '',
		phone: '',
		items: [],
		total: 0,
		address: '',
		payment: '',
    };
  };
}