import React, { useState } from "react";
import api from "../services/api";
import { Button } from "@material-tailwind/react";

function Task({ data, handleActions }) {
  const [changedHrExec, setChangedHrExec] = useState("");
  const [changedDescription, setChangedDescription] = useState("");

  async function handleUpdate(data) {
    const hrexec = document.getElementById("hrexec".concat(data._id)).value;
    const description = document.getElementById(
      "description".concat(data._id)
    ).value;

    const taskUpdated = await api.post(`/tasks/${data._id}`, {
      hrexec: hrexec,
      description: description,
    });

    console.log(taskUpdated, changedHrExec, changedDescription);
  }

  function fnGetStatusDesc(status) {
    if (status === "A") {
      return "Aguardo";
    }
    if (status === "P") {
      return "Parcial";
    }
    if (status === "C") {
      return "OK";
    }
    if (status === "N") {
      return "Falhou";
    }
  }
  return (
    <>
      <div className="div-side">
        <div className="div-side-item" style={{ width: "22%" }}>
          <input
            id={"hrexec".concat(data._id)}
            defaultValue={data.hrexec}
            type="time"
            required
            onChange={(e) => setChangedHrExec(e.target.value)}
            onBlur={(e) => handleUpdate(data)}
          />
        </div>
        <div className="div-side-item" style={{ width: "70%" }}>
          <input
            id={"description".concat(data._id)}
            defaultValue={data.description}
            type="text"
            maxLength="100"
            size="30"
            required
            onChange={(e) => setChangedDescription(e.target.value)}
            onBlur={(e) => handleUpdate(data)}
          />
        </div>

        <div className="div-side-item" style={{ width: "30%" }}>
          <Button
            className={"flex items-center gap-1 h-10 p-2 w-full  color-".concat(
              data.status
            )}
            onClick={() => handleActions(data.dayexec, data._id)}
          >
            {fnGetStatusDesc(data.status)}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Task;
