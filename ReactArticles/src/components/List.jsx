import React from "react";
import "../assets/styles/List.css";

function List() {
  const products = [
    { id: 1, name: "חלב" },
    { id: 2, name: "בוטנים" },
    { id: 3, name: "שקדים" },
    { id: 4, name: "אגוזים" },
    { id: 5, name: "גלוטן" },
    { id: 6, name: "ביצים" },
    { id: 7, name: "סויה" },
    { id: 8, name: "דגים" },
    { id: 9, name: "שומשום" },
    { id: 10, name: "חיטה" },
    { id: 11, name: "תירס" },
    { id: 12, name: "סלרי" },
    { id: 13, name: "חרדל" },
    { id: 14, name: "קוקוס" },
    { id: 15, name: "פירות ים" },
  ];
  const medical_condition = [
    { id: 1, name: "הריון" },
    { id: 2, name: "סכרת" },
  ];

  return (
    <div className="main-container">
      <aside className="filter-container">
        <h3>סימון רגישות-</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <input
                type="checkbox"
                id={`filter-${product.id}`}
                name={product.name}
              />
              <label htmlFor={`filter-${product.id}`}>{product.name}</label>
            </li>
          ))}
        </ul>
        <h3>סימון מצב רפואי-</h3>
        <ul>
          {medical_condition.map((medical) => (
            <li key={medical.id}>
              <input
                type="checkbox"
                id={`filter-${medical.id}`}
                name={medical.name}
              />
              <label htmlFor={`filter-${medical.id}`}>{medical.name}</label>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default List;
