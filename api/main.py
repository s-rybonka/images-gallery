import os

import requests
from dotenv import load_dotenv
from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS

from mongo_client import mongo_client


load_dotenv(dotenv_path="./.env.local")
# DB
gallery = mongo_client.gallery
# Table
images_collection = gallery.images

UNSPLASH_URL = "https://api.unsplash.com/photos/random"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY", "")
DEBUG = bool(os.environ.get("DEBUG", True))

if not UNSPLASH_KEY:
    raise EnvironmentError(
        "Please create .env.local file and insert there UNSPLASH_KEY"
    )

app = Flask(__name__)
CORS(app)

app.config["DEBUG"] = DEBUG


@app.route("/new-image/")
def new_image():
    word = request.args.get("query", "")
    headers = {
        "Accept-Version": "v1",
        "Authorization": "Client-ID " + UNSPLASH_KEY,
    }
    params = {"query": word}
    response = requests.get(url=UNSPLASH_URL, headers=headers, params=params)
    data = response.json()
    return data


@app.route("/images", methods=['GET', 'POST'])
def images():
    if request.method == 'GET':
        images_cursor = images_collection.find({})
        return jsonify([i for i in images_cursor])
    if request.method == 'POST':
        image = request.get_json()
        image["_id"] = image.get('id')
        res = images_collection.insert_one(image)
        inserted_id = res.inserted_id
        return {'id': inserted_id, "message": "Image added"}


@app.route('/images/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    existing_img = images_collection.find_one({'_id': image_id})
    existing_img_title = existing_img['title']
    res = images_collection.delete_one({'_id': image_id})

    if res.deleted_count:
        return {"deleted_img_id": image_id, "title": existing_img_title}
    else:
        return {
            "error": "Image not found"
        }, 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
