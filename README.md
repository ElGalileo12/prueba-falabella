# Prueba Técnica - Falabella Colombia

Prueba técnica desarrollada con **Django REST Framework** (backend) y **Vite + React + TypeScript** (frontend).

---

## Estructura del proyecto

falabella-prueba
backend # Backend Django REST Framework
frontend # Frontend Vite + React + TypeScript
README.md # Documentación e instrucciones

## Requisitos

- Python 3.10+
- Node.js 16+
- npm o yarn
- Git

---

## Instalación y ejecución

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver
```

El backend estará disponible en: http://127.0.0.1:8000/

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Crear un archivo .env y agregar la sigueinte variable de entorno 
VITE_API_URL=http://127.0.0.1:8000/api

El frontend estará disponible en: http://localhost:5173/

---

### Datos de prueba

Cliente VIP cargado por seed:

Documento: 1234

Nombre: Pedro Pérez

Email: pedro.perez@example.com

Compras: > 5.000.000 COP en el último mes
