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

export declare enum SourceType {
  SOURCE_TYPE_ORIGIN = 0,
  SOURCE_TYPE_BSC_CROSS_CHAIN = 1,
  SOURCE_TYPE_MIRROR_PENDING = 2,
  UNRECOGNIZED = -1,
}

export interface GroupInfo {
  /** owner is the owner of the group. It can not changed once it created. */
  owner: string;
  /** group_name is the name of group which is unique under an account. */
  groupName: string;
  /** source_type */
  sourceType: SourceType;
  /** id is the unique identifier of group */
  id: string;
  /** extra is used to store extra info for the group */
  extra: string;
}

export interface IHeadGroup {
  groupInfo?: GroupInfo;
}
