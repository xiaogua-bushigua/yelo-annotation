export interface stringObj {
	[key: string]: string;
}
interface numberObj {
	[key: string]: number;
}

export interface relationType {
	relationName: string;
	relatedEntities: Array<String>;
	addDisplay?: boolean;
	delDisplay?: boolean;
}

export interface initDataType {
	relationOverlap: number;
	entityOverlap: number;
	ids: Array<String>;
	entityNames: stringObj;
	entities: stringObj;
	text: string;
	relations: Array<relationType>;
}

interface baseConfigType {
	arcR: number;
	circleY: number;
	circleR: number;
	lineY: number;
	downOffset: number;
	textOffsetX: number;
	textOffsetY: number;
	relationOffsetY: number;
	baseHeight: number;
	downHeight: number;
}

export interface svgDataType {
	relationOverlap: number;
	entityOverlap: number;
	baseConfig: baseConfigType;
	html: string;
	originText: string;
	ids: Array<String>;
	entityNames: stringObj;
	relations: Array<relationType>;
}

export interface svgInfoType {
	lefts: numberObj;
	widths: numberObj;
	rights: numberObj;
  xOfEntity: numberObj;
	xOfRelation: Array<number>;
	yOfRelation: Array<number>;
	originalTextWidth: number;
	Ds1: Array<string>;
	Ds2: Array<string>;
	Ds3: Array<string>;
	pathHeights: Array<number>;
}

export interface entitiesInnerType {
	s: number;
	f: number;
	text: string;
	label: string;
}
export interface entitiesOuterType {
	e: number;
  entities: Array<entitiesInnerType>
}
