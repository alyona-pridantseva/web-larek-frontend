import { Model } from "./base/Model";
import { IProductItem, IAppState} from '../types/index';




export class AppState extends Model<IAppState> {

}

export class Product extends Model<IProductItem> {
  id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}


