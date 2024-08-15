import { Api, ApiListResponse } from '../base/api';
import { IOrder, ICard ,IOrderResult,  } from '../../types';
import { IWebLarekAPI } from '../../types';

export class WebLarekAPI extends Api implements IWebLarekAPI {
	//получение url
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<ICard[]> {
		return this.get('/product/').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
