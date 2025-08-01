import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, 'data.json');

let userData = {};

// Load existing data
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    userData = JSON.parse(raw);
    console.log('✅ Loaded user data.');
  } catch (err) {
    console.error('❌ Failed to load user data:', err);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(userData, null, 2));
  } catch (err) {
    console.error('❌ Failed to save data:', err);
  }
}

function ensureUser(userId) {
  if (!userData[userId]) {
    userData[userId] = {
      coins: 1000,
      lastDailyDate: '1970-01-01',
      fifaCards: []
    };
  } else {
    if (!userData[userId].lastDailyDate) {
      userData[userId].lastDailyDate = '1970-01-01';
    }
    if (!Array.isArray(userData[userId].fifaCards)) {
      userData[userId].fifaCards = [];
    }
  }
  saveData();
}

// 💰 Coins
export function getWallet(userId) {
  ensureUser(userId);
  return userData[userId].coins;
}

export function addCoins(userId, amount) {
  ensureUser(userId);
  userData[userId].coins += amount;
  saveData();
}

export function removeCoins(userId, amount) {
  ensureUser(userId);
  if (userData[userId].coins >= amount) {
    userData[userId].coins -= amount;
    saveData();
    return true;
  }
  return false;
}

// 📅 Daily Rewards
export function getLastDaily(userId) {
  ensureUser(userId);
  return userData[userId].lastDailyDate;
}

export function setLastDaily(userId, dateStr) {
  ensureUser(userId);
  userData[userId].lastDailyDate = dateStr;
  saveData();
}

// 🏆 Leaderboard
export function getAllWallets() {
  return Object.fromEntries(
    Object.entries(userData).map(([uid, data]) => [uid, data.coins])
  );
}

// 🎴 FIFA Card Deck
export function addCard(userId, cardName) {
  ensureUser(userId);
  if (!userData[userId].fifaCards.includes(cardName)) {
    userData[userId].fifaCards.push(cardName);
    saveData();
    return true;
  }
  return false;
}

export function getCards(userId) {
  ensureUser(userId);
  return userData[userId].fifaCards;
}

export function removeCard(userId, cardName) {
  ensureUser(userId);
  const idx = userData[userId].fifaCards.indexOf(cardName);
  if (idx !== -1) {
    userData[userId].fifaCards.splice(idx, 1);
    saveData();
    return true;
  }
  return false;
}