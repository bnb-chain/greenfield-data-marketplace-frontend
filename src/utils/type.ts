export interface IRawSPInfo {
  approvalAddress: string;
  endpoint: string;
  fundingAddress: string;
  gcAddress: string;
  operatorAddress: string;
  sealAddress: string;
  status: number;
  totalDeposit: string;
  description: {
    details: string;
    identity: string;
    moniker: string;
    securityContact: string;
    website: string;
  };
}

export enum VisibilityType {
  VISIBILITY_TYPE_UNSPECIFIED = 0,
  VISIBILITY_TYPE_PUBLIC_READ = 1,
  VISIBILITY_TYPE_PRIVATE = 2,
  /** VISIBILITY_TYPE_INHERIT - If the bucket Visibility is inherit, it's finally set to private. If the object Visibility is inherit, it's the same as bucket. */
  VISIBILITY_TYPE_INHERIT = 3,
  UNRECOGNIZED = -1,
}
