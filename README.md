# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс, описывающий состояние приложения

```
interface IAppData{
  catalog: IProductItem[];
  basket: IProductItem[];
  order: IOrder | null; // описание заказа
  preview: string | null; // указатель той карточки, которую хотим посмотреть(id) т.е идентификатор товара для предпросмотра
}
```

Интерфейс главной страницы

```
interface PageHome {
  counter: number;
  catalog: HTMLElement[];
  blocking: boolean;
}
```

Интерфейс модального окна

```
interface IModalData {
    content: HTMLElement;
}
```

Интерфейс товара

```
interface IProductItem {
  title: string;
  description: string;
  id: string;
  price: number;
  category: string;
  image: string;
  getIdProductItem(): string;
}
```

Интерфейс карточки товара

```
interface ICard extends IProductItem {
  button?: string;
}
```

Интерфейс корзины

```
interface IBasket {
  total: number; // общая сумма заказа
  button: HTMLButtonElement;
  items: HTMLElement[]; // список товаров
 }
 ```

Интерфейс данных корзины

```
interface IBasketData {
  items: IProductItem[];
  addProductItem(id: IProductItem): void;
  removeProductItem(id: IProductItem): void;
  getTotal(): number;
  clearBasket(): void;
}
```


Интерфейс данных одного продукта в корзине

```
interface IBasketProductItem {
  index: number;
  title: string;
  price: number;
  deleteButton: string;
}
```

Интерфейс способа оплаты и формы адреса доставки

```
interface IAddressForm {
  payment: string;
  address: string;
}
```

Интерфейс формы - контакты

```
interface IContactsForm {
  email: string;
  phone: string;
}
```

Интерфейс отправки информации заказа на сервер

```
interface IOrder {
  items: IProductItem[];
  id: string;
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
}
```


Интерфейс Api заказа

```
interface IOrderAPI {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
```

Интерфейс валидации формы

```
type TFormErrors = Partial<Record<keyof IOrder, string>>;
```

Интерфейс результата оформления заказа

```
interface IOrderResult {
  id: string[]; // идентификатор заказа
  total: number; // суммарная стоимость заказа
}
```

Интерфейс успешно оформленного заказа

```
interface ISuccessOrder {
  total: number;
}
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данных;
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов.\

Методы:
- `handleResponse(responce: Responce)` — обрабатывает ответ сервера
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове

В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

- `constructor(baseUrl: string, options: RequestInit = {})`


#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - установка слушателя;
- `emit` - запуск события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие;
- `off` - cнять обработчик с события;
- `onAll` - cлушать все события;
- `offAll` - cбросить все обработчики.


#### Класс Component

Взаимодействие с DOM-элементами, позволяет управлять поведением и внешним видом.\

Методы:
- `toggleClass`- переключает класс элемента;
- `setText`- устнавливает текстовое содержимое элемента;
- `setDisabled`- меняет статус блокировки;
- `setHidden`- скрывает элемент;
- `setVisible`- показывает элемент;
- `setImage`- устанавливает изображение с альтернативным тексом;
- `render`- возвращает корневой DOM-элемент.


#### Класс Model

Представлен абстрактным классом. Используется в качестве базового для других классов, которые будут наследовать его и расширять функциональность.


### Слои данных

#### Класс AppData

Хранит данные приложения, следовательно можно отслеживать изменения.\
Наследуется от Model.\

Поля класса:

- `catalog: IProductItem[]` - список продуктов в каталоге;
- `basket: string[]` - список продуктов в корзине;
- `order: IOrder | null` - описание заказа;
- `preview: string | null` - указатель той карточки, которую хотим посмотреть(id) т.е идентификатор товара для предпросмотра;
- `formErrors: FormErrors` — валидация форм при оформлении заказа


Методы класса:
- `setCatalog(IProductItem[])` - каталог карточек;
- `removeFromBasket(ProductItem)` - удаление продукта из корзины;
- `addToBasket(ProductItem)` - добавление продукта в корзину;
- `clearBasket()` - очиcтка всей корзины;
- `getTotal()` - суммарная стоимость заказа в корзине;
- `updateBasket()` - обновление корзины;
- `setPreview(ProductItem)` - показывает продукт в модальном окне;
- `setAddressField(field: keyof IAddressForm, value: string)` - устанавливает значения для формы способа оплаты и формы адреса доставки;
- `validateAddress()` — валидация формы способа оплаты и формы адреса доставки;
- `setContactsField(field: keyof IContactsForm, value: string)` - устанавливает значения для формы с контактами;
- `validateContacts()` — валидация формы с контактами.


#### Класс PageHome

Отрисовка главной страницы. Наследуется от класса `Component`.

Поля класса:

- `_counter(value: number | null)` —  счетчик, количество добавленных продуктов в корзину;
- `_catalog(items: HTMLElement[])` — добавляет карточки продуктов на страницу.

Методы класса:

- `set counter(value: number | null)`;
- `set catalog(items: HTMLElement[])`;
- `set blocking(value: boolean)` — изменяет(активирует) блокировку страницы при открытом модальном окне.

####  Класс Card

Управляет отображением карточки товара. Наследуется от класса `Component`


Поля класса:

 - `_title: string` - название продукта;
 - `_description: string` - описание продукта;
 - `id: string` - id товара;
 - `price: number` -  цена продукта;
 - `category: string` -  категория продукта;
 - `_image: string` -  изображение продукта;
 - `index: number` — индекс продукта в корзине;
 - `_button?: HTMLButtonElement` - кнопка.

Методы:

- `set title(value: string)` — изменяет название продукта;
- `get title()` — получает название продукта;
- `set description(value: string | string[])` — изменяет описание продукта;
- `set id(value: string)` — изменяет значение идентификатора продукта;
- `get id()` — получает id продукта;
- `set price` — изменяет цену продукта;
- `set category()` — изменяет категорию продукта;
- `set image(value: string)` — изменяет изображение продукта;
- `set index` - изменяет индекс продукта


#### Класс Modal

Управляет отображением модального окна `IModalData`. Наследуется от класса `Component`.

Поля класса:

- `_content: HTMLElement` — наполнение;
- `_closeButton: HTMLButtonElement` — кнопка(элемент) закрытия модального окна.

Методы:

- `set content` - изменяет внутренность модального окна;
- `open` - открывает модальное окно;
- `close` - закрывает модальное окно;
- `construction` - реализация модального окна.


#### Класс Form

Отображает формы и управляет ими. Наследуется от класса `Component`.

Поля класса:

- `_submit: HTMLButtonElement` — элемент кнопки подтверждения формы.
- `_errors: HTMLElement` — ошибка при отправке формы.


Методы класса:

- `inputChange` — отслеживает изменения в полях ввода;
- `set errors(value: string)` — если поле невалидно, сообщает об ошибке в виде текста;
- `set valid(value: boolean)` — управляет состоянием кнопки при заполнении формы;
- `render` — рендер формы.


#### Класс BasketData:

Отображает корзину и управляет её содержиым.

Поля класса:

- `_list: HTMLElement` — элемент списка добавленных товаров в корзину;
- `_total: HTMLElement` — элемент общей суммы заказа в корзине;
- `_button: HTMLElement` — элемент кнопка оформления(подтверждения).

Методы класса:

- `set items(items: HTMLElement[])` — изменяет элементы продуктов в корзине;
- `set total(total: number)` — изменяет общая сумма заказа в корзине.


#### BasketProductItem

Данные продуктов, которые добавлены в корзину.

Поля класса:

- `_index: HTMLElement`- порядковый номер продукта в корзине;
- `_title` - название продукта;
- `_price` - цена продукта;
- `_deleteButton: HTMLElement`- кнопка урны (удаление продукта).

Методы класса:

- `set index(value: number)` — изменяет индекс продукта;
- `set price(value: number)` — изменяет стоимость товара в корзине;
- `set title(value: string[])` — изменяет название продукта.


#### Класс AddressForm

Форма доставки. Наследуется от класса Form. Позволяет хранить и изменять данные при оформлении заказа.

Поля класса:

- `_onlinePaymentButton: HTMLButtonElement` — кнопка способа оплаты - Онлайн;
- `_cashPaymentButton: HTMLButtonElement` — кнопка способа оплаты - При получении

Методы класса:

- `set address(value: string)` — изменяет адрес доставки


#### ContactsForm

Форма контактных данных. Наследуется от класса Form. Позволяет хранить и изменять данные при оформлении заказа.

Поля класса:

- `_email: string` — email;
- `_phone: string` —  номер телефона;
- `_button: HTMLElement` — кнопка оплатить.

Методы класса:

- `set email(value: string)` — изменяет email в форме;
- `set phone(value: string)` — изменяет номер телефона в форме.


#### Класс SuccessOrder

Успешное оформление заказа.

Поля класса:

- `total: number` — элемент суммы заказа.
- `_close: HTMLElement` — элемент закрыть окно;

Методы класса:

- `set total(total: number)` — изменяет итоговую сумму заказа.

### Слой коммуникации

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой, находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список событий*

- `modal:open` — открытие модального окна;
- `modal:close` — закрытие модального окна;
- `success:open` — открытие модального окна успешно оформленного заказа;
- `success:close` — закрытие модального окна успешно оформленного заказа;
- `card:select` — выбор продукта(карточки) для отображения в модальном окне;
- `basketModal:open` — открытие модального окна корзины;
- `basket:changed` — изменение корзины;
- `basket:item-add` — добавление продукта в корзину;
- `basket:item-remove` — удаление продукта из корзины;
- `order:open` — открытие формы адреса и способа оплаты;
- `order:change` — изменение полей формы адреса и способа оплаты;
- `order:submit` — сохранение данных способа оплаты и формы адреса;
- `contacts:change` — изменение одного из полей формы контактов;
- `formErrorsAddress:change` — изменение состояния валидации способа оплаты и формы адреса;
- `formErrorsContacts:change` — изменение состояния валидации формы контактов;
- `items:changed` — изменение каталога карточек;
- `preview:changed` — изменение открытой карточки.