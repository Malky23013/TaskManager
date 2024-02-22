const express = require('express');
const axios = require('axios'); // ייבוא הספרייה axios לביצוע קריאות HTTP

const app = express();

// קביעת נקודת גישה GET שתחזיר את רשימת האפליקציות מחשבון ה-Render
app.get('/applications', async (req, res) => {
    try {
        // הפעלת קריאת HTTP GET ל-Render API לקבלת רשימת האפליקציות
        const response = await axios.get('https://api.render.com/v1/services?limit=20', {
            headers: {
                'Authorization': 'Bearer rnd_LFlgxVfo4HJ4xCWMM7iDVveCgVNd'
            }
        });
        
        // שליפת הרשימת האפליקציות מהתשובה
        const applications = response.data?.map(service => service.service.name);
       console.log(response.data);
        
        // שליחת הרשימה כתגובה בפורמט JSON
        res.json(applications);
    } catch (error) {
        // במקרה של שגיאה בקריאת ה-API, שליחת הודעת שגיאה בפורמט JSON
        res.status(500).json({ error: error.message });
    }
});

// הגדרת הפורט לפתיחת השרת
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
