import userRepository from "../repositories/userRepository.js";
import profileRepository from "../repositories/profileRepository.js";
import professionalRepository from "../repositories/professionalRepository.js";
import roleRepository from "../repositories/roleRepository.js";
import availabilityRepository from "../repositories/availabilityRepository.js";

// === Helpers locales ===
const pad = (n) => String(n).padStart(2, "0");

// Acepta "HH:mm:ss" o "YYYY-MM-DD HH:mm:ss" y devuelve minutos desde medianoche
function toMinutes(value) {
  if (typeof value !== "string" || value.length < 8) return 0;
  const hms = value.slice(-8);
  const [h, m] = hms.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHms(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}:00`;
}

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

// ===================================================
const professionalService = {
  async createProfessional(email, professionalData) {
    const profileId = await profileRepository.findProfileIdByEmail(email);
    const profile = await profileRepository.findProfileByEmail(email);

    if (!profile) {
      const error = new Error("Perfil no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const existingProfessional = await professionalRepository.findByProfileId(
      profile.profile_id
    );
    if (existingProfessional) {
      const error = new Error(
        "A professional profile already exists for this user."
      );
      error.statusCode = 409;
      throw error;
    }

    const newProfessionalData = {
      profile_id: profileId.profile_id,
      ...professionalData,
    };

    const newProfessional = await professionalRepository.create(
      newProfessionalData
    );

    await roleRepository.updateRoleToProfessional(profileId.profile_id);
    await professionalRepository.createProfessionalWorkingHours(
      newProfessional.professional_id
    );

    return newProfessional;
  },

  async getProfessionalAvailability(professionalId, date, slotMinutes = 60) {
    const result = await professionalRepository.getProfessionalAvailabity(
      professionalId,
      date
    );

    const workingHours = result.workingHours || [];
    const timeOff = result.timeOff || [];
    const appointments = result.appointments || [];

    if (!workingHours.length) return [];

    const wh = workingHours[0];
    const workStartMin = toMinutes(wh.start_time);
    const workEndMin = toMinutes(wh.end_time);
    if (workEndMin <= workStartMin) return [];

    // 1) Generar slots dentro del horario laboral
    const allSlots = [];
    for (
      let t = workStartMin;
      t + slotMinutes <= workEndMin;
      t += slotMinutes
    ) {
      allSlots.push({ startMin: t, endMin: t + slotMinutes });
    }

    // Estados de cita que SÍ bloquean disponibilidad
    // (ajusta según tu negocio: p.ej., quizás 'RESCHEDULED' exista)
    const blockingStatuses = new Set(["SCHEDULED"]);

    // 2) Convertir timeOff y citas a intervalos [startMin, endMin]
    const toCuts = (rows, startKey, endKey) =>
      rows
        .map((r) => {
          const s = toMinutes(r[startKey]);
          const e = toMinutes(r[endKey]);
          return e > s ? { startMin: s, endMin: e } : null;
        })
        .filter(Boolean);

    const timeOffCuts = toCuts(
      timeOff.filter((t) => t.type === "CLOSE"),
      "start_time",
      "end_time"
    );

    // ⬅️ Aquí filtramos citas canceladas (no bloquean)
    const apptCuts = toCuts(
      appointments.filter((a) => {
        const st = (a.status || "").toUpperCase();
        return blockingStatuses.has(st);
      }),
      "start_time",
      "end_time"
    );

    // 3) Filtrar los bloques bloqueados
    const freeSlots = allSlots.filter(({ startMin, endMin }) => {
      const blockedByTimeOff = timeOffCuts.some((c) =>
        overlaps(startMin, endMin, c.startMin, c.endMin)
      );
      const blockedByAppt = apptCuts.some((c) =>
        overlaps(startMin, endMin, c.startMin, c.endMin)
      );
      return !blockedByTimeOff && !blockedByAppt;
    });

    // 4) Retornar en formato HH:mm:ss
    return freeSlots.map(({ startMin, endMin }) => ({
      start: minutesToHms(startMin),
      end: minutesToHms(endMin),
    }));
  },

  // ===================================================

  async getAllProfessionals() {
    const professionals = await professionalRepository.findAll();
    return professionals;
  },

  async getProfessionalById(id) {
    const professional = await professionalRepository.findById(id);
    return professional;
  },

  async updateProfessionalProfile(userId, professionalId, professionalData) {
    const professionalToUpdate = await professionalRepository.findById(
      professionalId
    );
    if (!professionalToUpdate) {
      const error = new Error("Professional profile to update not found.");
      error.statusCode = 404;
      throw error;
    }

    const userProfile = await profileRepository.findByUserId(userId);
    if (professionalToUpdate.profile_id !== userProfile.profile_id) {
      const error = new Error(
        "Forbidden. You can only update your own professional profile."
      );
      error.statusCode = 403;
      throw error;
    }

    const updatedProfessional = await professionalRepository.update(
      professionalId,
      professionalData
    );
    return updatedProfessional;
  },

  async deleteProfessionalProfile(professionalId) {
    const professionalToDelete = await professionalRepository.findById(
      professionalId
    );
    if (!professionalToDelete) {
      const error = new Error("Professional profile not found.");
      error.statusCode = 404;
      throw error;
    }

    await professionalRepository.updateRoleWhenProfessionalDeleted(
      professionalId
    );
    await professionalRepository.delete(professionalId);
  },

  async getClientsForProfessional(userId) {
    const user = await userRepository.findById(userId);
    const role = await roleRepository.findById(user.role_id);
    if (role.name !== "PROFESSIONAL") {
      const error = new Error(
        "Only users with the PROFESSIONAL role can access client information."
      );
      error.statusCode = 403;
      throw error;
    }

    const professional = await professionalRepository.findByUserId(userId);
    if (!professional) {
      const error = new Error("Professional profile not found.");
      error.statusCode = 404;
      throw error;
    }

    const clients = await clientRepository.findByAssignedProfessional(
      professional.professional_id
    );
    return clients;
  },

  async getRoleByProfileEmail(email) {
    const result = await professionalRepository.findRoleByEmail(email);
    return result;
  },

  async updateProfessionalAndProfile(professionalId, professionalData) {
    const result = await professionalRepository.updateProfessionalAndProfile(
      professionalId,
      professionalData
    );
    return result;
  },

  async getProfessionalAndProfileData(professionalId) {
    const result = await professionalRepository.getProfessionalAndProfileData(
      professionalId
    );
    return result;
  },

  async getProfessionalAppointments(professionalId, date) {
    const result = await professionalRepository.getProfessionalAppointments(
      professionalId,
      date
    );
    return result;
  },
};

export default professionalService;
