import { users, sessions, loginAttempts, permissions, userProfiles } from '@/datasource/login.js'
import { v4 as uuidv4 } from 'uuid'
import { createSession, createLoginAttempt } from '@/services/login.service.js'

/* Les fonctions ci-dessous doivent mimer ce que renvoie l'API en fonction des requêtes possibles.

  Dans certains cas, ces fonctions vont avoir des paramètres afin de filtrer les données qui se trouvent dans login.js
  Il est fortement conseillé que ces paramètres soient les mêmes que ceux qu'il faudrait envoyer à l'API.

  IMPORTANT : toutes les requêtes à l'API DOIVENT renvoyer un objet JSON au format {error: ..., status: ..., data: ...}
  Cela implique que toutes les fonctions ci-dessous renvoient un objet selon ce format.
 */

/**
 * Si le login et le mot de passe sont fournis, que le login correspond à un utilisateur existant,
 * login() renvoie un objet contenant uniquement l'id, le nom, le login, l'email
 * et un identifiant de session sous forme d'un uuid. Sinon, un texte d'erreur est renvoyé.
 * @param data
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: {_id: string, name: string, username: string, email: string, session: string}}}
 */
function login(data) {
    if ((!data.username) || (!data.password)) return {error: 1, status: 404, data: 'aucun login/pass fourni'}

    let user = users.find(u => u.username === data.username && u.password === data.password && u.isActive)
    if (!user) {
        // Enregistrer tentative échouée
        createLoginAttempt(data.username, false, {
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            reason: 'invalid_credentials'
        })
        return {error: 1, status: 404, data: 'login/pass incorrect'}
    }

    // Vérifier session existante
    let existingSession = sessions.find(s => s.userId === user._id && s.isActive && new Date(s.expiresAt.$date) > new Date())

    let sessionToken
    if (existingSession) {
        sessionToken = existingSession.sessionToken
    } else {
        // Créer nouvelle session
        const newSession = createSession(user._id)
        sessionToken = newSession.sessionToken
    }

    // Enregistrer tentative réussie
    createLoginAttempt(data.username, true, {
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
    })

    // Retourne uniquement les champs nécessaires
    let u = {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
        session: sessionToken
    }
    return {error: 0, status: 200, data: u}
}

/**
 * getAllUsers() renvoie un tableau d'utilisateurs dont le format est le même que celui stocké en source locale
 * @returns {{error: number, data: object[]}}
 */
function getAllUsers() {
    return {error: 0, data: users}
}

/**
 * Si un userId est fourni et qu'il correspond à un utilisateur existant, getUserProfile() renvoie le profil
 * de l'utilisateur, sinon un texte d'erreur.
 * @param userId
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: object}}
 */
function getUserProfile(userId) {
    if (!userId) {
        return {error: 1, status: 404, data: 'userId manquant'}
    }
    const profile = userProfiles.find(p => p.userId === userId)
    if (!profile) {
        return {error: 1, status: 404, data: 'profil utilisateur introuvable'}
    }
    return {error: 0, status: 200, data: profile}
}

/**
 * Si un userId est fourni et qu'il correspond à un utilisateur existant, getUserPermissions() renvoie les permissions
 * de l'utilisateur, sinon un texte d'erreur.
 * @param userId
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: object[]}}
 */
function getUserPermissions(userId) {
    if (!userId) {
        return {error: 1, status: 404, data: 'userId manquant'}
    }
    const userPermissions = permissions.filter(p => p.userId === userId && p.granted)
    return {error: 0, status: 200, data: userPermissions}
}

/**
 * Si un sessionToken est fourni et qu'il correspond à une session active, validateSession() renvoie les infos utilisateur
 * sinon un texte d'erreur.
 * @param sessionToken
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: object}}
 */
function validateSession(sessionToken) {
    if (!sessionToken) {
        return {error: 1, status: 404, data: 'token de session manquant'}
    }
    const session = sessions.find(s => s.sessionToken === sessionToken && s.isActive && new Date(s.expiresAt.$date) > new Date())
    if (!session) {
        return {error: 1, status: 404, data: 'session invalide ou expirée'}
    }
    const user = users.find(u => u._id === session.userId)
    if (!user) {
        return {error: 1, status: 404, data: 'utilisateur introuvable'}
    }
    return {error: 0, status: 200, data: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
        role: user.role
    }}
}

export default {
    login,
    getAllUsers,
    getUserProfile,
    getUserPermissions,
    validateSession,
}
