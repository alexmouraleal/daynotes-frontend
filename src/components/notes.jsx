import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import api from "../services/api";
import Note from "./note";
import RadioButton from "./radio";

function Notes() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    async function getAllNotes() {
      const response = await api.get("/annotations");
      setAllNotes(response.data.annotationList);
    }
    getAllNotes();
  }, []);

  useEffect(() => {
    function enableBtnSalvar() {
      let btnSalvar = document.getElementById("btnSalvar");
      btnSalvar.style.backgroundColor = "#c2c2c2";

      if (title && notes) {
        btnSalvar.style.backgroundColor = "#a2509a";
      }
    }
    enableBtnSalvar();
  }, [title, notes]);

  async function handleSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const notes = document.getElementById("notes").value;

    const response = await api.post("/annotations", {
      title: title,
      notes: notes,
      priority: false,
    });

    setAllNotes([...allNotes, response.data.annotationCreated]);

    setTitle("");
    setNotes("");
  }

  function listNotes() {
    console.log(allNotes.length === 0);
    if (allNotes.length === 0) {
      <h1>Não existem notas cadastradas</h1>;
    } else {
      return allNotes.map((data) => (
        <Note
          key={data._id}
          data={data}
          handleDelete={handleDelete}
          handleUpdatePriority={handleUpdatePriority}
        />
      ));
    }
  }

  async function handleDelete(id) {
    const deletedNote = await api.delete(`/annotations/${id}`, {});

    if (deletedNote.data.annotationDeleted) {
      setAllNotes(allNotes.filter((note) => note._id !== id));
    }
  }

  async function handleUpdatePriority(id) {
    const response1 = await api.post(`/priorities/${id}`, {});
    const response2 = await api.get("/annotations");
    setAllNotes(response2.data.annotationList);
  }

  return (
    <React.Fragment>
      <div className="flex-container">
        <div className="flex-side">
          <form onSubmit={handleSubmit}>
            <p>
              <b>Day Notes</b>
            </p>

            <input
              type="text"
              id="title"
              value={title}
              maxLength="20"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              id="notes"
              value={notes}
              required
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>

            <Button
              id="btnSalvar"
              type="submit"
              className="capitalize mt-5 w-28 text-sm"
              style={{ backgroundColor: "#FFD3CA", width: "100%" }}
            >
              Salvar
            </Button>
          </form>
          {/* <RadioButton /> */}
        </div>
        <div className="flex-content">{listNotes()}</div>
      </div>
    </React.Fragment>
  );
}

export default Notes;
