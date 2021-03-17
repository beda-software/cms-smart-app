import { createDomain, createEvent, createStore } from "effector";
import { persist } from "effector-storage/local/fp";
import { initSmartClient, readySmartClient } from "../lib";
import env from "../env";

interface ISingInProps {
  username: string;
  password: string;
}

const authDomain = createDomain("auth");

export const signInFx = authDomain.createEffect(
  async ({ username, password }: ISingInProps) => {
    const response = await fetch(`${env.FHIR_SERVER}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "password",
        username,
        password,
        client_id: env.CLIENT_LOGIN,
      }),
    });
    const json = await response.json();
    if (json?.error) {
      return Promise.reject(json);
    }
    return json;
  }
);

export const getUserDataFx = authDomain.createEffect(async (token: string) => {
  const response = await fetch(`${env.FHIR_SERVER}/auth/userinfo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  if (json?.message) {
    return Promise.reject(json);
  }
  return json;
});

export const resetAuth = createEvent();

export const $token = authDomain
  .createStore<string>("", { name: "auth" })
  .on(signInFx.done, (_state, data) => data.result.access_token)
  .on(getUserDataFx.fail, () => "")
  .thru(persist({ key: "aidbox.login" }))
  .reset(resetAuth);

export const $user = createStore<any>({ loading: true, data: null })
  .on(getUserDataFx.done, (_, data) => {
    return { loading: false, data: data.result };
  })
  .reset(resetAuth);

export const initSmartClientFx = authDomain.createEffect(initSmartClient);
export const readySmartClientFx = authDomain.createEffect(readySmartClient);
export const fetchPatientFx = authDomain.createEffect(
  async ({ client, patient }: { client: any; patient: string }) => {
    return client.request(`/fhir/Patient/${patient}`);
  }
);

export const fetchEobFx = authDomain.createEffect(
  async ({ client, patient }: { client: any; patient: string }) => {
    const response = await client.request(
      `/fhir/ExplanationOfBenefit?patient=${patient}`
    );
    return response.entry?.map((r: any) => r.resource);
  }
);

export const $patient = createStore<any>(null).on(
  fetchPatientFx.done,
  (_, data) => {
    return data.result;
  }
);

export const $eob = createStore<any>({ loading: true, data: [] })
  .on(fetchEobFx, () => {
    return { loading: true, data: [] };
  })
  .on(fetchEobFx.done, (_, data) => {
    return { loading: false, data: data.result };
  });

export const $client = createStore<any>(null)
  .on(readySmartClientFx.done, (_, data) => data.result)
  .reset(resetAuth);

export const $clientAuth = createStore<any>(true)
  .on(initSmartClientFx.done, (state) => {
    return true;
  })
  .thru(persist({ key: "aidbox.grant" }))
  .reset(resetAuth);

$client.watch((state) => {});

$clientAuth.watch((state) => {
  if (state) {
    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) {
      readySmartClientFx();
    }
  }
});

$token.watch((state) => {
  if (state) {
    getUserDataFx(state);
  }
});
