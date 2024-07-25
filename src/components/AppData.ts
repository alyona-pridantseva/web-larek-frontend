import { Model } from './base/Model';
import {
	ICard,
	IAppState,
	IOrder,
	IContactsForm,
	IAddressForm,
	FormErrors,
	IOrderPerson,
	IAppForm
} from '../types/index';


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

export class AppForm extends Model<IAppForm>{
  orderPerson: IOrderPerson = {
    payment:'',
    address:'',
    email:'',
    phone:''
  };
  formErrors: FormErrors = {};

    clearDataOrder() {
      this.orderPerson = {
      email: '',
      phone: '',
      address: '',
      payment: '',
      };
  };

  setContactsField(field: keyof IContactsForm, value: string) {
		this.orderPerson[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.orderPerson);
		}
	}

  setAddressField(field: keyof IAddressForm, value: string) {
    this.orderPerson[field] = value;

		if (this.validateAddress()) {
			this.events.emit('order:ready', this.orderPerson);
		}
  }

  validateAddress() {
		const errors: typeof this.formErrors = {};
    const addressRegex = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
		if (!this.orderPerson.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
    else if (!addressRegex.test(this.orderPerson.address)) {
      errors.address ='Проверьте правильность введеннных данных';
    }
		else if (!this.orderPerson.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
    const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (this.orderPerson.phone.startsWith('8')) {
      this.orderPerson.phone = '+7' + this.orderPerson.phone.slice(1);
    }

    if (!this.orderPerson.email) {
      errors.email = 'Введите email';
    } else if (!emailRegex.test(this.orderPerson.email)) {
      errors.email = 'Неправильно введен адрес электронной почты';
    }

    if (!this.orderPerson.phone) {
      errors.phone = 'Введите номер телефона';
    } else if (!phoneRegex.test(this.orderPerson.phone)) {
      errors.phone ='Неправильно введен номера телефона';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
	}
