import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/mesa-m-gica">
    <App />
  </BrowserRouter>
);
