import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

interface ISuccessActions {
    onClick: () => void;
}

export interface ISuccessOrder {
    total: number;
}

export class Success extends Component<ISuccessOrder> {
    protected _total: HTMLElement;
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>(".order-success__description", this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}