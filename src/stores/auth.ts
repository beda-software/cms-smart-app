import { createDomain, createEvent, createStore } from "effector";
import Client from "fhirclient/lib/Client";
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
      headers: { "Content-Type": "application/json" },
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

export const $client = createStore<any>({
  auth: false,
  client: null,
})
  .on(initSmartClientFx.done, (state) => {
    return { ...state, auth: true };
  })
  .on(readySmartClientFx.done, (_, data) => {
    return { auth: true, client: data.result };
  })
  .reset(resetAuth);

$client.watch((state) => {
  const url = new URL(window.location.href);
  if (url.searchParams.get("code")) {
    readySmartClientFx();
  }
});

$token.watch((state) => {
  if (state) {
    getUserDataFx(state);
  }
});
