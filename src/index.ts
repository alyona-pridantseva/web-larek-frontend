import './scss/styles.scss';

import { WebLarekAPI } from './components/WebLarekAPI';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Card } from './components/Card';
import { Success } from './components/common/Success';
import { AppState, AppForm } from './components/AppData';
import { ICard, IOrder, IContactsForm, IAddressForm, CatalogChangeEvent } from './types';
import { Page } from './components/Page';
import { OrderForm } from './components/OrderForm';


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
const formData = new AppForm({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contactsOrder = new OrderForm(cloneTemplate(constantsTemplate), events);
const addressOrder = new OrderForm(cloneTemplate(orderTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Получаем карточки(список) с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.error(error);
	});

// Вывод карточек на главную страницу
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

//превью карточки
events.on('card:select',  (item: ICard)=>{
  appData.setPreview(item);
});

// добавление и удаления в корзину
events.on('card:selected', (item: ICard) => {
  if (appData.basket.indexOf(item) === -1){
    appData.addToBasket(item);
    events.emit('cardBasket:add', item);
  } else {
    appData.removeFromBasket(item);
    events.emit('cardBasket:remove', item);
  }
});


// Изменена открытая выбранная карточка
events.on('preview:changed', (item: ICard) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate),{
			onClick: () => {
				events.emit('card:selected', item);
				card.buttonName = appData.basket.indexOf(item) === -1? 'Купить' :'Удалить';
			}
	});

	modal.render({
			content: card.render({
					category: item.category,
					title: item.title,
					description: item.description,
					image: item.image,
					price: item.price,
					buttonName: appData.basket.indexOf(item) === -1? 'Купить' :'Удалить'
			})
	});
});


events.on('basket:changed', (items: ICard[]) => {
	basket.items = items.map((item, index) => {
			const card = new Card('card', cloneTemplate(cardBasketTemplate), {
					onClick: () => {
						events.emit('card:delete', item);
					}
			});
			return card.render({
					title: item.title,
					price: item.price,
					index: index + 1,
			});
	});
	basket.selected = appData.basket.length;
  const total = appData.getTotal();
  basket.total = total;
  appData.order.total = total;
  appData.order.items = appData.basket.map((item) => item.id);
});

// удаления продукты(карточки) из корзины в корзине
events.on('card:delete', (item: ICard) => appData.removeFromBasket(item));

//изменение кол-ва карточек в корзине
events.on('counter:changed', (item: string[]) => {
  page.counter = appData.basket.length;
})

// Открыть форму с адресом и способом оплаты
events.on('addressForm:open', () => {
	modal.render({
			content: addressOrder.render({
					payment: '',
					address: '',
					valid: false,
					errors: [],
			})
	});
});

// Открыть форму с адресом и способом оплаты
events.on('contactsForm:open', () => {
	modal.render({
			content: contactsOrder.render({
					phone: '',
					email: '',
					valid: false,
					errors: [],
			})
	});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { email, phone, payment, address } = errors;
  addressOrder.valid = !email && !phone;
  addressOrder.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
	contactsOrder.valid = !payment && !address;
  contactsOrder.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменения в полях контакты
events.on(/^order\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
  formData.setContactsField(data.field, data.value);
});

// Изменения в поле адреса доставки
events.on(/^order\..*:change/, (data: { field: keyof IAddressForm, value: string }) => {
  formData.setAddressField(data.field, data.value);
});

// доступность кнопки, если инпут c адресом заполнен
events.on('addressForm:ready', () => {
	addressOrder.valid = true;
});

// при отправки формы с адресом, открываем модалку с контактами
events.on('contactsForm:submit', () => {
  events.emit('contact:open');
});

// успешно
events.on('success:open', () => {
  const data: IOrder = {
    payment: formData.orderPerson.payment,
    address: formData.orderPerson.address,
    email: formData.orderPerson.email,
    phone: formData.orderPerson.phone,
    total: appData.order.total,
    items: appData.order.items
  };
	api.orderProducts(data)
    .then((result)=>{
      appData.clearBasket();
      appData.clearDataOrder();
      formData.clearDataOrder();
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
        },
      });

      success.total = result.total.toString();
      modal.render({
        content: success.render({})
      });
    })

    .catch((err) => {
      console.log(err);
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});