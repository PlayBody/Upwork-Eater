export const loadProfiles = async () => {
  try {
    const response = await fetch('file:///C:/UpworkAuto/save.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error reading JSON file:', error);
  }
}

export const saveCurrentProfile = async () => {

}
