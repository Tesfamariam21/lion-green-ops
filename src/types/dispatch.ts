// Complete Dispatch Record Type with full checklist details

export interface DispatchChecklist {
  // Electrical System
  batteryCharged: boolean;
  batteryVoltageTested: boolean;
  batteryVoltageReading?: string;
  chargerProvidedTested: boolean;
  wiringHarnessInspected: boolean;
  lightsFunctioning: boolean;
  hornWorking: boolean;
  displayOperational: boolean;

  // Mechanical Components
  tiresInflated: boolean;
  wheelNutsTightened: boolean;
  brakesTested: boolean;
  suspensionFunctioning: boolean;
  steeringAlignmentChecked: boolean;
  frameInspected: boolean;
  fastenersAndBoltsTightened: boolean;

  // Motor & VCU
  motorPerformanceTested: boolean;
  controllerFunctioning: boolean;
  speedTestPassed: boolean;
  noAbnormalNoises: boolean;

  // Documentation Pack
  invoiceIncluded: boolean;
  warrantyCardIncluded: boolean;
  userManualIncluded: boolean;

  // Accessories & Tools
  escortTire: boolean;
  toolkit: boolean;
  chargerAndCables: boolean;
  numberOfKeys?: number;

  // Transport Verification
  tricycleSecured: boolean;
  photographsTaken: boolean;
}

export interface DispatchRecord {
  id: string;
  // Basic Info
  serialNumber: string;
  model: string;
  variant: string;
  productionDate: string;
  productionSite: string;
  dispatchDate: string;
  destinationCity: string;
  customerName: string;
  
  // Transport Info
  transporterName: string;
  transporterContact: string;
  truckNumber: string;
  
  // Checklist
  checklist: DispatchChecklist;
  
  // Approval Info
  qcInspectorName: string;
  qcInspectorSignature?: string;
  dispatchManagerName?: string;
  dispatchManagerSignature?: string;
  dispatchDateTime?: string;
  
  // Status
  status: "pending" | "approved" | "rejected";
  notes?: string;
  createdAt: string;
}

export const createEmptyChecklist = (): DispatchChecklist => ({
  batteryCharged: false,
  batteryVoltageTested: false,
  batteryVoltageReading: "",
  chargerProvidedTested: false,
  wiringHarnessInspected: false,
  lightsFunctioning: false,
  hornWorking: false,
  displayOperational: false,
  tiresInflated: false,
  wheelNutsTightened: false,
  brakesTested: false,
  suspensionFunctioning: false,
  steeringAlignmentChecked: false,
  frameInspected: false,
  fastenersAndBoltsTightened: false,
  motorPerformanceTested: false,
  controllerFunctioning: false,
  speedTestPassed: false,
  noAbnormalNoises: false,
  invoiceIncluded: false,
  warrantyCardIncluded: false,
  userManualIncluded: false,
  escortTire: false,
  toolkit: false,
  chargerAndCables: false,
  numberOfKeys: 2,
  tricycleSecured: false,
  photographsTaken: false,
});
