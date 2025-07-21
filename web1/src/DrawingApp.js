import- React, { useState, useRef } from 'react';

const shapeTypes = ['square', 'circle', 'triangle'];

const shapeStyles = {
  square: {
    width: 50,
    height: 50,
    backgroundColor: '#3498db',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeft: '25px solid transparent',
    borderRight: '25px solid transparent',
    borderBottom: '50px solid #f1c40f',
    backgroundColor: 'transparent',
  },
};

export default function DrawingApp() {
  const [selectedShape, setSelectedShape] = useState('square');
  const [shapesOnCanvas, setShapesOnCanvas] = useState([]);
  const fileInputRef = useRef(null);


  const onDragStart = (e, shapeType) => {
    e.dataTransfer.setData('shapeType', shapeType);
  };


  const onDrop = (e) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData('shapeType');
    if (!shapeType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapesOnCanvas((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: shapeType,
        x,
        y,
      },
    ]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const removeShape = (id) => {
    setShapesOnCanvas(shapesOnCanvas.filter((shape) => shape.id !== id));
  };

  // Export نقاشی به JSON
  const exportToJson = () => {
    const dataStr = JSON.stringify(shapesOnCanvas, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawing.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import نقاشی از JSON
  const importFromJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedShapes = JSON.parse(event.target.result);
        if (Array.isArray(importedShapes)) {
          setShapesOnCanvas(importedShapes);
        } else {
          alert('فرمت فایل نامعتبر است');
        }
      } catch {
        alert('خطا در خواندن فایل JSON');
      }
    };
    reader.readAsText(file);
  };

  // شمارش هر نوع شکل
  const countShapes = shapeTypes.reduce((acc, type) => {
    acc[type] = shapesOnCanvas.filter((shape) => shape.type === type).length;
    return acc;
  }, {});

  return (
    <div
      style={{
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        maxWidth: 900,
        margin: '40px auto',
        backgroundColor: '#f7f9fc',
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      {/* هدر */}
      <header
        style={{
          marginBottom: 30,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ margin: 0, color: '#34495e' }}>نقاشی بکش لویی</h1>

        <div>
          <button
            onClick={exportToJson}
            style={{
              marginRight: 14,
              padding: '8px 16px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(46, 204, 113, 0.4)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#27ae60')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#2ecc71')}
          >
            Export
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(52, 152, 219, 0.4)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#2980b9')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#3498db')}
          >
            Import
          </button>

          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={importFromJson}
          />
        </div>
      </header>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* سایدبار */}
        <aside
          style={{
            flexBasis: 150,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: 300,
          }}
        >
          <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#34495e' }}>
            اشکال قابل انتخاب
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            {shapeTypes.map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => onDragStart(e, type)}
                style={{
                  ...shapeStyles[type],
                  cursor: 'grab',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  userSelect: 'none',
                }}
                title={`کشیدن و رها کردن ${type}`}
              >
                {/* برای مثلث چون div خالیه، می‌توان متن نذاشت */}
              </div>
            ))}
          </div>
        </aside>

        {/* بوم نقاشی */}
        <section
          style={{
            flexGrow: 1,
            height: 400,
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          title="رها کردن شکل‌ها روی بوم"
        >
          {shapesOnCanvas.map((shape) => {
            const styleCommon = {
              position: 'absolute',
              left: shape.x,
              top: shape.y,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'transform 0.15s ease',
            };

            // اگر مثلث است، استایل مثلثی بده
            if (shape.type === 'triangle') {
              return (
                <div
                  key={shape.id}
                  onDoubleClick={() => removeShape(shape.id)}
                  style={{
                    ...styleCommon,
                    ...shapeStyles['triangle'],
                    boxShadow: '0 2px 6px rgba(241, 196, 15, 0.6)',
                  }}
                  title="مثلث - دوبار کلیک برای حذف"
                />
              );
            }

            return (
              <div
                key={shape.id}
                onDoubleClick={() => removeShape(shape.id)}
                style={{
                  ...styleCommon,
                  ...shapeStyles[shape.type],
                  boxShadow: `0 4px 8px ${
                    shape.type === 'square'
                      ? 'rgba(52, 152, 219,0.6)'
                      : 'rgba(231, 76, 60,0.6)'
                  }`,
                }}
                title={`${shape.type} - دوبار کلیک برای حذف`}
              />
            );
          })}
        </section>
      </div>

      {/* فوتر: نمایش تعداد اشکال */}
      <footer
        style={{
          marginTop: 24,
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          fontSize: 17,
          color: '#34495e',
        }}
      >
        <strong>تعداد اشکال:</strong>{' '}
        {shapeTypes.map((type, i) => (
          <span key={type} style={{ margin: '0 10px' }}>
            {type}: {countShapes[type]}
            {i < shapeTypes.length - 1 ? ',' : ''}
          </span>
        ))}
      </footer>
    </div>
  );
}