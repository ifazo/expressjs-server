export default interface IProduct {
  name: string;
  image: string;
  category: string;
  price: string;
  status: string;
  rating: number;
  description: string;
  features: Array<string>;
  date: Date;
}
