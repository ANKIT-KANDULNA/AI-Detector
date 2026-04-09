import tensorflow as tf
from huggingface_hub import hf_hub_download

print("Downloading model...")
cnn_path = hf_hub_download(repo_id="ankitkandulna/ai-detector-model", filename="best_model.h5")
print("Loading Keras model...")
model = tf.keras.models.load_model(cnn_path)
print("Converting to TFLite (Float16)...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.float16]
tflite_model = converter.convert()

with open("best_model_fp16.tflite", "wb") as f:
    f.write(tflite_model)
print("Done! Saved as best_model_fp16.tflite")
