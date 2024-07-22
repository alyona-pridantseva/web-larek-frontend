import { Form } from './common/Form';
import { IOrder } from '../types/index';
import { IEvents } from './base/events';

export class OrderForm extends Form<IOrder> {
	protected _onlineButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _addressInput?: HTMLInputElement;
	protected _emailInput?: HTMLInputElement;
	protected _phoneInput?: HTMLInputElement;
	protected _total?: number;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._onlineButton = container.querySelector('button[name="card"]');
		this._cashButton = container.querySelector('button[name="cash"]');
		this._addressInput = container.querySelector('input[name="address"]');
		this._emailInput = container.querySelector('input[name="email"]');
		this._phoneInput = container.querySelector('input[name="phone"]');

		if (this._cashButton) {
			this._cashButton.addEventListener('click', (el) => {
				el.preventDefault();
				this.toggleCash();
				this.toggleCard(false);
				this.setPayment('payment', 'При получении');
			});
		}
		if (this._onlineButton) {
			this._onlineButton.addEventListener('click', (el) => {
				el.preventDefault;
				this.toggleCard();
				this.toggleCash(false);
				this.setPayment('payment', 'Онлайн');
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			'';
	}

	toggleCard(state: boolean = true) {
		this.toggleClass(this._onlineButton, 'button_alt-active', state);
	}

	toggleCash(state: boolean = true) {
		this.toggleClass(this._cashButton, 'button_alt-active', state);
	}

	setPayment(field: keyof IOrder, value: string) {
		this.events.emit('order.payment:change', { field, value });
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
