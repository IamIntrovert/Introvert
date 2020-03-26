// @flow
import AsyncStorage from "@react-native-community/async-storage";

const FILE_NAMES_KEY = 'FILE_NAMES_KEY';

async function saveImageInfo(fileInfo: FileInfo) {
  try {
    const files = await loadAllImages();
    files.push(fileInfo);
    await AsyncStorage.setItem(FILE_NAMES_KEY, JSON.stringify(files));
  } catch (error) {
    // Error saving data
  }
}

async function saveAllImages(filesInfo: FileInfo) {
  try {
    await AsyncStorage.setItem(FILE_NAMES_KEY, JSON.stringify(filesInfo));
  } catch (error) {
    // Error saving data
  }
}

async function loadAllImages() {
  try {
    const rawValue = await AsyncStorage.getItem(FILE_NAMES_KEY);
    if (rawValue !== null) {
      return JSON.parse(rawValue) || [];
    }
  } catch (error) {
    // Error retrieving data
  }

  return [];
}

async function saveFlag(keyName: string, value: boolean) {
  try {
    await AsyncStorage.setItem(keyName, JSON.stringify(value));
  } catch (error) {
    // Error saving data
  }
}

async function getFlag(keyName: string) {
  try {
    const rawValue = await AsyncStorage.getItem(keyName);
    if (rawValue !== null) {
      return JSON.parse(rawValue) || false;
    }
  } catch (error) {
    // Error saving data
  }

  return false;
}

export default {
  saveImageInfo,
  saveAllImages,
  loadAllImages,
  saveFlag,
  getFlag,
};
