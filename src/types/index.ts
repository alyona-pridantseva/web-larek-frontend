// Интерфейс, описывающий главную страницу
export interface IAppState {
	catalog: ICard[];
	basket: ICard[];
	order: IOrder | null; // описание заказа
	preview: string | null; // указатель той карточки, которую хотим посмотреть(id) т.е идентификатор товара для предпросмотра
}

// Интерфейс главной страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

export interface IFormState {
  valid: boolean;
  errors: string[];
}

// Интерфейс карточки
export interface ICard {
	title: string;
	description: string;
	id: string;
	price: number | null;
	category: string;
	image: string;
	index?: number;
	buttonName?: string;
}

// Интерфейс отображения корзины
export interface IBasketView {
	total: number; // общая сумма заказа
	items: HTMLElement[];
	button: string[];
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

// Интерфейс валидации формы покупателя
export type FormErrors = Partial<Record<keyof IOrderPerson, string>>;

// Интерфейс результата оформления заказа
export interface IOrderResult {
	id: string[]; // идентификатор заказа
	total: number;
}

//Интерфейс модального окна
export interface IModalData {
	content: HTMLElement;
}

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ICardActions {
	onClick?: (event: MouseEvent) => void;
}

export interface IWebLarekAPI {
	getProductList: () => Promise<ICard[]>; //получение списка карточек с сервера
	getProductItem: (id: string) => Promise<ICard>; //получение информации карточки продукта
	orderProducts: (order: IOrder) => Promise<IOrderResult>; //отправка информации на сервер
}

export type CatalogChangeEvent = {
	catalog: ICard[];
};


export interface IAppForm {
  IOrderPerson: IOrderPerson;
  formErrors: FormErrors;
}

 export type IOrderPerson = IAddressForm & IContactsForm;