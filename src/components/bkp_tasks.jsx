import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import api from "../services/api";
import Note from "./note";
import { MdDescription } from "react-icons/md";

function Tasks() {
  const [dayexec, setDayexec] = useState("");
  const [hrexec, setHrexec] = useState("");
  const [description, setDescription] = useState("");
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    async function getAllTasks() {
      const response = await api.get("/tasks");
      setAllTasks(response.data.taskReaded);
    }
    getAllTasks();
  }, []);

  useEffect(() => {
    function enableBtnSalvar() {
      let btnSalvar = document.getElementById("btnSalvar");
      btnSalvar.style.backgroundColor = "#c2c2c2";

      if (dayexec && hrexec && description) {
        btnSalvar.style.backgroundColor = "#a2509a";
      }
    }
    enableBtnSalvar();
  }, [dayexec, hrexec, description]);

  async function handleSubmit(e) {
    e.preventDefault();

    const dayexec = document.getElementById("dayexec").value;
    const hrexec = document.getElementById("hrexec").value;
    const description = document.getElementById("description").value;
    let status = "";
    description.toLowerCase() === "descanso" ? (status = "L") : "A";

    const response = await api.post("/tasks", {
      dayexec: dayexec,
      hrexec: hrexec,
      description: description,
      status: description,
    });

    setAllTasks([...allTasks, response.data.taskCreated]);

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

export default Tasks;
