import { createDomain, createEvent, createStore } from "effector";
import Client from "fhirclient/lib/Client";
import { persist } from "effector-storage/local/fp";
import { initSmartClient } from "../lib";
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

export const smartLaunchFx = authDomain.createEffect(
  async (patient: string) => {
    const formData = new FormData();
    formData.append("patientId", patient);
    formData.append("scope", "launch");
    formData.append("clientId", env.CLIENT_SMART);
    const response = await fetch(`${env.FHIR_SERVER}/smart/launch`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (json?.link) {
      return json;
    }
    return Promise.reject(json);
  }
);

export const resetAuth = createEvent();

export const $token = authDomain
  .createStore<string>("", { name: "auth" })
  .on(signInFx.done, (_state, data) => data.result.access_token)
  .on(getUserDataFx.fail, () => "")
  .thru(persist({ key: "aidbox.login" }))
  .reset(resetAuth);

export const $user = createStore<any>({ loading: true, data: null })
  .on(getUserDataFx.done, (_, data) => {
    return { loading: false, data: data.result, fhir: null };
  })
  .on(smartLaunchFx.done, (state, data) => {
    const url = new URL(data.result.link);
    const user = state.data;
    const link = user?.link.find((l: any) => l.link.resourceType === "Patient");
    return {
      ...state,
      fhir: {
        patientId: link.link.id,
        iss: url.searchParams.get("iss"),
        launch: url.searchParams.get("launch"),
      },
    };
  })
  .reset(resetAuth);

const initSmartClientFx = authDomain.createEffect(initSmartClient);

export const $client = createStore<null | Client>(null).on(
  initSmartClientFx.done,
  (state, { result: client }) => {
    console.log("fsdfs", client);
    return client;
  }
);

$user.watch((state) => {
  if (state.fhir) {
    initSmartClientFx(state.fhir);
  }
});

$token.watch((state) => {
  if (state) {
    getUserDataFx(state);
  }
});
