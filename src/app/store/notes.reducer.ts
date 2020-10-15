import { ActionReducer } from "@ngrx/store";
import Cookies from "js-cookie";

import {
  ADD_NOTE,
  DELETE_NOTE,
  UNDO_ADD_NOTE,
  UNDO_DELETE_NOTE,
  UNDO_UPDATE_NOTE,
  UPDATE_NOTE
} from "./notes.actions";

let notesList = Cookies.getJSON("ngrx-notes");

export const initialNotesData = {
  notesList: notesList ? notesList : []
};

export const notesReducer: ActionReducer<any> = (
  state = initialNotesData,
  action
) => {
  switch (action.type) {
    case ADD_NOTE: {
      let notesList = [...state.notesList];
      // @ts-ignore
      notesList.push(action.note);
      // notesList.shift();
      Cookies.set("ngrx-notes", notesList, { expires: 3 });
      state = Object.assign({}, state, { notesList });
      return state;
    }
    case UPDATE_NOTE: {
      let notesList = [...state.notesList];
      // @ts-ignore
      notesList[action.note.index] = action.note;
      Cookies.set("ngrx-notes", notesList, { expires: 3 });
      state = Object.assign({}, state, { notesList });
      return state;
    }
    case DELETE_NOTE: {
      let notesList = [...state.notesList];
      // @ts-ignore
      notesList.splice(action.index, 1);
      Cookies.set("ngrx-notes", notesList, { expires: 3 });
      state = Object.assign({}, state, { notesList });
      return state;
    }
    case UNDO_ADD_NOTE: {
      let notesList = [...state.notesList];
      // @ts-ignore
      notesList.pop();
      Cookies.set("ngrx-notes", notesList, { expires: 3 });
      state = Object.assign({}, state, { notesList });
      return state;
    }
    case UNDO_UPDATE_NOTE: {
      let notesList = [...state.notesList];
      // @ts-ignore
      // @ts-ignore
      notesList[action.note.index] = action.note;
      Cookies.set("ngrx-notes", notesList, { expires: 3 });
      state = Object.assign({}, state, { notesList });
      return state;
    }
    case UNDO_DELETE_NOTE: {
      let notesList = [...state.notesList];
      // @ts-ignore
      notesList.splice(action.note.index, 0, action.note);
      Cookies.set("ngrx-notes", notesList, { expires: 3 });
      state = Object.assign({}, state, { notesList });
      return state;
    }
    default:
      return state;
  }
};
