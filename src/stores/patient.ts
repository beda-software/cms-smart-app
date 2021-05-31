import { fhirclient } from "fhirclient/lib/types";
import { createDomain, createStore } from "effector";
import { WithClient, WithLoading } from "../lib/types";

const patientDomain = createDomain("patient");

export const fetchPatientFx = patientDomain.createEffect(
  async ({ client }: WithClient) => {
    return client?.request(`/Patient/${client.patient.id}`);
  }
);

export const fetchEobFx = patientDomain.createEffect(
  async ({ client, patient }: WithClient<{ patient: string }>) => {
    const response = await client?.request(
      `/ExplanationOfBenefit?patient=${patient}`
    );
    return response.entry?.map((r: any) => r.resource);
  }
);

export const resetData = patientDomain.createEvent();

export const $eob = createStore<WithLoading<any[]>>({ loading: true, data: [] })
  .on(fetchEobFx, () => {
    return { loading: true, data: [] };
  })
  .on(fetchEobFx.done, (_, data) => {
    return { loading: false, data: data.result };
  })
  .reset(resetData);

export const $patient = createStore<fhirclient.FHIR.Patient | null>(null)
  .on(fetchPatientFx.done, (_, data) => data.result)
  .reset(resetData);
