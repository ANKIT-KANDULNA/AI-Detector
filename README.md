# 🔍 AI Image Detector

A full-stack deep learning application that detects whether an image is **AI-generated** or **real** using an ensemble of a **Custom CNN** and a **GAN Discriminator**. Built with a **Next.js** frontend and a **FastAPI** backend, deployed on **Render**.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0-red?logo=pytorch)
![TensorFlow Lite](https://img.shields.io/badge/TFLite-FP16-orange?logo=tensorflow)
![Render](https://img.shields.io/badge/Deployed_on-Render-purple?logo=render)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Internal Working](#-internal-working)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Model Details](#-model-details)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

- 🧠 **Dual Model Inference** — Choose between CNN, GAN, or Ensemble mode
- ⚡ **Optimized for Free Tier** — TFLite FP16 quantized model (~28 MB vs 178 MB Keras)
- 🎨 **Modern Dark UI** — Glassmorphism, animated grid background, Framer Motion transitions
- 📊 **Confidence Visualization** — Animated confidence bar with contextual interpretation
- 🖱️ **Drag & Drop Upload** — Intuitive image upload with live preview
- 🔄 **Real-time API Health Check** — Live backend status indicator on homepage
- 🌐 **CORS Enabled** — Frontend and backend can run on different origins
- 🚀 **One-click Deploy** — `render.yaml` blueprint for instant Render deployment

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js 14 (App Router)                  │  │
│  │  ┌─────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │  Home   │  │ Image Upload │  │  Result Card │     │  │
│  │  │ page.tsx│  │  Component   │  │  Component   │     │  │
│  │  └────┬────┘  └──────┬───────┘  └──────────────┘     │  │
│  │       │              │                                │  │
│  │       │    ┌─────────▼──────────┐                     │  │
│  │       └────► lib/api.ts (Fetch) │                     │  │
│  │            └─────────┬──────────┘                     │  │
│  └──────────────────────┼────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │  HTTP POST /predict?mode=cnn|gan|ensemble
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVER (FastAPI + Gunicorn)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    main.py                            │  │
│  │  ┌──────────────┐       ┌──────────────────────────┐  │  │
│  │  │  CNN Model   │       │    GAN Discriminator     │  │  │
│  │  │  (TFLite     │       │    (PyTorch)             │  │  │
│  │  │   FP16)      │       │                          │  │  │
│  │  │  256×256     │       │    64×64                 │  │  │
│  │  │  [0,1] norm  │       │    [-1,1] norm           │  │  │
│  │  └──────┬───────┘       └────────────┬─────────────┘  │  │
│  │         │    Ensemble Averaging      │                │  │
│  │         └────────────┬───────────────┘                │  │
│  │                      ▼                                │  │
│  │            Final Prediction JSON                      │  │
│  └───────────────────────────────────────────────────────┘  │
│  Models downloaded from: huggingface.co/ankitkandulna/      │
│                          ai-detector-model                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | React framework with SSR, file-based routing |
| **TypeScript** | Type-safe frontend code |
| **Tailwind CSS 3.4** | Utility-first styling with custom design tokens |
| **Framer Motion 11** | Smooth animations (result pop-in, confidence bar) |
| **React 18** | UI component library |

### Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance async Python API framework |
| **Uvicorn + Gunicorn** | ASGI server with process management |
| **TensorFlow Lite** | Optimized CNN inference (FP16 quantized) |
| **PyTorch** | GAN Discriminator inference |
| **Pillow** | Image preprocessing & resizing |
| **Hugging Face Hub** | Model hosting & version-controlled downloads |
| **NumPy** | Numerical array operations for preprocessing |

### DevOps & Deployment

| Technology | Purpose |
|---|---|
| **Render** | Cloud hosting (free tier) with `render.yaml` blueprint |
| **Hugging Face Hub** | Model artifact storage (`ankitkandulna/ai-detector-model`) |
| **Git** | Version control |

---

## ⚙️ Internal Working

### 1. Image Upload Flow

```
User drops/selects image
       │
       ▼
ImageUploader.tsx validates file type (JPG/PNG/WebP)
       │
       ▼
FileReader generates base64 preview → displayed instantly
       │
       ▼
lib/api.ts sends POST /predict with FormData + mode query param
       │
       ▼
FastAPI receives UploadFile, reads bytes
       │
       ▼
preprocess_image() resizes & normalizes based on model type
       │
       ├──► CNN: 256×256, [0,1] float32, shape (1,H,W,C)
       │
       └──► GAN: 64×64, [-1,1] float32, PyTorch tensor (1,C,H,W)
       │
       ▼
Model inference → raw score [0,1]
       │
       ▼
Score > 0.5 → "FAKE" | Score ≤ 0.5 → "REAL"
       │
       ▼
JSON response with prediction, confidence %, per-model details
```

### 2. CNN Model Pipeline

- **Architecture**: Custom Convolutional Neural Network trained on real vs AI-generated images
- **Original Format**: Keras `.h5` (~178 MB)
- **Production Format**: TFLite FP16 quantized (~28 MB) — converted via `convert.py`
- **Input**: `256×256×3` RGB image normalized to `[0, 1]`
- **Output**: Single sigmoid score — `> 0.5` = FAKE, `≤ 0.5` = REAL
- **Optimization**: FP16 quantization reduces model size by **~84%** while maintaining accuracy, crucial for Render's free tier (512 MB RAM)

### 3. GAN Discriminator Pipeline

- **Architecture**: DCGAN-style Discriminator with Spectral Normalization
  - 5-layer CNN: `3→64→128→256→512→1`
  - `4×4` kernels, stride 2, LeakyReLU(0.2)
  - BatchNorm on all layers except first
  - Sigmoid final activation
- **Input**: `64×64×3` RGB image normalized to `[-1, 1]`
- **Output**: Sigmoid score where **high = real** (GAN convention). Score is **inverted** (`1 - score`) to match CNN convention (high = fake)
- **Source**: Downloaded from Hugging Face Hub at startup (`best_discriminator.pth`)

### 4. Ensemble Mode

When `mode=ensemble`:
```
final_score = (cnn_fake_score + gan_fake_score) / 2
```
Both models independently classify the image, and their "fake" scores are averaged. This reduces false positives from either model acting alone.

### 5. Frontend Component Architecture

```
RootLayout (Server Component)
├── GridBackground — decorative dot grid + glow effects
├── Navbar — site navigation (Server Component)
└── {children} — active page
    ├── page.tsx (Home) — API health check + navigation
    └── image/page.tsx — detection page
        └── ImageUploader (Client Component)
            ├── Model selector (CNN / GAN toggle)
            ├── Drag & drop zone with live preview
            ├── Loading spinner overlay
            ├── ResultCard — animated prediction display
            │   ├── Verdict badge (REAL / FAKE)
            │   ├── Animated confidence bar
            │   └── Contextual interpretation text
            └── Error display with retry
```

### 6. Model Loading (Startup)

On `FastAPI.on_event("startup")`:
1. **CNN**: Loads local `best_model_fp16.tflite` → allocates TFLite tensors
2. **GAN**: Downloads `best_discriminator.pth` from Hugging Face Hub → loads PyTorch state dict → sets to eval mode
3. Both models are loaded into global scope for zero-latency inference on requests

---

## 📂 Project Structure

```
ai-detector/
├── render.yaml                    # Render deployment blueprint
├── .gitignore                     # Git ignore rules
│
├── backend/
│   ├── main.py                    # FastAPI app — routes, model loading, inference
│   ├── convert.py                 # Script to convert Keras .h5 → TFLite FP16
│   ├── requirements.txt           # Python dependencies
│   ├── best_model_fp16.tflite     # Quantized CNN model (~28 MB)
│   ├── .python-version            # Python version lock (3.11)
│   ├── dataset/
│   │   ├── Training/              # Training images (real + fake)
│   │   ├── Validation/            # Validation images
│   │   └── Testing/               # Test images
│   ├── notebooks/
│   │   ├── ai-detector-final-customcnn.ipynb    # CNN training notebook
│   │   ├── ai-detector-final-gan.ipynb          # GAN training notebook
│   │   └── ai-detector-final-improved.ipynb     # Improved CNN experiments
│   ├── models/                    # Downloaded HF models (gitignored)
│   ├── models_gan/                # GAN model weights
│   └── models_improved/           # Improved model experiments
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx             # Root layout — Navbar, GridBackground, fonts
│   │   ├── page.tsx               # Homepage — API health check + navigation
│   │   ├── globals.css            # Tailwind layers + custom utilities
│   │   └── image/
│   │       └── page.tsx           # Image detection page
│   ├── components/
│   │   ├── ImageUploader.tsx      # Drag & drop upload + model selector
│   │   ├── ResultCard.tsx         # Animated prediction result display
│   │   ├── Navbar.tsx             # Top navigation bar
│   │   └── GridBackground.tsx     # Decorative background grid + glow
│   ├── lib/
│   │   └── api.ts                 # API client — predictImage(), checkHealth()
│   ├── tailwind.config.js         # Custom colors, fonts, animations
│   ├── next.config.js             # Next.js configuration
│   ├── tsconfig.json              # TypeScript configuration
│   └── package.json               # Node.js dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** 3.11
- **pip** (Python package manager)

### 1. Clone the Repository

```bash
git clone https://github.com/ankitkandulna/ai-detector.git
cd ai-detector
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the interactive Swagger UI.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run the dev server
npm run dev
```

The app will be live at `http://localhost:3000`.

---

## 📡 API Documentation

### `GET /` — Health Check

Returns the server status and loaded models.

**Response:**
```json
{
  "status": "online",
  "models": {
    "cnn": true,
    "gan": true
  },
  "device": "cpu"
}
```

### `POST /predict` — Image Prediction

Classifies an uploaded image as REAL or FAKE.

**Query Parameters:**

| Parameter | Type | Default | Options | Description |
|---|---|---|---|---|
| `mode` | string | `ensemble` | `cnn`, `gan`, `ensemble` | Which model(s) to use |

**Request Body:** `multipart/form-data` with an `image` field (JPEG, PNG, or WebP)

**Response:**
```json
{
  "success": true,
  "filename": "test_image.jpg",
  "mode_used": "ensemble",
  "prediction": "FAKE",
  "confidence": 87.45,
  "details": {
    "cnn": {
      "score": 0.8921,
      "label": "FAKE"
    },
    "gan": {
      "score": 0.8569,
      "label": "FAKE"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/predict?mode=cnn" \
  -F "image=@test_image.jpg"
```

---

## 🧠 Model Details

### CNN (Custom Convolutional Neural Network)

| Property | Value |
|---|---|
| Input Size | 256 × 256 × 3 |
| Original Size | ~178 MB (Keras .h5) |
| Production Size | ~28 MB (TFLite FP16) |
| Normalization | [0, 1] |
| Output | Sigmoid (>0.5 = FAKE) |
| Training Notebook | `notebooks/ai-detector-final-customcnn.ipynb` |

### GAN Discriminator (DCGAN with Spectral Norm)

| Property | Value |
|---|---|
| Input Size | 64 × 64 × 3 |
| Model Size | ~11 MB (.pth) |
| Normalization | [-1, 1] |
| Architecture | 5-layer DCGAN Discriminator |
| Output | Sigmoid (inverted: >0.5 = FAKE) |
| Training Notebook | `notebooks/ai-detector-final-gan.ipynb` |

### Model Hosting

Models are hosted on [Hugging Face Hub](https://huggingface.co/ankitkandulna/ai-detector-model):
- `best_model.h5` — Original Keras CNN
- `best_discriminator.pth` — GAN Discriminator weights

The CNN is pre-converted to TFLite FP16 (`best_model_fp16.tflite`) and bundled with the backend to avoid downloading the large Keras model on Render's free tier.

---

## ☁️ Deployment

### Render (Recommended)

The project includes a `render.yaml` blueprint for one-click deployment:

```yaml
services:
  - type: web
    name: ai-detector-backend
    env: python
    plan: free
    region: oregon
    rootDir: backend
    buildCommand: pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
    startCommand: gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:10000 --timeout 120
```

**Steps:**
1. Push to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Blueprint** → Connect your repo
4. Render auto-detects `render.yaml` and deploys

### Environment Variables

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Frontend `.env.local` | Backend API URL |
| `PYTHON_VERSION` | Render (auto-set) | Python version (3.11.0) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---
