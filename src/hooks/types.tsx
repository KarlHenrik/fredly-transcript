export interface Cell {
  text: string;
  time: string;
  speaker: Speaker | null;
  ID: number | null;
  similarity: number | null;
}

export interface ProtoCell {
  text: string;
  time: string;
  speaker_name: string;
}

export interface Speaker {
  name: string;
  color: string;
}

export interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export interface State {
  contents: Cell[];
  speakers: Speaker[];
  copiedCell: Cell | null;
  prevfocus: number | null;
  newfocus: number | null;
}

export interface CompactState {
  contents: Cell[];
  focus: number | null;
}

export enum View {
  Standard,
  Compact,
  Editing,
}