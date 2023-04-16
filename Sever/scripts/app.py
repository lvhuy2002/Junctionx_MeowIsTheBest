from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn import metrics 
import warnings
import pickle
warnings.filterwarnings('ignore')
from feature_extractor import features_extraction
from flask_cors import CORS, cross_origin
 
file = open(r"model.pkl","rb")
gbc = pickle.load(file)
file.close()

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADER'] = 'Content-Type'

@app.route("/predict", methods=["GET"])
@cross_origin(origins='*')
def predict():
    data = request.args.get('url')
    features = features_extraction(data)
    y_pred = gbc.predict(features)
    response = {
        'prediction': str(y_pred)
    }
    return jsonify(response)
@app.route("/route", methods=['POST'])
@cross_origin(origins='*')
def add_predict():
    data = request.get_json()
    urls = data['urls']
    outputs = []
    for url in urls:
        features = features_extraction(url)
        y_pred = gbc.predict(features)
        output = {'href':url,'check':str(y_pred)}
        outputs.append(output)
    response = {
        'prediction': outputs
    }
    return jsonify(response)  
    # response = {
    #     'prediction': urls
    # }
    # return jsonify(response)
    return data
if __name__ == '__main__':
    app.run(port=5000, debug=True)