// Base de données simulée pour les utilisateurs
let users = [
  {"_id":"6476f0e1c7e21b2b33a35d01","username":"admin","password":"admin123","email":"admin@example.com","role":"admin","firstName":"Administrateur","lastName":"Système","isActive":true,"createdAt":{"$date":"2024-01-01T00:00:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35d02","username":"user1","password":"password123","email":"user1@example.com","role":"user","firstName":"Jean","lastName":"Dupont","isActive":true,"createdAt":{"$date":"2024-01-15T10:30:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35d03","username":"marie.martin","password":"marie2024","email":"marie.martin@example.com","role":"user","firstName":"Marie","lastName":"Martin","isActive":true,"createdAt":{"$date":"2024-02-01T14:20:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35d04","username":"pierre.bernard","password":"pierre456","email":"pierre.bernard@example.com","role":"moderator","firstName":"Pierre","lastName":"Bernard","isActive":true,"createdAt":{"$date":"2024-02-10T09:45:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35d05","username":"sophie.leroy","password":"sophie789","email":"sophie.leroy@example.com","role":"user","firstName":"Sophie","lastName":"Leroy","isActive":false,"createdAt":{"$date":"2024-01-20T16:15:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35d06","username":"demo","password":"demo","email":"demo@example.com","role":"user","firstName":"Utilisateur","lastName":"Démonstration","isActive":true,"createdAt":{"$date":"2024-03-01T08:00:00.000Z"}},
];

let sessions = [
  {"_id":"6476f0e1c7e21b2b33a35s01","userId":"6476f0e1c7e21b2b33a35d01","sessionToken":"550e8400-e29b-41d4-a716-446655440000","createdAt":{"$date":"2024-09-29T10:00:00.000Z"},"expiresAt":{"$date":"2024-09-30T10:00:00.000Z"},"isActive":true},
  {"_id":"6476f0e1c7e21b2b33a35s02","userId":"6476f0e1c7e21b2b33a35d02","sessionToken":"6ba7b810-9dad-11d1-80b4-00c04fd430c8","createdAt":{"$date":"2024-09-29T11:30:00.000Z"},"expiresAt":{"$date":"2024-09-30T11:30:00.000Z"},"isActive":true},
];

let loginAttempts = [
  {"_id":"6476f0e1c7e21b2b33a35l01","username":"admin","success":true,"ipAddress":"192.168.1.100","userAgent":"Mozilla/5.0","timestamp":{"$date":"2024-09-29T09:00:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35l02","username":"admin","success":false,"ipAddress":"192.168.1.101","userAgent":"Mozilla/5.0","timestamp":{"$date":"2024-09-29T08:45:00.000Z"},"reason":"wrong_password"},
  {"_id":"6476f0e1c7e21b2b33a35l03","username":"user1","success":true,"ipAddress":"192.168.1.102","userAgent":"Chrome/118.0","timestamp":{"$date":"2024-09-29T11:30:00.000Z"}},
];

let permissions = [
  {"_id":"6476f0e1c7e21b2b33a35p01","userId":"6476f0e1c7e21b2b33a35d01","resource":"admin_panel","action":"read","granted":true},
  {"_id":"6476f0e1c7e21b2b33a35p02","userId":"6476f0e1c7e21b2b33a35d01","resource":"user_management","action":"write","granted":true},
  {"_id":"6476f0e1c7e21b2b33a35p03","userId":"6476f0e1c7e21b2b33a35d04","resource":"moderation","action":"read","granted":true},
  {"_id":"6476f0e1c7e21b2b33a35p04","userId":"6476f0e1c7e21b2b33a35d04","resource":"moderation","action":"write","granted":true},
];

let userProfiles = [
  {"_id":"6476f0e1c7e21b2b33a35u01","userId":"6476f0e1c7e21b2b33a35d01","avatar":"https://example.com/avatar1.jpg","bio":"Administrateur système","preferences":{"theme":"dark","language":"fr","notifications":true},"lastLogin":{"$date":"2024-09-29T09:00:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35u02","userId":"6476f0e1c7e21b2b33a35d02","avatar":"https://example.com/avatar2.jpg","bio":"Utilisateur standard","preferences":{"theme":"light","language":"fr","notifications":false},"lastLogin":{"$date":"2024-09-29T11:30:00.000Z"}},
  {"_id":"6476f0e1c7e21b2b33a35u03","userId":"6476f0e1c7e21b2b33a35d03","avatar":"https://example.com/avatar3.jpg","bio":"Designer graphique","preferences":{"theme":"auto","language":"fr","notifications":true},"lastLogin":{"$date":"2024-09-28T14:15:00.000Z"}},
];

export {
  users,
  sessions,
  loginAttempts,
  permissions,
  userProfiles,
};
