# from flask import Flask, request
# import numpy as np
# import onnxruntime
# from huggingface_hub import hf_hub_download
# from flask import jsonify
# import os

# app = Flask(__name__)

# REPO_ID = "pirocheto/phishing-url-detection"
# FILENAME = "model.onnx"
# model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
# sess = onnxruntime.InferenceSession(model_path, providers=["CPUExecutionProvider"])

# @app.route("/")
# def hello():
#     return "Hello"

# @app.route("/check-url", methods=["POST"])
# def check_url():
#     try:
#         url = request.json.get("url")
#         print("Received URL:", url)
#         if not url:
#             return "No URL provided in the request.", 400

       
#         result = sess.run(None, {"inputs": np.array([url], dtype="str")})[1]

        
#         return jsonify({"prediction": f"{result[0][1] * 100:.2f} %"})

#     except Exception as e:
#         print("Error:", e)
#         return "Internal server error.", 500

# if __name__ == "__main__":
#     port = int(os.environ.get('PORT', 5000))
#     app.run(host='0.0.0.0', port=port)
from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the model
model = "Vinzzz03/distilroberta-dark-pattern"
classifier = pipeline("text-classification", model=model)

# Function to get user input and classify
def classify_texts(texts):
    results = classifier(texts)
    return results
    # return result[0]['label'], result[0]['score']

@app.route('/check-texts', methods=['POST'])
def check_texts():
    data = request.get_json()
    texts = data.get('texts')
    if texts is None:
        return jsonify({'error': 'No texts field provided.'}), 400
    predictions = classify_texts(texts)
    return jsonify(predictions)
    # label, score = classify_text(text)
    # return jsonify({'prediction': label, 'confidence': score})

if __name__ == '__main__':
    app.run(debug=True)

# Main function
# def main():
#     while True:
#         # Get user input
#         user_input = input("Enter text to classify (type 'exit' to end): ")

#         # Check if the user wants to exit
#         if user_input.lower() == 'exit':
#             break

#         # Classify the text
#         label, score = classify_text(user_input)

#         # Display the result
#         print(f"Prediction: {label}, Confidence: {score}")

# if __name__ == "__main__":
#     main()


# url: http://127.0.0.1:5000/check-text