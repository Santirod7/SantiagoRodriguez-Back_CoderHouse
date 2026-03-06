import { Router } from "express";
import UserDAO from "../dao/managers/UserDAO.js";
import passport from "passport";
export const router = Router();

const usuariosManager = new UserDAO();

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(401).json({ error: `Error al autenticar` });
});

router.post(
  "/register",
  passport.authenticate("registro", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res
      .setHeader('Content-Type','application/json')
      .status(201).json({ status: "success", message: "Usuario registrado con éxito", 
        nuevoUsuario: req.user
      });
      
    },
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    req.session.usuario = req.user;
    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ status: "success", message: "Usuario autenticado con éxito" });
  },
);

router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: `Error al realizar el logout` });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Usuario desconectado con éxito" });
  });
});
export default router;
