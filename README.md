# 🎨 DrawingApp - اپلیکیشن طراحی اشکال در React

اپلیکیشنی ساده برای کشیدن شکل‌های هندسی (مربع، دایره، مثلث) بر روی بوم نقاشی. اشکال قابلیت درگ و دراپ، حذف، شمارش و ذخیره/بارگذاری از فایل JSON دارند.

## 🧱 ساختار اولیه

```js
import React, { useState, useRef } from 'react';

const shapeTypes = ['square', 'circle', 'triangle'];

const shapeStyles = {
  square: { width: 50, height: 50, backgroundColor: '#3498db' },
  circle: { width: 50, height: 50, borderRadius: '50%', backgroundColor: '#e74c3c' },
  triangle: {
    width: 0,
    height: 0,
    borderLeft: '25px solid transparent',
    borderRight: '25px solid transparent',
    borderBottom: '50px solid #f1c40f',
    backgroundColor: 'transparent',
  },
};
'''
🧠 استیت‌ها و رفرنس‌ها
const [selectedShape, setSelectedShape] = useState('square');
const [shapesOnCanvas, setShapesOnCanvas] = useState([]);
const fileInputRef = useRef(null);
