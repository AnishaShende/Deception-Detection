from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the model
model = "Vinzzz03/distilroberta-dark-pattern"
classifier = pipeline("text-classification", model=model)

# Function to classify texts individually
def classify_texts(texts):
    results = []
    for text in texts:
        # Classify each text individually
        prediction = classifier(text, max_length=512)
        results.append(prediction)
    return results

@app.route('/check-texts', methods=['POST'])
def check_texts():
    data = request.get_json()
    texts = data.get('texts')
    if texts is None:
        return jsonify({'error': 'No texts field provided.'}), 400
    
    # Remove duplicate texts
    unique_texts = list(set(texts))

    # Classify texts in chunks
    predictions = classify_texts(unique_texts)
    # predictions = classify_texts_in_chunks(texts)
    print("Server is running")
    print("Sending predictions (inside app.py): ", predictions)
    # Return predictions along with original text
    classified_texts = [{"text": text, "prediction": prediction} for text, prediction in zip(texts, predictions)]
    return jsonify(classified_texts)
    # return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
