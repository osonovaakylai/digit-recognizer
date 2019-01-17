import base64
import os
import re
import uuid

import numpy as np
from flask import Flask, jsonify
from flask import request
from flask_cors import cross_origin
from imageio import imread
from keras.models import load_model
from skimage.transform import resize

app = Flask(__name__)

model = None

MODEL_PATH = 'models/mnist.h5'


def load_keras_model():
    global model
    model = load_model(MODEL_PATH)


@app.route('/api/v1/recognize', methods=['POST'])
@cross_origin(allow_headers=['Content-Type', "Access-Control-Allow-Credentials"])
def recognize():
    image_data = re.sub('^data:image/.+;base64,', '', request.form['image'])
    image_data = base64.b64decode(image_data)

    filename = "{}.{}".format(uuid.uuid4(), "png")
    with open(filename, "wb") as f:
        f.write(image_data)

    temp_image = imread(filename, pilmode="L")
    temp_image = np.invert(temp_image)
    temp_image = resize(temp_image, output_shape=(28, 28), mode='reflect')
    temp_image = temp_image.reshape(1, 28, 28, 1).astype('float32')

    if os.path.exists(filename):
        os.remove(filename)

    predicted = model.predict(temp_image)
    label = np.argmax(predicted)
    probability = predicted[0][label]
    return jsonify({'label': str(label), "probability": str(probability)})


if __name__ == "__main__":
    load_keras_model()
    app.run(port=8080, debug=False, threaded=False)
