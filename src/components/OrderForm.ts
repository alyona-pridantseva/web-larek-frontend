import { Form } from './common/Form';
import { IOrder } from '../types/index';
import { IEvents } from './base/events';

export class OrderForm extends Form<IOrder> {
	protected _onlineButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

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
				this._cashButton.classList.add('button_alt-active');
				this._onlineButton.classList.remove('button_alt-active');
				events.emit('address:change', {field:'payment', value: 'cash'} );
			});
		}

		if (this._onlineButton) {
			this._onlineButton.addEventListener('click', (el) => {
				el.preventDefault;
				this._onlineButton.classList.add('button_alt-active');
				this._cashButton.classList.remove('button_alt-active');
				events.emit('address:change', {field:'payment', value: 'online'});
			});
		}


		if (this._addressInput) {
      this._addressInput.addEventListener('input', (evt: InputEvent) => {
          const target = evt.target as HTMLInputElement;
          const value = target.value;
          events.emit('address:change', {field:'addressInput', value: value} );
      });
    }
	
		if (this._emailInput) {
			this._emailInput.addEventListener('input', (evt: InputEvent) => {
					const target = evt.target as HTMLInputElement;
					const value = target.value;
					events.emit('contacts:change', {field:'email', value: value});
			});
		}
	
		if (this._phoneInput) {
			this._phoneInput.addEventListener('input', (evt: InputEvent) => {
					const target = evt.target as HTMLInputElement;
					const value = target.value;
					events.emit('contacts:change', {field:'phone', value: value});
			});
		}
	};

	set addressInput(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
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
