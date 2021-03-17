import { createDomain, createStore } from "effector";
import { WithLoading } from "./types";

const patientDomain = createDomain("patient");

export const fetchPatientFx = patientDomain.createEffect(
  async ({ client, patient }: { client: any; patient: string }) => {
    return client.request(`/fhir/Patient/${patient}`);
  }
);

export const fetchEobFx = patientDomain.createEffect(
  async ({ client, patient }: { client: any; patient: string }) => {
    const response = await client.request(
      `/fhir/ExplanationOfBenefit?patient=${patient}`
    );
    return response.entry?.map((r: any) => r.resource);
  }
);

export const $eob = createStore<WithLoading<any[]>>({ loading: true, data: [] })
  .on(fetchEobFx, () => {
    return { loading: true, data: [] };
  })
  .on(fetchEobFx.done, (_, data) => {
    return { loading: false, data: data.result };
  });

export const $patient = createStore<any>(null).on(
  fetchPatientFx.done,
  (_, data) => data.result
);
