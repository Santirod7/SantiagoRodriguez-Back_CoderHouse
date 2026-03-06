import userModel from "../models/User.model.js"; 

export default class UserDAO {
  async get() {
    return await userModel.find(); 
  }
  async getBy(filtro) {
    return await userModel.findOne(filtro);
  }

  async getById(id) {
    return await userModel.findById(id);
  }

  async create(usuario) {
    let nuevoUsuario = await userModel.create(usuario);
    return nuevoUsuario.toJSON();
  }

  async update(id, data) {
    return await userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await userModel.findByIdAndDelete(id);
  }
}