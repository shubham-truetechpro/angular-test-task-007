export const ADD_NOTE = "ADD_NOTE";
export const UPDATE_NOTE = "UPDATE_NOTE";
export const DELETE_NOTE = "DELETE_NOTE";
export const UNDO_ADD_NOTE = "UNDO_ADD_NOTE";
export const UNDO_UPDATE_NOTE = "UNDO_UPDATE_NOTE";
export const UNDO_DELETE_NOTE = "UNDO_DELETE_NOTE";

export const addNote = (note: { text: any; time: Date; noteBadge: any }) => ({
  type: ADD_NOTE,
  note
});

export const updateNote = (note: any) => ({
  type: UPDATE_NOTE,
  note
});

export const deleteNote = (index: any) => ({
  type: DELETE_NOTE,
  index
});

export const undoAddNote = (index: any) => ({
  type: UNDO_ADD_NOTE,
  index
});

export const undoUpdateNote = (note: any) => ({
  type: UNDO_UPDATE_NOTE,
  note
});

export const undoDeleteNote = (note: any) => ({
  type: UNDO_DELETE_NOTE,
  note
});
