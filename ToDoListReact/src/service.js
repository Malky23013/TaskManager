import axios from 'axios';

import Config from './config.js'; // יבוא של קובץ ההגדרות

const apiUrl = Config.apiUrl; // השתמש בכתובת ה־API מתוך ה־Config Defaults

export default {
  getTasks: async () => {
    const result = await axios.get(`${apiUrl}/tasks`)    
    return result.data;
  },
  addTask: async(name) => {
    const result = await axios.post(`${apiUrl}/tasks`, { name });
    return result.data;
  },

  setCompleted: async (id, isComplete,name) => { // Updated function signature
    console.log("setted successfuly");
    var Iscomplete=isComplete;
    const result = await axios.put(`${apiUrl}/tasks/${id}`, { Iscomplete,name }); // Updated call to axios.put
    console.log(result.data);
    return result.data;
  },
  deleteTask: async(id) => {
    const result = await axios.delete(`${apiUrl}/tasks/${id}`);
    return result.data;
  }
};
