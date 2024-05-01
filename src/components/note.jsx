import React, { useState } from "react";
import api from "../services/api";
import { AiTwotoneDelete, AiOutlineExclamationCircle } from "react-icons/ai";

function Note({ data, handleDelete, handleUpdatePriority }) {
  const [changedNote, setChangedNote] = useState("");

  async function handleUpdateNotes(e, notes, id) {
    if (changedNote && changedNote !== notes) {
      const response = await api.post(`/contents/${id}`, {
        notes: changedNote,
      });
    }
  }

  function getCssPri(pri) {
    if (pri === false) {
      return "low";
    } else {
      return "hi";
    }
  }

  return (
    <>
      <div className={"note note-".concat(getCssPri(data.priority))}>
        <div>
          <p>{data.title}</p>
          <textarea
            key={data._id}
            id={data._id}
            defaultValue={data.notes}
            rows="4"
            cols="50"
            className={"textarea_note-".concat(getCssPri(data.priority))}
            onChange={(e) => setChangedNote(e.target.value)}
            onBlur={(e) => handleUpdateNotes(e.target, data.notes, data._id)}
          ></textarea>
        </div>
        <div className="divicons">
          <AiTwotoneDelete onClick={() => handleDelete(data._id)} size="20" />
          <AiOutlineExclamationCircle
            onClick={() => handleUpdatePriority(data._id)}
            size="20"
          />
        </div>
      </div>
    </>
  );
}

export default Note;
