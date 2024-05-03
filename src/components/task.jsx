import React, { useState } from "react";
import api from "../services/api";

// import {
//   FaClock,
//   FaEllo,
//   FaCircleHalfStroke,
//   FaFaceFlushed,
//   FaTrashCanArrowUp,
// } from "react-icons/fa6";

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
      return "Aguardando";
    }
    if (status === "P") {
      return "Parcial";
    }
    if (status === "C") {
      return "Concluído";
    }
    if (status === "N") {
      return "Não Feito";
    }
  }
  return (
    <>
      <div className="div-side">
        <div className="div-side-item" style={{ width: "9%" }}>
          <input
            id={"hrexec".concat(data._id)}
            defaultValue={data.hrexec}
            type="text"
            maxLength="5"
            size="3"
            required
            onChange={(e) => setChangedHrExec(e.target.value)}
            onBlur={(e) => handleUpdate(data)}
          />
        </div>
        <div className="div-side-item" style={{ width: "41%" }}>
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

        <div className="div-side-item" style={{ width: "16%" }}>
          <div
            className={"label-line color-".concat(data.status)}
            onClick={() => handleActions(data.dayexec, data._id)}
          >
            {fnGetStatusDesc(data.status)}
          </div>
        </div>

        {/* <div className="div-side-item" style={{ width: "34%" }}>
          <div className="divicons" style={{ width: "100%" }}>
            <FaClock
              onClick={() => handleUpdateStatus(data._id, "A")}
              size="20"
              color="orange"
            />
            <FaEllo
              onClick={() => handleUpdateStatus(data._id, "C")}
              size="20"
              color="green"
            />
            <FaCircleHalfStroke
              onClick={() => handleUpdateStatus(data._id, "P")}
              size="20"
              color="purple"
            />
            <FaFaceFlushed
              onClick={() => handleUpdateStatus(data._id, "N")}
              size="20"
              color="red"
            />
            &nbsp;&nbsp;
            <FaTrashCanArrowUp
              onClick={() => handleDelete(data._id)}
              size="19"
              color="gray"
            />
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Task;
