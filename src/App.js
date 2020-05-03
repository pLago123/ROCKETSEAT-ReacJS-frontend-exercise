import React, { useEffect, useState, useRef } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const form = useRef(null);
  const [repositories, setRepositories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    techs: [],
  });

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  function handleChange(e) {
    if (e.target.name !== "techs")
      setFormData({ ...formData, [e.target.name]: e.target.value });
    else
      setFormData({ ...formData, [e.target.name]: e.target.value.split(" ") });
  }

  async function handleAddRepository() {
    // TODO
    const response = await api.post("repositories", {
      title: formData.title,
      url: formData.url,
      techs: formData.techs,
    });

    setRepositories([...repositories, response.data]);
    setFormData({ ...formData, title: "", url: "", techs: [] });
  }

  async function handleRemoveRepository(id) {
    // TODO
    api.delete(`repositories/${id}`);

    setRepositories(repositories.filter((item) => item.id !== id));
  }

  return (
    <div className="container">
      <div className="board">
        <div className="title">
          <h2>Repositories</h2>
        </div>
        <div className="board-body">
          <ul data-testid="repository-list">
            {repositories.map((repository) => (
              <li key={repository.id} className="repository">
                <h3>{repository.title}</h3>
                <div className="link">
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repository.url}
                  </a>
                </div>
                <ul>
                  {repository.techs.map((tech) => (
                    <li key={tech}> - {tech}</li>
                  ))}
                </ul>
                <button onClick={() => handleRemoveRepository(repository.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="side-pannel">
        <form action="none" ref={form}>
          <h1>Add a New Repository</h1>
          <label htmlFor="title">
            <div>{"Title:"}</div>
            <input
              name="title"
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="url">
            <div>{"URL:"}</div>
            <input
              name="url"
              id="url"
              type="text"
              value={formData.url}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="techs">
            <div>{"Techs: (separated by space)"}</div>
            <input
              name="techs"
              id="techs"
              type="text"
              value={formData.techs.join(" ")}
              onChange={handleChange}
            />
          </label>
        </form>
        <button onClick={handleAddRepository}>Adicionar</button>
      </div>
    </div>
  );
}

export default App;
