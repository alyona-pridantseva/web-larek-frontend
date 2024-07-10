// Интерфейс, описывающий состояние приложения
export interface IAppData {
	catalog: IProductItem[];
	basket: IProductItem[];
  order: IOrder | null; // описание заказа
	preview: string | null; // указатель той карточки, которую хотим посмотреть(id) т.е идентификатор товара для предпросмотра
}

// Интерфейс главной страницы
export interface PageHome {
  counter: number;
  catalog: HTMLElement[];
  blocking: boolean;
}

//Интерфейс модального окна
export interface IModalData {
  content: HTMLElement;
}

// Интерфейс товара
export interface IProductItem {
  title: string;
  description: string;
  id: string;
  price: number;
  category: string;
  image: string;
  getIdProductItem(): string;
}

// Интерфейс карточки товара
export interface ICard extends IProductItem {
  button?: string;
}

// Интерфейс корзины
export interface IBasket {
  total: number; // общая сумма заказа
  button: HTMLButtonElement;
  items: HTMLElement[]; // список товаров
 }

// Интерфейс данных корзины
export interface IBasketData {
  items: IProductItem[];
  addProductItem(id: IProductItem): void;
  removeProductItem(id: IProductItem): void;
  getTotal(): number;
  clearBasket(): void;
}

// Интерфейс данных одного продукта
export interface IBasketProductItem {
  index: number;
  title: string;
  price: number;
  deleteButton: string;
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

// Интерфейс отправки информации заказа на сервер
export interface IOrder {
	items: IProductItem[];
	id: string;
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
}

// Интерфейс Api заказа
interface IOrderApi {
	items: string[];
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
}

// Интерфейс валидации формы
export type TFormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс результата оформления заказа
export interface IOrderResult {
  id: string[]; // идентификатор заказа
  total: number; // суммарная стоимость заказа
}

// Интерфейс успешно оформленного заказа
export interface ISuccessOrder {
  total: number;
}