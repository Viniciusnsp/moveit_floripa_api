import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/gi;
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      phone: Yup.string().matches(phoneRegex).required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });
    const phoneExist = await User.findOne({ where: { phone: req.body.phone } });

    if (userExist || phoneExist) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const { id, name, email, phone } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      phone,
    });
  }

  async update(req, res) {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/gi;
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPhone: Yup.string().matches(phoneRegex),
      phone: Yup.string().when('oldPhone', (oldPhone, field) =>
        oldPhone ? field.required().oneOf([Yup.ref('oldPhone')]) : field
      ),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { email, oldPhone, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    if (oldPhone !== user.phone) {
      const phoneExist = await User.findOne({
        where: { phone: req.body.phone },
      });
      if (phoneExist) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha não confere' });
    }

    const { id, name, phone } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      phone,
    });
  }

  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }

  async delete(req, res) {
    const user = await User.findOne({ where: req.params });
    user.destroy();

    return res.json(user);
  }
}

export default new UserController();
