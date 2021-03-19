import { fhirclient } from "fhirclient/lib/types";
import { mappers } from "fhir-mapper";
import Client from "fhirclient/lib/Client";
import FHIR from "fhirclient";
import { ALL_RESOURCES_PATIENT_REFERENCE } from "./patient";
import env from "../env";

export const initSmartClient = (clientId?: string): Promise<void | string> => {
  return FHIR.oauth2.authorize({
    iss: env.FHIR_SERVER,
    clientId: clientId || env.CLIENT_SMART,
    scope: env.SCOPE,
  });
};

export const readySmartClient = (): Promise<Client> => {
  return FHIR.oauth2.ready();
};

const MapperClass = mappers.SyntheaToV09;
const mapperInstance = MapperClass ? new MapperClass() : null;

const applyMapping = (bundle: any) => {
  return mapperInstance && bundle ? mapperInstance.execute(bundle) : bundle;
};

function getEverything(client: Client) {
  return client
    .request(`/Patient/${client.patient.id}/$everything`, {
      flat: true,
      pageLimit: 0,
    })
    .then((bundle) => {
      return bundle;
    });
}

function getEverythingManually(client: Client, supportedResources: any) {
  supportedResources.push("Patient:_id");
  const requests: any = [];
  supportedResources.forEach((resource: string) => {
    const res = resource.split(":");
    const request = client
      .request(`${res[0]}?${res[1]}=${client.patient.id}`, {
        flat: true,
        pageLimit: 0,
      })
      .then((result) => (result.length > 0 ? result : null))
      .catch((error) => {
        console.log(`failed to fetch ${resource}`);
        console.error(error);
      });
    requests.push(request);
  });

  return Promise.all(requests).then((results) => {
    const bundle = results
      .filter((x) => {
        return x;
      })
      .flat();
    return bundle;
  });
}

/**
 * Uses the _revinclude FHIR search parameter to request the patient resource and any resource that refers to it.
 * The list of resources it checks is retrieved from the Capability Statement.  It is slightly better than the manual
 * method since it does everything in one request.
 */
function getEverythingRevInclude(
  client: Client,
  supportedResources: string[],
  onError: (client: Client, supportedResources: string[]) => void
) {
  const query = supportedResources.join("&_revinclude=");
  return client
    .request(`/Patient?_id=${client.patient.id}&_revinclude=${query}`, {
      flat: true,
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(
        "Reverse Include query failed, manually fetching resources instead."
      );
      console.error(error);
      onError(client, supportedResources);
    });
}

/**
 * There are slight discrepencies between the $everything, revinclude, and manual methods that affect the resources that might be returned
 * @param {Object} client - the fhir client
 */
function getPatientRecord(client: Client) {
  return client.request(`/metadata`).then((statement) => {
    return getEverything(client).then((bundle) => applyMapping(bundle));

    const supportedResources: string[] = [];
    let revIncludeResources: string[] = [];
    statement.rest[0].resource.forEach((resource: fhirclient.FHIR.Resource) => {
      if (resource.type === "Patient") {
        if (resource.searchRevInclude) {
          revIncludeResources = resource.searchRevInclude;
        }
      } else if (resource.searchInclude) {
        const filters = resource.searchInclude.filter((target: any) => {
          return (
            target === `${resource.type}:patient` ||
            target === `${resource.type}:subject`
          );
        });
        if (filters.length > 0) {
          supportedResources.push(filters[0]);
        }
      } else if (resource.searchParam) {
        const filters = resource.searchParams.filter((target: any) => {
          return target.name === `patient` || target.name === `subject`;
        });
        if (filters.length > 0) {
          supportedResources.push(`${resource.type}:${filters[0].name}`);
        }
      }
    });
    if (revIncludeResources.length > 0) {
      return getEverythingRevInclude(
        client,
        revIncludeResources,
        getEverythingManually
      ).then((bundle) => applyMapping(bundle));
    }
    if (supportedResources.length > 0) {
      return getEverythingRevInclude(
        client,
        supportedResources,
        getEverythingManually
      ).then((bundle) => applyMapping(bundle));
    }
    console.log(
      "Cannot use reverse includes, retrieving all resources manually from predefined list"
    );
    return getEverythingManually(
      client,
      ALL_RESOURCES_PATIENT_REFERENCE
    ).then((bundle) => applyMapping(bundle));
  });
}

/**
 * Uses the $everything operation.  The server takes care of constructing the bundle that gets returned, so
 * it is generally not possible to know how it is deciding what resources to send.
 */

/**
 * Uses regular FHIR search queries on every resource that is supported and can refer to a patient.
 * Which resources it queries is dependent on info available in the Capability Statement, and
 * it only provides a one layer deep search, so the results might be different from $everything.
 */

export { getPatientRecord };
