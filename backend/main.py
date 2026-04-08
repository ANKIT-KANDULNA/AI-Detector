import io
import os
import numpy as np
import torch
import torch.nn as nn
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from huggingface_hub import hf_hub_download

# ── GAN Discriminator Architecture ──────────────────────────────────────────
# Must match your trained model's structure exactly.
def disc_block(in_ch, out_ch, stride=2, bn=True):
    layers = [
        nn.utils.spectral_norm(
            nn.Conv2d(in_ch, out_ch, kernel_size=4, stride=stride, padding=1, bias=False)
        ),
    ]
    if bn:
        layers.append(nn.BatchNorm2d(out_ch))
    layers.append(nn.LeakyReLU(0.2, inplace=True))
    return nn.Sequential(*layers)

class Discriminator(nn.Module):
    def __init__(self, img_channels=3, features=64):
        super().__init__()
        self.net = nn.Sequential(
            disc_block(img_channels, features, bn=False),    # 64x64 -> 32x32
            disc_block(features, features * 2),              # 32x32 -> 16x16
            disc_block(features * 2, features * 4),          # 16x16 -> 8x8
            disc_block(features * 4, features * 8),          # 8x8 -> 4x4
            nn.utils.spectral_norm(
                nn.Conv2d(features * 8, 1, kernel_size=4, stride=1, padding=0)
            ),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x).view(-1)

# ── App Setup ───────────────────────────────────────────────────────────────
app = FastAPI(title="AI Image Detector Pro", version="5.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
cnn_model = None
gan_model = None

# ── Model Loading from Hugging Face ─────────────────────────────────────────
@app.on_event("startup")
def load_models():
    global cnn_model, gan_model
    repo_id = "ankitkandulna/ai-detector-model"
    os.makedirs("./models", exist_ok=True)

    # Load CNN (TensorFlow)
    try:
        cnn_path = hf_hub_download(repo_id=repo_id, filename="best_model.h5", cache_dir="./models")
        cnn_model = tf.keras.models.load_model(cnn_path)
        print("✅ CNN Model Loaded from Hub")
    except Exception as e:
        print(f"❌ CNN Load Failed: {e}")

    # Load GAN (PyTorch)
    try:
        gan_path = hf_hub_download(repo_id=repo_id, filename="best_discriminator.pth", cache_dir="./models")
        gan_model = Discriminator().to(DEVICE)
        # Attempting state_dict load first (best practice)
        state_dict = torch.load(gan_path, map_location=DEVICE)
        gan_model.load_state_dict(state_dict if isinstance(state_dict, dict) else state_dict.state_dict())
        gan_model.eval()
        print("✅ GAN Model Loaded from Hub")
    except Exception as e:
        print(f"❌ GAN Load Failed: {e}")

# ── Preprocessing ────────────────────────────────────────────────────────────
def preprocess_image(image_bytes: bytes, target_size: tuple, mode: str):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    arr = np.array(img).astype(np.float32) / 255.0
    
    if mode == "cnn":
        return np.expand_dims(arr, axis=0) # (1, H, W, C)
    else:
        # GAN often expects [-1, 1] normalization
        arr = (arr - 0.5) / 0.5
        tensor = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0)
        return tensor.to(DEVICE)

# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {
        "status": "online",
        "models": {
            "cnn": cnn_model is not None,
            "gan": gan_model is not None
        },
        "device": str(DEVICE)
    }

@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    mode: str = Query(default="ensemble", enum=["cnn", "gan", "ensemble"])
):
    # 1. Validation
    if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Unsupported image type")
    
    image_bytes = await image.read()
    results = {}

    # 2. Run CNN Inference
    if mode in ["cnn", "ensemble"] and cnn_model:
        cnn_input = preprocess_image(image_bytes, (256, 256), "cnn")
        score = float(cnn_model.predict(cnn_input, verbose=0)[0][0])
        results["cnn"] = {
            "score": round(score, 4),
            "label": "FAKE" if score > 0.5 else "REAL"
        }

    # 3. Run GAN Inference
    if mode in ["gan", "ensemble"] and gan_model:
        gan_input = preprocess_image(image_bytes, (64, 64), "gan")
        with torch.no_grad():
            score = float(gan_model(gan_input).item())
            # Note: GANs usually output High=Real, Low=Fake. 
            # To stay consistent with CNN (High=Fake), we flip it:
            results["gan"] = {
                "score": round(1 - score, 4), 
                "label": "FAKE" if (1 - score) > 0.5 else "REAL"
            }

    # 4. Process Final Output
    if not results:
        raise HTTPException(status_code=503, detail="Requested model not available")

    # If ensemble, average the "Fake" scores
    if mode == "ensemble" and "cnn" in results and "gan" in results:
        final_score = (results["cnn"]["score"] + results["gan"]["score"]) / 2
    else:
        # Use whatever single model was requested/available
        final_score = list(results.values())[0]["score"]

    return {
        "success": True,
        "filename": image.filename,
        "mode_used": mode,
        "prediction": "FAKE" if final_score > 0.5 else "REAL",
        "confidence": round(max(final_score, 1 - final_score) * 100, 2),
        "details": results
    }