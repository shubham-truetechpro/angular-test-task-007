import { Component, OnInit, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  addNote,
  updateNote,
  deleteNote,
  undoAddNote,
  undoUpdateNote,
  undoDeleteNote
} from "./store/notes.actions";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

export interface DialogData {
  edited: any;
  index: any;
  text: string;
  name: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  animal: string;
  name: string;

  ngOnInit() {
    this.handleNotesVisibility("all");
  }

  notes$: Observable<number>;

  constructor(
    private store: Store<{ notes: any }>,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    // TODO: This stream will connect to the current store `notes` state
    this.notes$ = store.select("notes");
  }

  title = "NgRx-Notes-App";
  isChalkboardInUse: boolean = false;
  noteEditor: any;
  notesList: any = [];
  filteredNotesList: any;
  lastAction: any;

  createNote(noteBadge) {
    if (this.noteEditor === undefined || this.noteEditor.trim() === "") {
      return;
    }
    this.isChalkboardInUse = !this.isChalkboardInUse;
    let note = { text: this.noteEditor, time: new Date(), noteBadge };
    this.store.dispatch(addNote(note));
    this.notes$.subscribe(e => {
      // @ts-ignore
      this.noteEditor = "";
    });
    this.showSnackBar("Note Added", "UNDO");
  }

  showSnackBar(message: string, action: string) {
    if (message === "Note Added") {
      let snackBarRef = this._snackBar.open(message, action, {
        duration: 2000
      });
      snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(undoAddNote(null));
      });
    } else if (message === "Note Updated") {
      let snackBarRef = this._snackBar.open(message, action, {
        duration: 2000
      });
      snackBarRef.onAction().subscribe(() => {
        if (this.lastAction.type === "update") {
          this.store.dispatch(undoUpdateNote(this.lastAction.note));
        }
      });
    } else if (message === "Note Deleted") {
      let snackBarRef = this._snackBar.open(message, action, {
        duration: 2000
      });
      snackBarRef.onAction().subscribe(() => {
        if (this.lastAction.type === "delete") {
          this.store.dispatch(undoDeleteNote(this.lastAction.note));
        }
      });
    }
  }

  getFormattedDate(date) {
    const months = [
      "Jan",
      "Fab",
      "Mar",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    let d = new Date(date);
    let monthName = months[d.getMonth()];
    let year = d.getFullYear();
    return monthName + " " + d.getDate() + " " + year;
  }

  handleNotesVisibility(visibleNotesType: any) {
    this.notes$.subscribe(e => {
      // @ts-ignore
      this.notesList = e.notesList;
      if (visibleNotesType === "all") {
        this.filteredNotesList = this.notesList;
      } else {
        this.filteredNotesList = this.notesList.filter(e => {
          return e.noteBadge === visibleNotesType;
        });
      }
    });
  }

  openDialog(text, index): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: { text, index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.type === "update") {
        this.updateNote(result.data);
      }
      if (result.type === "delete") {
        this.deleteNote(result.index);
      }
    });
  }

  private updateNote(data: any) {
    let note = {
      text: data.text,
      time: data.time,
      noteBadge: data.noteBadge,
      index: data.index
    };
    this.lastAction = Object.assign(
      {},
      { type: "update", note: this.notesList[data.index] }
    );
    this.store.dispatch(updateNote(note));
    this.notes$.subscribe(e => {
      // @ts-ignore
      this.noteEditor = "";
    });
    this.showSnackBar("Note Updated", "UNDO");
  }

  private deleteNote(index: any) {
    let note = Object.assign({}, this.notesList[index], { index });
    this.lastAction = Object.assign({}, { type: "delete", note });
    this.store.dispatch(deleteNote(index));
    this.showSnackBar("Note Deleted", "UNDO");
  }
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "dialog-overview-example-dialog.html"
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  updateNote(noteBadge: string) {
    // @ts-ignore
    let text = document.getElementById("noteUpdateEditor").value;
    let obj = {
      text,
      noteBadge,
      time: new Date(),
      index: this.data.index
    };
    this.dialogRef.close({ type: "update", data: obj });
  }

  deleteNote() {
    this.dialogRef.close({ type: "delete", index: this.data.index });
  }
}
