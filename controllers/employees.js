const { prisma } = require('../prisma/prisma-client');

/**
 * @route GET /api/employees
 * @desc get all employees
 * @access Private
 */
const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch {
    res.status(500).json({ message: 'can not get employees' });
  }
};

/**
 * @route POST /api/employees/add
 * @desc add employee
 * @access Private
 */
const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: 'All fields is required' });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'something went wrong' });
  }
};

/**
 * @route POST /api/employees/remove/:id
 * @desc remove employee
 * @access Private
 */
const remove = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.employee.delete({
      where: {
        id,
      },
    });

    res.status(204).json('OK');
  } catch {
    res.status(500).json({ message: 'can not remove employee' });
  }
};

/**
 * @route PUT /api/empoyees/edit/:id
 * @desc edit employee
 * @access Private
 */
const edit = async (req, res) => {
  const data = req.body;
  const id = data.id;

  try {
    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });

    res.status(204).json('OK');
  } catch (err) {
    res.status(500).json({ message: 'can not edit employee' });
  }
};

/**
 * @route GET /api/employees/:id
 * @desc get one employee
 * @access Private
 */
const employee = async (req, res) => {
  const { id } = req.params; // http://localhost:8000/api/employees/9fe371c1-361f-494a-9def-465959ecc098

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(employee);
  } catch {
    res.status(500).json({ message: 'can not get employee' });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  employee,
};
