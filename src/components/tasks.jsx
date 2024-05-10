import React, { useState, useEffect } from "react";
import { Button, Chip, Badge, Avatar } from "@material-tailwind/react";
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

  async function handleNovaSemana() {
    // const deletedTask = await api.delete(`/tasks/${id}`, {});
    // if (deletedTask.data.taskDeleted) {
    //   setAllTasks(allTasks.filter((task) => task._id !== id));
    // }
    // setActionid("");
    // setActiondia("");
    // setOpen(dia);
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

  function listPoints(vtPoints, totTasks, totTasksC, totTasksP, totTasksN) {
    const esperado = totTasks * 4;
    const alcancado = totTasksC * 4 + totTasksP * 2;
    const percsem = parseInt((alcancado * 100) / esperado);
    let txtpercsem = "Atingiu ".concat(percsem);
    txtpercsem = txtpercsem.concat(" %");
    let avataropacity1 = "mr-4 avatar-opacity";
    let avataropacity2 = "mr-4 avatar-opacity";
    let avataropacity3 = "mr-4 avatar-opacity";
    if (percsem >= 90) {
      avataropacity1 = "mr-4 avatar-opacity-100";
    }
    if (percsem >= 70 && percsem < 90) {
      avataropacity2 = "mr-4 avatar-opacity-100";
    }
    if (percsem < 70) {
      avataropacity3 = "mr-4 avatar-opacity-100";
    }

    return (
      <React.Fragment>
        {vtPoints.map((data) => (
          <div className="div-side-item marginb4">
            <div className="flex gap-2 align-middle">
              <Chip variant="outlined" value={data.dia} className="mr-4" />

              <Badge color="blue" content={data.tasksC} className="mr-4">
                <Chip color="green" value="OK" className="mr-4" />
              </Badge>
              <Badge color="blue" content={data.tasksP} className="mr-4">
                <Chip color="purple" value="Parcial" className="mr-4" />
              </Badge>
              <Badge color="blue" content={data.tasksN} className="mr-4">
                <Chip color="red" value="Falhou" className="mr-4" />
              </Badge>
            </div>
          </div>
        ))}

        <div className="div-side-item marginb4">
          <hr></hr>
          <br></br>
          Totais
          <br></br>
          <br></br>
          <div className="flex gap-2 align-middle">
            <Badge color="light-blue" content={totTasks} className="mr-4">
              <Chip color="black" value="Tarefas" className="mr-4" />
            </Badge>
            <Badge color="green" content={totTasksC} className="mr-4">
              <Chip color="black" value="Concluídas" className="mr-4" />
            </Badge>
            <Badge color="purple" content={totTasksP} className="mr-4">
              <Chip color="black" value="Parcial" className="mr-4" />
            </Badge>
            <Badge color="red" content={totTasksN} className="mr-4">
              <Chip color="black" value="Falhou" className="mr-4" />
            </Badge>
          </div>
        </div>

        <div className="div-side-item marginb4">
          <hr></hr>
          <br></br>
          <div className="flex gap-2 align-middle">
            <Badge color="light-blue" content={esperado} className="mr-4">
              <Chip color="black" value="Esperado" className="mr-4" />
            </Badge>
            <Badge color="light-blue" content={alcancado} className="mr-4">
              <Chip color="black" value="Alcançado" className="mr-4" />
            </Badge>
            <Chip color="blue" value={txtpercsem} className="mr-4" />
          </div>
        </div>

        <div className="div-side-item marginb4">
          <hr></hr>
          <br></br>
          <div className="flex gap-2 align-middle">
            <Badge color="light-blue" content={esperado} className="mr-4">
              <Chip color="black" value="Esperado" className="mr-4" />
            </Badge>
            <Badge color="light-blue" content={alcancado} className="mr-4">
              <Chip color="black" value="Alcançado" className="mr-4" />
            </Badge>
            <Chip color="blue" value={txtpercsem} className="mr-4" />
          </div>
          <br></br>
          <div className="flex gap-2 align-middle">
            <Avatar
              src="https://c3.klipartz.com/pngpicture/1005/48/sticker-png-meme-cry-2-crying-memes-illustration.png"
              size="xxl"
              className={avataropacity3}
            />
            <Avatar
              src="https://www.shutterstock.com/image-photo/closeup-20-reais-banknotes-brazil-260nw-2186096491.jpg"
              size="xxl"
              className={avataropacity2}
            />
            <Avatar
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTpj7RuwArFJJZTVw_StzBEtFR5FdV9wtBy1tfMsb9Pw&s"
              size="xxl"
              className={avataropacity1}
            />
          </div>
        </div>

        <div className="div-side-item marginb4">
          <hr></hr>
          <br></br>
          <div className="flex gap-2 align-middle">
            <Button
              id="btnReset"
              color="amber"
              className="capitalize mt-5 w-full text-sm"
              onClick={() => handleNovaSemana()}
            >
              Iniciar nova Semana
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  function getPoints() {
    let vtPoints = [];
    let tasksSegC = 0;
    let tasksSegP = 0;
    let tasksSegN = 0;
    let tasksTerC = 0;
    let tasksTerP = 0;
    let tasksTerN = 0;
    let tasksQuaC = 0;
    let tasksQuaP = 0;
    let tasksQuaN = 0;
    let tasksQuiC = 0;
    let tasksQuiP = 0;
    let tasksQuiN = 0;
    let tasksSexC = 0;
    let tasksSexP = 0;
    let tasksSexN = 0;
    let tasksSabC = 0;
    let tasksSabP = 0;
    let tasksSabN = 0;
    let tasksDomC = 0;
    let tasksDomP = 0;
    let tasksDomN = 0;
    let totTasks = 0;
    let totTasksC = 0;
    let totTasksP = 0;
    let totTasksN = 0;

    const vtSeg = allTasks.map((data) => {
      switch (data.dayexec) {
        case "SEG":
          if (data.status === "C") {
            tasksSegC++;
          }
          if (data.status === "P") {
            tasksSegP++;
          }
          if (data.status === "N") {
            tasksSegN++;
          }
          totTasks++;
          break;
        case "TER":
          if (data.status === "C") {
            tasksTerC++;
          }
          if (data.status === "P") {
            tasksTerP++;
          }
          if (data.status === "N") {
            tasksTerN++;
          }
          totTasks++;
          break;
        case "QUA":
          if (data.status === "C") {
            tasksQuaC++;
          }
          if (data.status === "P") {
            tasksQuaP++;
          }
          if (data.status === "N") {
            tasksQuaN++;
          }
          totTasks++;
          break;
        case "QUI":
          if (data.status === "C") {
            tasksQuiC++;
          }
          if (data.status === "P") {
            tasksQuiP++;
          }
          if (data.status === "N") {
            tasksQuiN++;
          }
          totTasks++;
          break;
        case "SEX":
          if (data.status === "C") {
            tasksSexC++;
          }
          if (data.status === "P") {
            tasksSexP++;
          }
          if (data.status === "N") {
            tasksSexN++;
          }
          totTasks++;
          break;
        case "SAB":
          if (data.status === "C") {
            tasksSabC++;
          }
          if (data.status === "P") {
            tasksSabP++;
          }
          if (data.status === "N") {
            tasksSabN++;
          }
          totTasks++;
          break;
        case "DOM":
          if (data.status === "C") {
            tasksDomC++;
          }
          if (data.status === "P") {
            tasksDomP++;
          }
          if (data.status === "N") {
            tasksDomN++;
          }
          totTasks++;
          break;
        default:
        // code block
      }

      return 0;
    });
    vtPoints = [
      { dia: "SEG", tasksC: tasksSegC, tasksP: tasksSegP, tasksN: tasksSegN },
      { dia: "TER", tasksC: tasksTerC, tasksP: tasksTerP, tasksN: tasksTerN },
      { dia: "QUA", tasksC: tasksQuaC, tasksP: tasksQuaP, tasksN: tasksQuaN },
      { dia: "QUI", tasksC: tasksQuiC, tasksP: tasksQuiP, tasksN: tasksQuiN },
      { dia: "SEX", tasksC: tasksSexC, tasksP: tasksSexP, tasksN: tasksSexN },
      { dia: "SAB", tasksC: tasksSabC, tasksP: tasksSabP, tasksN: tasksSabN },
      { dia: "DOM", tasksC: tasksDomC, tasksP: tasksDomP, tasksN: tasksDomN },
    ];
    totTasksC =
      tasksSegC +
      tasksTerC +
      tasksQuaC +
      tasksQuiC +
      tasksSexC +
      tasksSabC +
      tasksDomC;

    totTasksP =
      tasksSegP +
      tasksTerP +
      tasksQuaP +
      tasksQuiP +
      tasksSexP +
      tasksSabP +
      tasksDomP;

    totTasksN =
      tasksSegN +
      tasksTerN +
      tasksQuaN +
      tasksQuiN +
      tasksSexN +
      tasksSabN +
      tasksDomN;

    return listPoints(vtPoints, totTasks, totTasksC, totTasksP, totTasksN);
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

          <Accordion
            open={open === "Pontos"}
            icon={<Icon id={"Pontos"} open={open} />}
          >
            <AccordionHeader onClick={() => handleOpen("Pontos")}>
              Pontuação da Semana
            </AccordionHeader>
            <AccordionBody>
              <>{getPoints()}</>
              {/* <>{listPremios()}</> */}
            </AccordionBody>
          </Accordion>
        </div>
        <br></br>
      </div>
    </React.Fragment>
  );
}

export default Tasks;
