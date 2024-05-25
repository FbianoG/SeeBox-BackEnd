const { User, Leito, Patient } = require('../models/model')
const mid = require('../middlewares/jwtoken')
const bcrypt = require('bcrypt')
const { verifyBox } = require('../middlewares/utils')


async function login(req, res) {
    try {
        const { username, password } = req.body.data
        if (!username || !password) return res.status(400).json({ message: "Preencha todos os campos." })
        const userFind = await User.findOne({ username })
        if (!userFind) return res.status(401).json({ message: "Usuário ou senha inválidos." })
        const result = await bcrypt.compare(password, userFind.password)
        if (!result) return res.status(401).json({ message: "Usuário ou senha inválidos." })
        const token = await mid.createToken(userFind._id)
        return res.status(200).json({ auth: true, roles: userFind.roles, message: "Logado com sucesso!", token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro interno do servidor." })
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
    const { name, age, plan, box, spec } = req.body
    const timeCreate = new Date()
    try {
        if (!name || !age || !plan || !box || !spec) return res.status(400).json({ message: "Preencha todos os campos." })
        const findBox = await verifyBox(box)
        if (findBox) return res.status(400).json({ message: 'Já possui paciente cadastrado neste leito.' })
        const response = await Patient.create({ name, age, plan, box, active: true, stats: 'indefinido', spec, data: { nota: false, conc: false, pres: false, exa: false, tev: false, int: false, obs: '' }, timeCreate })
        return res.status(201).json({ message: 'Paciente incluído com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servido.' })
    }
}

async function getPatients(req, res) {
    try {
        const patients = await Patient.find({ active: true }).select('-timeAna -timeAlta')
        return res.status(200).json({ patients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

// async function getPatientsAlta(req, res) {
//     try {
//         const patients = await Patient.find({ alta: { $ne: 'outros' } }).sort({ timeArchive: -1 }).limit(60).select('name plan alta timeArchive timeCreate')
//         const pat = patients.filter(element => new Date(element.timeCreate).getDate() === new Date().getDate())
//         console.log(pat)
//         console.log(new Date(patients[0].timeCreate).getDate())
//         return res.status(200).json({ patients })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: 'Erro interno de servidor.' })
//     }

// }

async function getPatientsAlta(req, res) {
    try {
        const altaPatients = await Patient.find({ alta: { $ne: 'outros' } }).sort({ timeCreate: -1 }).limit(50)
        // const todayPatients = altaPatients.filter(element => new Date(element.timeCreate).getDate() === new Date().getDate())
        return res.status(200).json({ altaPatients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function uptadePatient(req, res) {
    const { _id, data, box } = req.body
    delete data.box
    try {
        if (!_id || _id.trim() === '' || !data || !box) return res.status(400).json({ message: 'Paciente não encontrado.' })
        const findBox = await verifyBox(box)
        if (findBox && findBox._id != _id) return res.status(400).json({ message: 'Já possui paciente cadastrado neste leito.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { box, data })
        if (!update) return res.status(400).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Paciente atualizado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function archivePatient(req, res) {
    const { _id, alta } = req.body
    try {
        if (!_id || _id.trim() === '') return res.status(400).json({ message: 'Paciente não encontrado.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { active: false, alta, timeArchive: new Date() })
        if (!update) return res.status(400).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Paciente arquivado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function updateStatus(req, res) {
    let { _id, stats, timeAna, timeInt, timeAlta } = req.body
    let update
    try {
        if (!_id || !stats) return res.status(400).json({ message: 'Dados não fornecidos.' })
        if (timeAna) update = await Patient.findByIdAndUpdate({ _id }, { $set: { stats, timeAna: new Date() }, $unset: { timeInt: "", timeAlta: "" } })
        else if (timeAlta) update = await Patient.findByIdAndUpdate({ _id }, { $set: { stats, timeAlta: new Date() }, $unset: { timeInt: "" } })
        else if (timeInt) update = await Patient.findByIdAndUpdate({ _id }, { stats, timeInt: new Date() })
        else update = await Patient.findByIdAndUpdate({ _id }, { $set: { stats }, $unset: { timeInt: "", timeAlta: "", timeAna: "" } })
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

module.exports = { login, getLeitos, updateLeito, createPatient, getPatients, getPatientsAlta, uptadePatient, archivePatient, updateStatus, updateRoom }