import Client from "fhirclient/lib/Client";
import React, { useCallback } from "react";
import FHIR from "fhirclient";

export const SmartContext = React.createContext<{
  smartClient: Client | null;
  smartUser?: any;
}>({ smartClient: null });

export const initSmartClient = (): Promise<Client> =>
  FHIR.oauth2.init({
    iss: process.env.REACT_APP_SERVER_URL,
    clientId: process.env.REACT_APP_CLIENT_ID,
    scope: "openid fhirUser user/read.*",
    redirectUri: "http://localhost:3000",
  });

export type TSmartRequestFn = (promise: Promise<any>) => any;

export const useSmartRequest = <D = any>(): [
  TSmartRequestFn,
  { loading: boolean; data: D | null; smartClient: Client | null }
] => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<D | null>(null);
  const { smartClient } = React.useContext(SmartContext);
  const smartRequest: TSmartRequestFn = (promise) => {
    if (!smartClient) {
      return;
    }
    setLoading(true);
    // eslint-disable-next-line consistent-return
    return promise.then((dataD: any) => {
      setData(dataD);
      setLoading(false);
      return dataD;
    });
  };
  return [
    smartRequest,
    {
      loading,
      data,
      smartClient,
    },
  ];
};

export const useSmartSearch = <D = any>(
  resourceType: string
): { loading: boolean; data: null | D[]; refetch: () => void } => {
  const [smartRequest, { loading, data }] = useSmartRequest<D[]>();
  const { smartClient } = React.useContext(SmartContext);

  const smartSearch = useCallback(() => {
    if (!smartClient) {
      return;
    }
    const promise = smartClient
      .request(`/${resourceType}`)
      .then((res) => res.entry.map((entry: any) => entry.resource));
    // eslint-disable-next-line consistent-return
    return smartRequest(promise);
  }, [resourceType, smartClient, smartRequest]);

  React.useEffect(() => {
    smartSearch();
  }, [smartClient, smartSearch]);

  if (!smartClient) {
    return { loading: true, data: null, refetch: smartSearch };
  }

  return { loading, data, refetch: smartSearch };
};

export type TSmartCreateFn<D> = (body?: any) => Promise<D>;

export const useSmartCreate = <D>(
  resourceType: string
): [TSmartCreateFn<D>, { data: D | null; loading: boolean }] => {
  const [smartRequest, { loading, data, smartClient }] = useSmartRequest<D>();

  const smartCreate: TSmartCreateFn<D> = async (body?: any) => {
    if (!smartClient) {
      return;
    }
    const promise = smartClient.create({ resourceType, ...body });
    // eslint-disable-next-line consistent-return
    return smartRequest(promise);
  };

  return [smartCreate, { loading, data }];
};

export type TSmartDeleteFn = (resourceId?: string) => Promise<void>;

export const useSmartDelete = (
  resourceType: string
): [TSmartDeleteFn, { data: any; loading: boolean }] => {
  const [smartRequest, { loading, data, smartClient }] = useSmartRequest();

  const smartDelete: TSmartDeleteFn = async (resourceId?: string) => {
    if (!smartClient) {
      return;
    }
    const url = resourceId
      ? `/${resourceType}/${resourceId}`
      : `${resourceType}`;
    const promise = smartClient.delete(url);
    // eslint-disable-next-line consistent-return
    return smartRequest(promise);
  };

  return [smartDelete, { loading, data }];
};

export const useSmartUser = () => {
  const { smartUser } = React.useContext(SmartContext);
  return smartUser;
};
