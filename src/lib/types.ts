import Client from "fhirclient/lib/Client";

export interface WithLoading<D = any> {
  loading: boolean;
  data: D;
}

export type WithClient<T = any> = { client: Client | null } & T;

export interface IUser {
  name: string;
  photo: string;
  email: string;
  address: { city: string }[];
}
