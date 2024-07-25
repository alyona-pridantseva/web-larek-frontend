import { Form } from './common/Form';
import { IOrder } from '../types/index';
import { IEvents } from './base/events';

export class contactsForm extends Form<IOrder> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = container.querySelector('input[name="email"]');
		this._phoneInput = container.querySelector('input[name="phone"]');


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

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
	}
