import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CDN_URL, API_URL } from './utils/constants';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Card } from './components/Card';
import { WebLarekAPI } from './components/WebLarekAPI';
// import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Success } from './components/common/Success';
import {Page} from "./components/Page";
import { OrderForm } from './components/OrderForm';
import { AppState,CatalogChangeEvent, CardItem } from './components/AppData';



const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

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
// const contacts = new ContactsForm(cloneTemplate(constantsTemplate), events);
// const address = new AddressForm(cloneTemplate(orderTemplate), events);


// Получаем с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);

// // Вывод карточек
// events.on('items:changed', () => {
// 	page.catalog = appData.getProducts().map((item) => {
// 		const card = new Card('card', cloneTemplate(cardCatalogTemplate), null, {
// 			onClick: () => events.emit('preview:changed', item),
// 		});
// 		return card.render(item);
// 	});
// });

// // Открытие карточки товара
// events.on('card:select', (item: Product) => {
// 	appData.setPreview(item);
// });


// // Отображение элементов в корзине
// events.on('basket:changed', () => {
// 	const basketProducts = appData.order.items.map((item, index) => {
// 		const basketItem = new BasketProduct(cloneTemplate(cardBasketTemplate), {
// 			onClick: () => events.emit('basket:remove', item),
// 		});
// 		return basketItem.render({
// 			title: item.title,
// 			price: item.price,
// 			index: index + 1,
// 		});
// 	});
// 	basket.render({
// 		items: basketProducts,
// 		total: appData.getTotal(),
// 	});
// });






// // Изменилось состояние валидации формы
// events.on('formErrors:change', (errors: Partial<IOrder>) => {
//   const { email, phone, payment, address } = errors;
//   contacts.valid = !email && !phone;
//   contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
//   address.valid = !payment && !address;
//   address.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
// });

// // Изменения в полях доставки
// events.on(/^order\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
//   appData.setContactsField(data.field, data.value);
// });

// // Изменения в поле адреса доставки
// events.on(/^order\..*:change/, (data: { field: keyof IAddressForm, value: string }) => {
//   appData.setAddressField(data.field, data.value);
// });

// // Блокируем прокрутку страницы если открыта модалка
// events.on('modal:open', () => {
//   page.locked = true;
// });

// // ... и разблокируем
// events.on('modal:close', () => {
//   page.locked = false;
// });

// // api
// // 	.getProductList()
// // 	.then((result) => {
// // 		console.log(result);
// // 	})
// // 	.catch((err) => {
// // 		console.error(err);
// // 	})
// // 	.finally(() => {
// // 		console.log('called');
// // 	});

// // api
// // 	.getProductItem('854cef69-976d-4c2a-a18c-2aa45046c390')
// // 	.then((result) => {
// // 		console.log(result);
// // 	})
// // 	.catch((err) => {
// // 		console.error(err);
// // 	})
// // 	.finally(() => {
// // 		console.log('called');
// // 	});
