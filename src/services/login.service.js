import { v4 as uuidv4 } from 'uuid';
import { sessions, loginAttempts } from "@/datasource/login.js";

/**
 * Génère un token de session UUID
 * @returns {string}
 */
function generateSessionToken() {
    return uuidv4();
}

/**
 * Génère le prochain ID de session basé sur les sessions existantes
 * @returns {string}
 */
function generateNextSessionId() {
    if (sessions.length === 0) {
        return "6476f0e1c7e21b2b33a35s01";
    }

    const lastSession = sessions[sessions.length - 1];
    const baseId = lastSession._id.slice(0, -2);
    const lastNumber = parseInt(lastSession._id.slice(-2));
    const nextNumber = (lastNumber + 1).toString().padStart(2, '0');

    return `${baseId}${nextNumber}`;
}

/**
 * Génère le prochain ID de tentative de login
 * @returns {string}
 */
function generateNextLoginAttemptId() {
    if (loginAttempts.length === 0) {
        return "6476f0e1c7e21b2b33a35l01";
    }

    const lastAttempt = loginAttempts[loginAttempts.length - 1];
    const baseId = lastAttempt._id.slice(0, -2);
    const lastNumber = parseInt(lastAttempt._id.slice(-2));
    const nextNumber = (lastNumber + 1).toString().padStart(2, '0');

    return `${baseId}${nextNumber}`;
}

/**
 * Crée une nouvelle session pour un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {object} options - Options additionnelles
 * @returns {object} - Nouvelle session créée
 */
function createSession(userId, options = {}) {
    const session = {
        _id: generateNextSessionId(),
        userId: userId,
        sessionToken: generateSessionToken(),
        createdAt: { "$date": new Date().toISOString() },
        expiresAt: { "$date": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
        isActive: true
    };

    sessions.push(session);
    return session;
}

/**
 * Crée une nouvelle tentative de login
 * @param {string} username - Nom d'utilisateur
 * @param {boolean} success - Si la tentative a réussi
 * @param {object} options - Options additionnelles
 * @returns {object} - Nouvelle tentative créée
 */
function createLoginAttempt(username, success, options = {}) {
    const attempt = {
        _id: generateNextLoginAttemptId(),
        username: username,
        success: success,
        timestamp: { "$date": new Date().toISOString() },
        ipAddress: options.ipAddress || 'unknown',
        userAgent: options.userAgent || 'unknown',
        ...(options.reason && { reason: options.reason })
    };

    loginAttempts.push(attempt);
    return attempt;
}

export {
    generateSessionToken,
    createSession,
    createLoginAttempt,
    generateNextSessionId,
    generateNextLoginAttemptId
};
