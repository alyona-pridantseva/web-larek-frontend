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

Интерфейс, описывающий состояние страницы

```
interface IAppState {
  catalog: IProductItem[];
  basket:  string[];
  order: IOrder | null; // описание заказа
  preview: string | null; // указатель той карточки, которую хотим посмотреть(id) т.е идентификатор товара для предпросмотра
}
```

Интерфейс главной страницы

```
interface IPage {
  counter: number;
  catalog: HTMLElement[];
}
```

Интерфейс, описывающий форму

```
interface IFormState {
  valid: boolean;
  errors: string[];
}
```

Интерфейс карточки

```
interface ICard {
  title: string;
  description: string;
  id: string;
  price: number | null;
  category: string;
  image: string;
  index?: number;
  buttonName?: string;
}
```

Интерфейс отображения корзины

```
interface IBasketView {
  total: number; // общая сумма заказа
  items: HTMLElement[];
  button: string[];
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

Интерфейс данных заказа

```
interface IOrder extends IAddressForm, IContactsForm {
  items: string[]; // Список товаров
  total: number;
}
```

Интерфейс валидации формы покупателя

```
type FormErrors = Partial<Record<keyof IOrderPerson, string>>;
```

Интерфейс результата оформления заказа

```
interface IOrderResult {
  id: string[]; // идентификатор заказа
  total: number;
}
```

Интерфейс модального окна

```
interface IModalData {
  content: HTMLElement;
}
```

Интерфейс успешно оформленного заказа

```
interface ISuccess {
  total: number;
}
```

Интерфейс действий успешной покупки
```
interface ISuccessActions {
  onClick: () => void;
}
```

Интерфейс действий карточки
```
interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}
```

Интерфейс данных

```
interface IWebLarekAPI {
  getProductList: () => Promise<ICard[]>; //получение списка карточек с сервера
  getProductItem: (id: string) => Promise<ICard>; //получение информации карточки продукта
  orderProducts: (order: IOrder) => Promise<IOrderResult>; //отправка информации на сервер
}
```

Интерфейс изменения каталога
```
type CatalogChangeEvent = {
  catalog: ICard[];
};
```


Интерфейс проверки введенных данных и их хранение в форме
```
interface IAppForm {
  IOrderPerson: IOrderPerson;
  formErrors: FormErrors;
}
```

Интерфейс описывающий данные адреса и контакты
```
export type IOrderPerson = IAddressForm & IContactsForm;
```

### Базовый код. Директория base.

#### Класс Api

Используется для работы с сервером. Содержит в себе базовую логику отправки запросов.

Методы:

- `handleResponse(responce: Responce)` — обрабатывает ответ сервера
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове

В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

- `constructor(baseUrl: string, options: RequestInit = {})`

#### Класс EventEmitter

Обеспечивает работу брокера событий. Даёт возможность самим генирировать событие и на эти события подписываться. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - установка слушателя(реагировать на событие);
- `emit` - запуск события(генерировать на событие);
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие;
- `off` - cнять обработчик с события;
- `onAll` - cлушать все события;
- `offAll` - cбросить все обработчики.

Конструктор класса:

`constructor() { this._events = new Map<EventName, Set<Subscriber>>() }`— задает свойство `_events`, которое использует `Map` для хранения обработчиков событий (ключ — имя события, значение — функции-обработчики).

#### Класс Component

Класс отвечает за работу с HTML-элементом. Позволяет управлять поведением и внешним видом элемента.

Конструктор класса:

`constructor(protected readonly container: HTMLElement) {}` — принимает элемент контейнера — container.

Методы:

- `toggleClass`- переключает класс элемента;
- `setText`- устfнавливает текстовое содержимое элемента;
- `setDisabled`- меняет статус блокировки;
- `setHidden`- скрывает элемент;
- `setVisible`- показывает элемент;
- `setImage`- устанавливает изображение с альтернативным тексом;
- `render`- возвращает корневой DOM-элемент.

#### Класс Model

Применяется для создания модели данных. Используется в качестве базового для других классов, которые будут наследовать его и расширять функциональность.

Конструктор класса:

`constructor(data: Partial<T>, protected events: IEvents)` — принимает объект с данными и экземпляр IEvents для работы с событиями.

### Общие компоненты. Директория common.

В директории `common` размещаются те классы, которые являются родительскими для других, т.е которые переиспользуются для создания других классов.

#### Класс Form

Класс позволяет описать и реализовать работу с формами. Расширяет базовый абстрактный класс `Component` по интерфейсу `IFormState`

Поля класса:

- `protected _submit: HTMLButtonElement` — элемент кнопки подтверждения формы(отправка).
- `protected _errors: HTMLElement` — ошибка при отправке формы.

Методы класса:

- `set errors(value: string)` — если поле невалидно, сообщает об ошибке в виде текста;
- `set valid(value: boolean)` — управляет состоянием кнопки при заполнении формы;
- `render` — рендер формы.

#### Класс Modal

Класс управляет отображением модального окна. Расширяет базовый абстрактный класс `Component` по интерфейсу `IModalData`.

Поля класса:

- `protected _content: HTMLElement` — наполнение(контент или содержимое);
- `protected _closeButton: HTMLButtonElement;` — кнопка(элемент) закрытия модального окна.

Методы:

- `set content` - изменяет внутренность(контент) модального окна;
- `open` - открывает модальное окно;
- `close` - закрывает модальное окно;
- `render(data: IModalData): HTMLElement` - рендер модального окна.

### Модель данных. Директория logic

#### Класс AppState

Класс хранит данные приложения, следовательно можно отслеживать изменения.
Наследуется от класса `Model` по интерфейсу `IAppState`.

Поля класса:

- `catalog: ICard[]` - список продуктов;
- `basket: ICard[] = []` - список продуктов в корзине;
- `order: IOrder | null` - описание заказа;
- `preview: string | null` - указатель той карточки, которую хотим посмотреть(id) т.е идентификатор товара для предпросмотра.

Методы класса:

- `setCatalog(items: ICard[])` - каталог карточек(массив);
- `updateCardsBasket()` - обновление состояния корзины;
- `clearBasket()` - очиcтка всей корзины;
- `addToBasket(item: ICard)` - добавление продукта в корзину;
- `removeFromBasket(item: ICard)` - удаление продукта из корзины;
- `getTotal()` - суммарная стоимость заказа в корзине;
- `setPreview(item: ICard)` - показывает продукт в модальном окне;
- `clearDataOrder()` - очистка данных о заказе(кэш)

#### Класс AppForm

Класс ответственен за проверку введенных данных и их хранение. Наследуется от класса `Model` по интерфейсу `IAppForm`.

Поля класса:

- `orderPerson: IOrderPerson` - информация о доставке и контактных данных покупателя
- `formErrors: FormErrors` - ошибка формы.

Поля класса:

- `clearDataOrder()` - очистка данных;
- `setContactsField(field: keyof IContactsForm, value: string)` - устанавливает значения для формы с контактами;
- `setAddressField(field: keyof IAddressForm, value: string)` - устанавливает значения для формы способа оплаты и формы адреса доставки;
- `validateAddress()` - валидация формы способа оплаты и формы адреса доставки;
- `validateContacts()` - валидация формы с контактами.

#### Класс WebLarekApi

Класс ответственен за получение данных об одном и всех товарах, и оформления заказа. Наследуется от класса `Api` по интерфейсу `IWebLarekAPI`.

Поля класса:

-`readonly cdn: string` - получение url.

Поля класса:

- `getProductItem(id: string): Promise<ICard>` - получить информацию о товаре;
- `getProductList(): Promise<ICard[]>` - получить список карточек с сервера;
- `orderProducts(order: IOrder): Promise<IOrderResult>` - отправка данных на сервер.

### Модель отображения. Директория view

#### Класс Card

Ответственен за отображение карточки продукта в проекте. Расширяет базовый абстрактный класс `Component` по интерфейсу `ICard`.

Поля класса:

- `protected _title: HTMLElement` — название товара;
- `protected _description: HTMLElement` — описание товара;
- `protected _price: HTMLElement` — цена продукта;
- `protected _category: HTMLElement` — категория товара;
- `protected _image?: HTMLImageElement` — изображение товара;
- `protected _index: HTMLElement` — индекс продукта в корзине;
- `protected _button: HTMLButtonElement` - кнопка действия;
- `protected _buttonName?: string;` — текст кнопки.

Методы класса:

- `set id(value: string)` — установить id;
- `get id(): string` — получить id;
- `set buttonName(value: string)` — установить название на кнопке;
- `buttonVisibility(value: number | null)` — если товар бесценен, кнопка неактивна;
- `set title(value: string)` — установить название продукта;
- `get title(): string` — получить название продукта;
- `set index(value: string)` — установить индекс;
- `get index(): string` — получить индекс;
- `set image(value: string)` — установить изображение продукта;
- `set price(value: number | null)` - установить цену;
- `get price(): number` - получить цену;
- `set description(value: string | string[])` - установить описание;
- `set category(value: string)` - установить категорию;
- `get category(): string` - получить категорию.

#### Класс Page

Ответственен за формирование главной страницы.
Расширяет базовый абстрактный класс `Component` по интерфейсу `IPage`.

Поля класса:

- `protected _counter: HTMLElement` — счетчик, количество добавленных продуктов в корзину;
- `protected _catalog: HTMLElement` — каталог;
- `protected _wrapper: HTMLElement` — обертка страницы;
- `protected _basket: HTMLElement` - корзина.

Методы класса:

- `set counter(value: number)` - установить счестчик на продукты в корзине;
- `set catalog(items: HTMLElement[])`- установить католог;
- `set locked(value: boolean)` — изменяет(активирует) блокировку страницы при открытом модальном окне.

#### Класс Basket:

Ответственен за отображение содержимого корзины и предоставляет методы для управления содержимым. Расширяет базовый абстрактный класс `Component` по интерфейсу `IBasketView`.

Поля класса:

- `protected _list: HTMLElement` — список продуктов в корзине;
- `protected _total: HTMLElement` — элемент общей суммы заказа в корзине;
- `protected _button: HTMLElement` — элемент кнопка оформления(подтверждения).

Методы класса:

- `set items(items: HTMLElement[])` — установка продуктов;
- `set selected(items: number)` — включение и выключение видимости кнопки;
- `set total(total: number)` - устновить итоговую сумму.

#### Order

#### Класс AddressForm

Форма доставки. Позволяет хранить и изменять данные при оформлении заказа. Наследуется от класса `Form` по интерфейсу `IAddressForm`.

Поля класса:

- `protected _onlineButton: HTMLButtonElement` — кнопка способа оплаты - Онлайн;
- `protected _cashButton: HTMLButtonElement` — кнопка способа оплаты - При получении
- `protected _addressInput: HTMLInputElement` - инпут адреса достаки.

Методы класса:

- `set addressInput(value: string)` — установить адрес доставки

#### ContactsForm

Форма контактных данных. Позволяет хранить и изменять данные при оформлении заказа. Наследуется от класса `Form` по интерфейсу `IContactsForm`.

Поля класса:

- `protected _emailInput: HTMLInputElement` — инпут email;
- `protected _phoneInput: HTMLInputElement` — инпут номер телефона.

Методы класса:

- `set phone(value: string)` — устновить email;
- `set email(value: string)` — устновить номер телефона.

#### Класс Success

Успешное оформление заказа. Расширяет базовый абстрактный класс `Component` по интерфейсу `ISuccess`

Поля класса:

- `protected _close: HTMLElement` — элемент закрыть окно.
- `protected _pricePurchasesTotal: HTMLElement` — элемент текста с ценой;

Методы класса:

- `set total(value: string)` — установить итоговую сумму заказа.

### Слой коммуникации

#### Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой, находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список событий_

- `card:select` - выбор карточки;
- `basket:open` - открытие корзины;
- `card:selected` - открытие карточки для превью;
- `preview:changed` - изменения превью;
- `basket:changed` - изменения корзины;
- `card:delete` - удаление продукта из корзины;
- `counter:changed` - изменения счетчика;
- `address:open` - открытие формы адреса и способа оплаты;
- `contacts:open` - открытие формы с контактами;
- `formErrors:change` - изменение ошибок;
- `contacts:change` - изменения полей контактов;
- `address:change` - изменение поля адреса;
- `address:ready` - форма адреса перед отправкой;
- `address:submit` - отправка формы с адресом;
- `contacts:ready` - форма с контактами перед отправкой;
- `contacts:submit` - отправка формы с контактами;
- `success:open` - открытие модального окна успешкой покупки;
- `modal:open` - открытие модального окна;
- `modal:close` - закрытие модального окна
