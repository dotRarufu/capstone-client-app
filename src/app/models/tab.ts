export interface Tab {
  name: string;
  id: string;
  handler: Function;
  active?: boolean;
}

export interface TabDefinition {
  name: string;
  id: string;
}
