import './scss/styles.scss';


import { EventEmitter } from './components/base/events';
import { CDN_URL, API_URL } from './utils/constants';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Success } from './components/common/Success';
import {Page} from "./components/Page";
import { WebLarekAPI } from './components/WebLarekApi';
import {IOrder, IAddressForm, IContactsForm} from './types';


const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const constantsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const orderAddress = new AddressForm(cloneTemplate(orderTemplate), events);








// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { email, phone, payment, address } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
  orderAddress.valid = !payment && !address;
  orderAddress.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IAddressForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});