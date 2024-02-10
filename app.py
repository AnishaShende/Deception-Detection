from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the model
model = "Vinzzz03/distilroberta-dark-pattern"
classifier = pipeline("text-classification", model=model)

# # Function to classify texts in chunks
# def classify_texts_in_chunks(texts, chunk_size=512):
#     results = []
#     for i in range(0, len(texts), chunk_size):
#         chunk = texts[i:i+chunk_size]
#         chunk_results = classifier(chunk)
#         results.extend(chunk_results)
#     return results

# Function to classify texts individually
def classify_texts(texts):
    results = []
    for text in texts:
        # Classify each text individually
        prediction = classifier(text)
        results.append(prediction)
    return results

@app.route('/check-texts', methods=['POST'])
def check_texts():
    data = request.get_json()
    texts = data.get('texts')
    if texts is None:
        return jsonify({'error': 'No texts field provided.'}), 400
    
    # Classify texts in chunks
    predictions = classify_texts(texts)
    # predictions = classify_texts_in_chunks(texts)
    print("Server is running")
    print("Sending predictions (inside app.py): ", predictions)
    # Return predictions along with original text
    classified_texts = [{"text": text, "prediction": prediction} for text, prediction in zip(texts, predictions)]
    return jsonify(classified_texts)
    # return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)

# from flask import Flask, request, jsonify
# from transformers import pipeline

# app = Flask(__name__)

# # Load the model
# model = "Vinzzz03/distilroberta-dark-pattern"
# classifier = pipeline("text-classification", model=model)

# # Function to get user input and classify
# def classify_texts(texts):
#     results = classifier(texts)
#     return results
#     # return result[0]['label'], result[0]['score']

# @app.route('/check-texts', methods=['POST'])
# def check_texts():
#     data = request.get_json()
#     texts = data.get('texts')
#     if texts is None:
#         return jsonify({'error': 'No texts field provided.'}), 400
#     predictions = classify_texts(texts)
#     return jsonify(predictions)
#     # label, score = classify_text(text)
#     # return jsonify({'prediction': label, 'confidence': score})

# if __name__ == '__main__':
#     app.run(debug=True)
