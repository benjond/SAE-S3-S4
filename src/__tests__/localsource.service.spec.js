import { describe, it, expect, beforeEach, vi } from 'vitest'
import localsourceService from '@/services/localsource.service.js'
import { users, sessions, loginAttempts } from '@/datasource/login.js'

describe('localsource.service - login', () => {
  
  beforeEach(() => {
    // Nettoyer les sessions et tentatives avant chaque test
    sessions.length = 0
    loginAttempts.length = 0
    
    // Remettre des sessions valides (dates futures)
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1) // Expire demain

    sessions.push(
      {"_id":"6476f0e1c7e21b2b33a35s01","userId":"6476f0e1c7e21b2b33a35d01","sessionToken":"550e8400-e29b-41d4-a716-446655440000","createdAt":{"$date":"2024-09-29T10:00:00.000Z"},"expiresAt":{"$date":futureDate.toISOString()},"isActive":true},
      {"_id":"6476f0e1c7e21b2b33a35s02","userId":"6476f0e1c7e21b2b33a35d02","sessionToken":"6ba7b810-9dad-11d1-80b4-00c04fd430c8","createdAt":{"$date":"2024-09-29T11:30:00.000Z"},"expiresAt":{"$date":futureDate.toISOString()},"isActive":true}
    )
  })

  describe('Cas d\'échec', () => {
    it('devrait retourner une erreur si username manquant', () => {
      const loginData = { password: 'admin123' }
      const result = localsourceService.login(loginData)
      
      expect(result).toEqual({
        error: 1,
        status: 404,
        data: 'aucun login/pass fourni'
      })
    })

    it('devrait retourner une erreur si password manquant', () => {
      const loginData = { username: 'admin' }
      const result = localsourceService.login(loginData)
      
      expect(result).toEqual({
        error: 1,
        status: 404,
        data: 'aucun login/pass fourni'
      })
    })

    it('devrait retourner une erreur si username et password manquants', () => {
      const loginData = {}
      const result = localsourceService.login(loginData)
      
      expect(result).toEqual({
        error: 1,
        status: 404,
        data: 'aucun login/pass fourni'
      })
    })

    it('devrait retourner une erreur pour des identifiants incorrects', () => {
      const loginData = {
        username: 'wronguser',
        password: 'wrongpass',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0'
      }
      const result = localsourceService.login(loginData)
      
      expect(result).toEqual({
        error: 1,
        status: 404,
        data: 'login/pass incorrect'
      })
      
      // Vérifier qu'une tentative échouée a été enregistrée
      expect(loginAttempts.length).toBeGreaterThan(0)
      const lastAttempt = loginAttempts[loginAttempts.length - 1]
      expect(lastAttempt.username).toBe('wronguser')
      expect(lastAttempt.success).toBe(false)
      expect(lastAttempt.reason).toBe('invalid_credentials')
    })

    it('devrait retourner une erreur pour un utilisateur inactif', () => {
      const loginData = {
        username: 'sophie.leroy', // Utilisateur avec isActive: false
        password: 'sophie789',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0'
      }
      const result = localsourceService.login(loginData)
      
      expect(result).toEqual({
        error: 1,
        status: 404,
        data: 'login/pass incorrect'
      })
    })
  })

  describe('Cas de succès', () => {
    it('devrait réussir le login avec des identifiants valides et session existante', () => {
      const loginData = {
        username: 'admin',
        password: 'admin123',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0'
      }
      const result = localsourceService.login(loginData)
      
      expect(result.error).toBe(0)
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('_id', '6476f0e1c7e21b2b33a35d01')
      expect(result.data).toHaveProperty('name', 'Administrateur Système')
      expect(result.data).toHaveProperty('username', 'admin')
      expect(result.data).toHaveProperty('email', 'admin@example.com')
      expect(result.data).toHaveProperty('session', '550e8400-e29b-41d4-a716-446655440000')
      
      // Vérifier qu'une tentative réussie a été enregistrée
      expect(loginAttempts.length).toBeGreaterThan(0)
      const lastAttempt = loginAttempts[loginAttempts.length - 1]
      expect(lastAttempt.username).toBe('admin')
      expect(lastAttempt.success).toBe(true)
    })

    it('devrait créer une nouvelle session si aucune session active', () => {
      // Supprimer les sessions existantes
      sessions.length = 0
      
      const loginData = {
        username: 'admin',
        password: 'admin123',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0'
      }
      const result = localsourceService.login(loginData)
      
      expect(result.error).toBe(0)
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('_id', '6476f0e1c7e21b2b33a35d01')
      expect(result.data).toHaveProperty('name', 'Administrateur Système')
      expect(result.data).toHaveProperty('username', 'admin')
      expect(result.data).toHaveProperty('email', 'admin@example.com')
      expect(result.data).toHaveProperty('session')
      
      // Vérifier qu'une nouvelle session a été créée
      expect(sessions).toHaveLength(1)
      expect(sessions[0].userId).toBe('6476f0e1c7e21b2b33a35d01')
      expect(sessions[0].isActive).toBe(true)
      expect(result.data.session).toBe(sessions[0].sessionToken)
    })

    it('devrait réussir le login pour tous les utilisateurs actifs', () => {
      // Supprimer les sessions pour ce test
      sessions.length = 0

      const testUsers = [
        { username: 'admin', password: 'admin123', expectedName: 'Administrateur Système' },
        { username: 'user1', password: 'password123', expectedName: 'Jean Dupont' },
        { username: 'marie.martin', password: 'marie2024', expectedName: 'Marie Martin' },
        { username: 'pierre.bernard', password: 'pierre456', expectedName: 'Pierre Bernard' },
        { username: 'demo', password: 'demo', expectedName: 'Utilisateur Démonstration' }
      ]
      
      testUsers.forEach(testUser => {
        const loginData = {
          username: testUser.username,
          password: testUser.password,
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0'
        }
        const result = localsourceService.login(loginData)
        
        expect(result.error).toBe(0)
        expect(result.status).toBe(200)
        expect(result.data.name).toBe(testUser.expectedName)
        expect(result.data.username).toBe(testUser.username)
        expect(result.data).toHaveProperty('session')
      })
    })
  })

  describe('Gestion des sessions', () => {
    it('devrait utiliser une session existante valide', () => {
      const loginData = {
        username: 'admin',
        password: 'admin123'
      }
      
      // Premier login
      const result1 = localsourceService.login(loginData)
      const sessionToken1 = result1.data.session
      
      // Deuxième login - devrait utiliser la même session
      const result2 = localsourceService.login(loginData)
      const sessionToken2 = result2.data.session
      
      expect(sessionToken1).toBe(sessionToken2)
      expect(sessionToken1).toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('devrait créer une nouvelle session si la session existante est expirée', () => {
      // Modifier la session existante pour qu'elle soit expirée
      sessions[0].expiresAt = { "$date": "2024-09-28T10:00:00.000Z" } // Date passée
      
      const loginData = {
        username: 'admin',
        password: 'admin123'
      }
      const result = localsourceService.login(loginData)
      
      expect(result.error).toBe(0)
      expect(result.status).toBe(200)
      
      // Le token de session devrait être différent du token expiré
      expect(result.data.session).not.toBe('550e8400-e29b-41d4-a716-446655440000')
      
      // Une nouvelle session devrait avoir été créée
      expect(sessions.length).toBeGreaterThanOrEqual(2)
    })

    it('devrait créer une nouvelle session si la session existante est inactive', () => {
      // Désactiver la session existante
      sessions[0].isActive = false
      
      const loginData = {
        username: 'admin',
        password: 'admin123'
      }
      const result = localsourceService.login(loginData)
      
      expect(result.error).toBe(0)
      expect(result.status).toBe(200)
      
      // Le token de session devrait être différent du token inactif
      expect(result.data.session).not.toBe('550e8400-e29b-41d4-a716-446655440000')
      
      // Une nouvelle session devrait avoir été créée
      expect(sessions.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Enregistrement des tentatives de login', () => {
    it('devrait enregistrer les informations IP et UserAgent', () => {
      const loginData = {
        username: 'admin',
        password: 'admin123',
        ipAddress: '203.0.113.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
      
      localsourceService.login(loginData)
      
      expect(loginAttempts.length).toBeGreaterThan(0)
      const lastAttempt = loginAttempts[loginAttempts.length - 1]
      expect(lastAttempt.ipAddress).toBe('203.0.113.1')
      expect(lastAttempt.userAgent).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    })

    it('devrait enregistrer "unknown" si IP et UserAgent non fournis', () => {
      const loginData = {
        username: 'admin',
        password: 'admin123'
      }
      
      localsourceService.login(loginData)
      
      expect(loginAttempts.length).toBeGreaterThan(0)
      const lastAttempt = loginAttempts[loginAttempts.length - 1]
      expect(lastAttempt.ipAddress).toBe('unknown')
      expect(lastAttempt.userAgent).toBe('unknown')
    })
  })
})
