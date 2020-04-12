import React from "react";
import "./List.css";

function List() {
  const listElems = ["Item 1", "Item 2", "Item 3"];

  const listJsx = listElems.map((elem) => {
    return <div>{elem}</div>;
  });

  return <div className="List-elems">{listJsx}</div>;
}

export default List;
