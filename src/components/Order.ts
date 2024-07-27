import { Form } from './common/Form';
import { IAddressForm } from '../types/index';
import { IContactsForm } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class addressForm extends Form<IAddressForm> {
	protected _onlineButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._onlineButton = ensureElement<HTMLButtonElement>('.online', this.container);
		this._cashButton = ensureElement<HTMLButtonElement>('.cash', this.container);
		this._addressInput = ensureElement<HTMLInputElement>('.address_input', this.container);

		this._onlineButton.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this._onlineButton.classList.add('button_alt-active');
			this._cashButton.classList.remove('button_alt-active');
			events.emit('address:change', { field: 'payment', value: 'Онлайн' });
		});

		this._cashButton.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this._cashButton.classList.add('button_alt-active');
			this._onlineButton.classList.remove('button_alt-active');
			events.emit('address:change', {field: 'payment', value: 'При получении',});
		});

		if (this._addressInput) {
			this._addressInput.addEventListener('input', (evt: InputEvent) => {
				const target = evt.target as HTMLInputElement;
				const value = target.value;
				events.emit('address:change', { field: 'address', value: value });
			});
		}
	}

	set addressInput(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}


export class contactsForm extends Form<IContactsForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = ensureElement<HTMLInputElement>('.email_input',this.container);
		this._phoneInput = ensureElement<HTMLInputElement>('.phone_input',this.container);


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

