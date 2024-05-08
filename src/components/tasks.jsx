import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import api from "../services/api";
import Task from "./task";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function Tasks() {
  const [dayexec, setDayexec] = useState("");
  const [hrexec, setHrexec] = useState("");
  const [description, setDescription] = useState("");
  const [allTasks, setAllTasks] = useState([]);

  const [open, setOpen] = React.useState(0);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const [actionid, setActionid] = useState("");
  const [actiondia, setActiondia] = useState("");

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
    const status = "A";

    if (
      dayexec !== "SEG" &&
      dayexec !== "TER" &&
      dayexec !== "QUA" &&
      dayexec !== "QUI" &&
      dayexec !== "SEX" &&
      dayexec !== "SAB" &&
      dayexec !== "DOM"
    ) {
      alert("Dia inválido. Entrar com SEG, TER, QUA, QUI, SEX, SAB ou DOM");
    } else {
      const response = await api.post("/tasks", {
        dayexec: dayexec,
        hrexec: hrexec,
        description: description,
        status: status,
      });

      setAllTasks([...allTasks, response.data.taskCreated]);
    }
    setDayexec("");
    setHrexec("");
    setDescription("");
    setOpen(dayexec);
  }

  async function handleDelete(dia, id) {
    const deletedTask = await api.delete(`/tasks/${id}`, {});
    if (deletedTask.data.taskDeleted) {
      setAllTasks(allTasks.filter((task) => task._id !== id));
    }
    setActionid("");
    setActiondia("");
    setOpen(dia);
  }

  async function handleUpdateStatus(dia, id, status) {
    const taskStatusUpdated = await api.post(`/tasksstatus/${id}`, {
      status: status,
    });
    console.log(taskStatusUpdated);
    const response2 = await api.get("/tasks");
    setAllTasks(response2.data.taskReaded);
    setActionid("");
    setActiondia("");
    console.log(dia);
    setOpen(dia);
  }

  function handleActions(dia, id) {
    setActiondia(dia);
    setActionid(id);
  }

  function getActions(dia) {
    if (actionid !== "" && actiondia === dia) {
      return (
        <div className="divicons" style={{ width: "100%" }}>
          <Button
            color="amber"
            className="btn-action"
            onClick={() => handleUpdateStatus(actiondia, actionid, "A")}
          >
            Ag.
          </Button>
          <Button
            color="green"
            className="btn-action"
            onClick={() => handleUpdateStatus(actiondia, actionid, "C")}
          >
            OK
          </Button>
          <Button
            color="purple"
            className="btn-action"
            onClick={() => handleUpdateStatus(actiondia, actionid, "P")}
          >
            Parcial
          </Button>
          <Button
            color="red"
            className="btn-action"
            onClick={() => handleUpdateStatus(actiondia, actionid, "N")}
          >
            Falhou
          </Button>
          <Button
            color="black"
            className="btn-action"
            onClick={() => handleDelete(actiondia, actionid)}
          >
            Excluir
          </Button>
        </div>
      );
    } else {
      return <></>;
    }
  }
  function listTaskDia(dia) {
    const daytasks = allTasks.filter((data) => data.dayexec === dia);
    return (
      <>
        <Accordion open={open === dia} icon={<Icon id={dia} open={open} />}>
          <AccordionHeader onClick={() => handleOpen(dia)}>
            {dia}
            &nbsp;&nbsp;&nbsp;
            {getActions(dia)}
          </AccordionHeader>
          <AccordionBody>
            {daytasks.map((data) => (
              <Task key={data._id} data={data} handleActions={handleActions} />
            ))}
          </AccordionBody>
        </Accordion>
      </>
    );
  }

  function listTasks() {
    if (allTasks.length === 0) {
      <h1>Não existem Tarefas cadastradas</h1>;
    } else {
      return (
        <React.Fragment>
          {listTaskDia("SEG")}
          {listTaskDia("TER")}
          {listTaskDia("QUA")}
          {listTaskDia("QUI")}
          {listTaskDia("SEX")}
          {listTaskDia("SAB")}
          {listTaskDia("DOM")}
        </React.Fragment>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="flex-container">
        <div className="flex-content">
          <Accordion
            open={open === "Nova"}
            icon={<Icon id={"Nova"} open={open} />}
          >
            <AccordionHeader onClick={() => handleOpen("Nova")}>
              + Nova Tarefa
            </AccordionHeader>
            <AccordionBody>
              <form onSubmit={handleSubmit}>
                <div className="div-side">
                  <div className="div-side-item">
                    <input
                      type="text"
                      id="dayexec"
                      value={dayexec}
                      maxLength="3"
                      size="8"
                      required
                      placeholder="Dia ( Ex. SEG )"
                      onChange={(e) => setDayexec(e.target.value)}
                    />
                  </div>
                  <div className="div-side-item">
                    <input
                      type="time"
                      id="hrexec"
                      value={hrexec}
                      maxLength="5"
                      size="5"
                      required
                      //placeholder="Hora (00:00)"
                      onChange={(e) => setHrexec(e.target.value)}
                    />
                  </div>
                </div>
                <div className="div-side">
                  <div className="div-side-item">
                    <input
                      type="text"
                      id="description"
                      value={description}
                      maxLength="100"
                      size="23"
                      required
                      placeholder="Tarefa"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="div-side-item">
                    <Button
                      id="btnSalvar"
                      type="submit"
                      className="capitalize mt-5 w-28 text-sm"
                      style={{
                        backgroundColor: "#FFD3CA",
                        width: "100%",
                        height: "42px",
                      }}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </form>
            </AccordionBody>
          </Accordion>
          {listTasks()}
        </div>
        <br></br>
      </div>
    </React.Fragment>
  );
}

export default Tasks;
