/* eslint-disable */
declare module "fhir-visualizers" {
  import { Component } from "react";
  import { fhirclient } from "fhirclient/lib/types";
  import Patient = fhirclient.FHIR.Patient;

  type PatientVisualizerProps = {
    patient: Patient;
  };

  type RowProps = {
    rows: ReadonlyArray<any>;
  };

  export class PatientVisualizer extends Component<PatientVisualizerProps> {}
  export class ConditionsVisualizer extends Component<RowProps> {}
  export class CarePlansVisualizer extends Component<RowProps> {}
  export class EncountersVisualizer extends Component<RowProps> {}
  export class ImmunizationsVisualizer extends Component<RowProps> {}
  export class MedicationsVisualizer extends Component<RowProps> {}
  export class ObservationsVisualizer extends Component<RowProps> {}
  export class ProceduresVisualizer extends Component<RowProps> {}
  export class ReportsVisualizer extends Component<RowProps> {}
  export class AllergiesVisualizer extends Component<RowProps> {}
}
