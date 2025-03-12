import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Register from "./Register";
import Login from "./Login";
import { Container } from "@mui/material";

const App: React.FC = () => {
  return (
    <Router>
      <Container component="main" maxWidth="xs">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
