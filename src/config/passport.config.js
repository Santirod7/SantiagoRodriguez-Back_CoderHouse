import passport from "passport";
import local from "passport-local";
import UserDAO from "../dao/managers/UserDAO.js";
import { createHash, validatePass } from "../utils.js";
import CartManager from "../dao/managers/CartManager.js";

const carritosManager = new CartManager();
const usuariosManager = new UserDAO();

export const iniciarPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, age } = req.body;
          if (!first_name || !last_name || !age) {
            return done(null, false, { message: "Faltan campos requeridos" });
          }
          let existe = await usuariosManager.getBy({ email: username });
          if (existe) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const nuevoCarrito = await carritosManager.createCart();
          let nuevoUsuario = await usuariosManager.create({
            first_name,
            last_name,
            age,
            email: username,
            password: createHash(password),
            cart: nuevoCarrito._id,
          });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(`Error al registrar el usuario: ${error}`);
        }
      },
    ),
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          let usuario = await usuariosManager.getBy({ email: username });
          if (!usuario) {
            return done(null, false);
          }
          if (!validatePass(password, usuario.password)) {
            return done(null, false);
          }
          return done(null, usuario);
        } catch (error) {
          return done(`Error al autenticar el usuario: ${error}`);
        }
      },
    ),
  );
  passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
  });
  passport.deserializeUser(async (id, done) => {
    let usuario = await usuariosManager.getById(id);
    done(null, usuario);
  });
};
