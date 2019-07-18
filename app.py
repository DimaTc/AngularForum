from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import hashlib
import time
import random
app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'forum'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/forum'
CORS(app)
mongo = PyMongo(app)

userCollection = mongo.db.users
commentCollection = mongo.db.comments
threadCollection = mongo.db.threads
"""
User:
    id:string;
    username: string;
    online: boolean;

Thread:
    id: string;
    title: string;
    comments: Comment[];
    creator: User;
    views: number;
    date: number;

Comment:
    id: string;
    creator: User;
    date: number;
    content: string;
"""


def get_auth_token(user, passhash):
    return str(hashlib.sha1((user + passhash + str(time.time() * (random.random() + 1681))).encode()).hexdigest())


@app.route('/')
def index():
    print("Got a req")
    test = str(userCollection.find_one())
    print(test)
    return "Ttest"


@app.route('/api/login', methods=['POST'])
def get_user():
    try:
        username = str(request.get_json()['username']).lower()
        password = request.get_json()['password']
        passhash = str(hashlib.sha1(password.encode()).hexdigest())
        db_user = userCollection.find_one({'username': username})
        logged_in = db_user != None and db_user['password'] == passhash
        if(logged_in):
            auth_token = get_auth_token(username, passhash)
            updatedUser = {
                'date_logged_in': int(time.time()),
                'authToken': auth_token,
                'online': True
            }
            userCollection.update_one(
                {'_id': db_user['_id']}, {'$set': updatedUser})
            db_user.update({'authToken': auth_token})
            return jsonify({
                'status':'ok',
                'id': str(db_user['_id']),
                'username': username,
                'online': True,
                'authToken': auth_token
            })
        return jsonify({
            'status':'error',
            'error': 'username or password are incorrect'
        })
    except Exception as e:
        print(e)
    return jsonify({
        'status':'error',
        'error': 'unknown'
    })


@app.route('/api/signup', methods=['POST'])
def add_user():
    try:
        username = request.get_json()['username']
        email = request.get_json()['email']
        db_user = userCollection.find_one({'username': username})
        if db_user != None:
            return jsonify({
                'status': 'error',
                'error': 'user already taken'
            })
        password = request.get_json()['password']
        if(len(password) < 8):
            return jsonify({'error': 'password too short'})
        passhash = hashlib.sha1(password.encode()).hexdigest()
        token = get_auth_token(username, passhash)
        user = {
            'username': username,
            'password': passhash,
            'email': email,
            'date_joined': int(time.time()),
            'authToken':token
        }
        userCollection.insert_one(user)
        return jsonify({'status': 'ok', 'authToken': token})

    except Exception as e:
        print(e)
    return jsonify({
        'status': 'error',
        'error': 'unknown'
    })

@app.route('/api/get_user', methods=['POST'])
def get_user_by_token():
    token = request.get_json()['authToken']
    if(token == None):
        return jsonify({'status':'not_found'})

    user = userCollection.find_one({'authToken':token})
    if user == None:
        return jsonify({'status':'not_found'})
    userCollection.update_one({'authToken':user['authToken']}, {'$set':{'logged_in': time.time()}})
    return jsonify({
        'status':'found',
        'username':user['username'],
        'online':True,
        'id':str(user['_id'])
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    token = request.get_json()['authToken']
    username = request.get_json()['username']
    user = userCollection.find_one({'authToken':token})
    if user['username'] == username:
        userCollection.update_one({'authToken':token},{'$unset':{'authToken':1}})
        return jsonify({'status':'ok'})
    else:
        return jsonify({'status':'error','error':'invalid token or username'})
app.run(debug=True, port=1234)
