// Интерфейс, описывающий главную страницу
export interface IAppState {
	catalog: ICard[];
	basket: string[];
	order: IOrder | null; // описание заказа
	preview: string | null; // указатель той карточки, которую хотим посмотреть(id) т.е идентификатор товара для предпросмотра
}

// Интерфейс главной страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

//Интерфейс модального окна
export interface IModalData {
	content: HTMLElement;
}

// Интерфейс товара
export interface ICard {
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

// Интерфейс отображения корзины
export interface IBasketView {
	total: number; // общая сумма заказа
	items: HTMLElement[];
	selected: HTMLElement[];
}

// Интерфейс способа оплаты и формы адреса доставки
export interface IAddressForm {
	payment: string;
	address: string;
}

// Интерфейс формы - контакты
export interface IContactsForm {
	email: string;
	phone: string;
}

// Интерфейс данных заказа
export interface IOrder extends IAddressForm, IContactsForm {
	items: string[]; // Список товаров
	total: number;
}

// Интерфейс валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс результата оформления заказа
export interface IOrderResult {
	id: string[]; // идентификатор заказа
}