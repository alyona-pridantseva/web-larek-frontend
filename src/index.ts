import './scss/styles.scss';


import { EventEmitter } from './components/base/events';
import { CDN_URL, API_URL } from './utils/constants';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Success } from './components/common/Success';
// import {Page} from "./components/Page";
// import { WebLarekAPI } from './components/WebLarekApi';


const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Все шаблоны


// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);