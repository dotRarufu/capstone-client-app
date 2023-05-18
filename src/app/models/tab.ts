export interface Tab {
  name: string;
  id: string;
  handler: Function;
  active?: boolean;
}
