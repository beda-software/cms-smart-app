import { createDomain, createEvent, createStore } from "effector";
import { persist } from "effector-storage/local/fp";

interface ISingInProps {
  username: string;
  password: string;
}

const authDomain = createDomain("auth");

export const signInFx = authDomain.createEffect(
  async ({ username, password }: ISingInProps) => {
    const response = await fetch(
      "https://narkotrolltest.edge.aidbox.app/auth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "password",
          username,
          password,
          client_id: "smart-login",
        }),
      }
    );
    const json = await response.json();
    if (json?.error) {
      return Promise.reject(json);
    }
    return json;
  }
);

export const getUserDataFx = authDomain.createEffect(async (token: string) => {
  const response = await fetch(
    "https://narkotrolltest.edge.aidbox.app/auth/userinfo",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
    formData.append("clientId", "web-app");
    const response = await fetch(
      "https://narkotrolltest.edge.aidbox.app/smart/launch",
      {
        method: "POST",
        body: formData,
      }
    );
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
  .reset(resetAuth)
  .thru(persist({ key: "aidbox.login" }));

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

$user.watch((state) => {
  if (!state.loading && !state.fhir) {
    const user = state.data;
    const link = user?.link.find((l: any) => l.link.resourceType === "Patient");
    if (link) {
      smartLaunchFx(link.link.id);
    }
  }
});

$token.watch((state) => {
  if (state) {
    getUserDataFx(state);
  }
});
