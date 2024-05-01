import React, { Component } from "react";
import { Radio } from "@material-tailwind/react";

function RadioButton() {
  return (
    <div className="flex-col ">
      <Radio name="color" color="blue" label="Todos" defaultChecked />
      <br />
      <Radio name="color" color="red" label="Prioritário" />
      <br />
      <Radio name="color" color="amber" label="Normal" />
    </div>
  );
}

export default RadioButton;
