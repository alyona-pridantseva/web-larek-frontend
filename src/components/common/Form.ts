import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";
import { IFormState } from "../../types";

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]',this.container);
        if (this._submit) {
            this._submit.addEventListener('click', (e: Event) => {
                e.preventDefault();
                this.events.emit(`${this.container.name}:submit`);
            });
        }

        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}