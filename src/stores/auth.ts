import { createDomain, createEvent, createStore } from "effector";
import { persist } from "effector-storage/local/fp";
import Client from "fhirclient/lib/Client";
import { initSmartClient, readySmartClient } from "../lib";
import { WithLoading } from "../lib/types";
import env from "../env";

interface ISingInProps {
  username: string;
  password: string;
}

const authDomain = createDomain("auth");

export const signInFx = authDomain.createEffect(
  async ({ username, password }: ISingInProps) => {
    const response = await fetch(`${env.URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "password",
        username,
        password,
        client_id: env.LOGIN,
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
  const response = await fetch(`${env.URL}/auth/userinfo`, {
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
export const setClientFromStorage = authDomain.createEvent<any>();

export const initSmartClientFx = authDomain.createEffect(initSmartClient);
export const readySmartClientFx = authDomain.createEffect(readySmartClient);

export const $token = authDomain
  .createStore<string>("", { name: "auth" })
  .on(signInFx.done, (_state, data) => data.result.access_token)
  .on(getUserDataFx.fail, () => "")
  .thru(persist({ key: "aidbox.login" }))
  .reset(resetAuth);

export const $user = createStore<WithLoading>({
  loading: true,
  data: null,
})
  .on(getUserDataFx.done, (_, data) => {
    return { loading: false, data: data.result };
  })
  .reset(resetAuth);

export const $client = authDomain
  .createStore<Client | null>(null)
  .on(readySmartClientFx.done, (_, data) => {
    return data.result;
  })
  .on(setClientFromStorage, (_, data) => {
    return data;
  })
  .reset(resetAuth);

export const $clientAuth = authDomain
  .createStore<boolean>(false)
  .on(initSmartClientFx.done, () => true)
  .thru(persist({ key: "aidbox.grant" }))
  .reset(resetAuth);

$clientAuth.watch((state) => {
  if (!state) return null;
  return true;
  //
  // const url = new URL(window.location.href);
  // return url.searchParams.get("code") ? readySmartClientFx() : null;
});

$user.watch((state) => {
  if (!state.loading && state.data.patient) {
    const smartKey = sessionStorage.getItem("SMART_KEY");
    if (smartKey) {
      const client = sessionStorage.getItem(smartKey.replaceAll('"', ""));
      if (client) {
        readySmartClientFx();
      }
    }
  }
});

$token.watch((state) => (state ? getUserDataFx(state) : null));
