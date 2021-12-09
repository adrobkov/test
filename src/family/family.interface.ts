type GenderType = 'FEMALE' | 'MALE';
export type ParentType = [] | [number] | [number, number];

export interface FamilyInterface {
  id: number;
  name: string;
  gender: GenderType;
  parents: ParentType;
}

export interface GenusInterface {
  id: number;
  genus: number[];
  generation: number[];
  level: number;
  incest: boolean;
}
