const { User, Leito, Patient } = require('../models/model')
const mid = require('../middlewares/jwtoken')
const bcrypt = require('bcrypt')


async function login(req, res) {
    try {
        const { username, password } = req.body.data
        if (!username || !password) {
            return res.status(400).json({ message: "Preencha todos os campos." })
        }
        const userFind = await User.findOne({ username })
        if (!userFind) {
            return res.status(401).json({ message: "Usuário ou senha inválidos." })
        }
        const result = await bcrypt.compare(password, userFind.password)
        if (!result) {
            return res.status(401).json({ message: "Usuário ou senha inválidos." })
        }
        const token = await mid.createToken(userFind._id)
        return res.status(200).json({ auth: true, roles: userFind.roles, message: "Logado com sucesso!", token })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

async function getLeitos(req, res) {
    try {
        const leitos = await Leito.find({})
        return res.status(200).json({ leitos })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

async function updateLeito(req, res) {
    try {
        const { id, name, age, plan, obs, nota, conc, pres, exa, tev, int, } = req.body
        let { hour, stats, room } = req.body

        if (!name || name.trim() == "") {
            stats = ""
            hour = ""
            room = ""
        }
        const userFind = await Leito.findById({ _id: id })
        console.log(req.body);
        const userUpdate = await Leito.findByIdAndUpdate({ _id: id }, { name, age, plan, obs, nota, conc, pres, exa, tev, int, hour, stats, room }, { new: true })
        return res.status(201).json({ status: 201, message: "Leito atualizado com sucesso.", userUpdate })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

// New
async function createPatient(req, res) {
    const { name, age, plan, box } = req.body
    try {
        if (!name || !age || !plan || !box) return res.status(400).json({ message: "Preencha todos os campos." })
        const findBox = await Patient.findOne({ box, active: true })
        if (findBox) return res.status(400).json({ message: 'Já possui paciente cadastrado neste leito.' })
        const response = await Patient.create({ name, age, plan, box, active: true, stats: 'indefinido', data: { nota: false, conc: false, pres: false, exa: false, tev: false, int: false, obs: '' } })
        return res.status(201).json({ message: 'Paciente incluído com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servido.' })
    }

}

async function getPatients(req, res) {
    try {
        const patients = await Patient.find({ active: true })
        return res.status(200).json({ patients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function getPatientsAlta(req, res) {
    try {
        const patients = await Patient.find({ active: false }).sort({ _id: -1 }).limit(20).select('name plan alta')
        return res.status(200).json({ patients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }

}

async function uptadePatient(req, res) {
    const { data, _id, active, alta } = req.body
    try {
        if (!_id || _id.trim() === '' || !data) return res.status(400).json({ message: 'Paciente não encontrado.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { data, active, alta })
        if (!update) return res.status(400).json({ message: 'Paciente não encontrado.' })
        if (!active) return res.status(200).json({ message: 'Paciente arquivado.' })
        return res.status(200).json({ message: 'Paciente atualizado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function updateStatus(req, res) {
    const { _id, stats } = req.body
    try {
        if (!_id || !stats) return res.status(400).json({ message: 'Dados não fornecidos.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { stats })
        if (!update) return res.status(404).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Alteração realizada com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor' })
    }
}

async function updateRoom(req, res) {
    const { _id, room } = req.body
    try {
        if (!_id) return res.status(400).json({ message: 'Paciente não encontrado.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { room })
        if (!update) return res.status(404).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Leito atualizado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor' })
    }
}

module.exports = { login, getLeitos, updateLeito, createPatient, getPatients, getPatientsAlta, uptadePatient, updateStatus, updateRoom }