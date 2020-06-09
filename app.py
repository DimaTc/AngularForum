import sys
from flask_cors import CORS
from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo, DESCENDING, ObjectId
import hashlib
import time
import random
import argparse

app = Flask(__name__)
userCollection = None
commentCollection = None
threadCollection = None
debug_flag = False


def start_server(port=80, dbg=False, mongo_uri="", db_name=""):
    if dbg:
        print("Starting server... ")
        print("DB_URL:{} | DB_NAME:{} | PORT:{} ".format(mongo_uri, db_name, port))
    debug_flag = dbg
    app.config["MONGO_DBNAME"] = db_name
    # Enter your DB server address
    app.config["MONGO_URI"] = mongo_uri

    mongo = PyMongo(app)
    global userCollection, commentCollection, threadCollection
    userCollection = mongo.db.users
    commentCollection = mongo.db.comments
    threadCollection = mongo.db.threads

    if dbg:
        CORS(app)
    app.run(debug=dbg, port=port, host="0.0.0.0")


def get_auth_token(user, passhash):
    return str(hashlib.sha1((user + passhash + str(time.time() * (random.random() + 1681))).encode()).hexdigest())



@app.route("/api/login", methods=["POST"])
def get_user():
    try:
        username = str(request.get_json()["username"]).lower()
        password = request.get_json()["password"]
        passhash = str(hashlib.sha1(password.encode()).hexdigest())
        db_user = userCollection.find_one({"username": username})
        logged_in = db_user != None and db_user["password"] == passhash
        if(logged_in):
            auth_token = get_auth_token(username, passhash)
            updatedUser = {
                "date_logged_in": int(time.time()),
                "authToken": auth_token,
                "online": True
            }
            userCollection.update_one(
                {"_id": db_user["_id"]}, {"$set": updatedUser})
            db_user.update({"authToken": auth_token})
            return jsonify({
                "status": "ok",
                "id": str(db_user["_id"]),
                "username": username,
                "online": True,
                "authToken": auth_token
            })
        return jsonify({
            "status": "error",
            "error": "username or password are incorrect"
        })
    except Exception as e:
        print(e)
    return jsonify({
        "status": "error",
        "error": "unknown"
    })


@app.route("/api/signup", methods=["POST"])
def add_user():
    try:
        username = str(request.get_json()["username"]).lower()
        email = request.get_json()["email"]
        db_user = userCollection.find_one({"username": username})
        if db_user != None:
            return jsonify({
                "status": "error",
                "error": "user already taken"
            })
        password = request.get_json()["password"]
        if(len(password) < 8):
            return jsonify({"error": "password too short"})
        passhash = hashlib.sha1(password.encode()).hexdigest()
        token = get_auth_token(username, passhash)
        user = {
            "username": username,
            "password": passhash,
            "email": email,
            "date_joined": int(time.time()),
            "authToken": token
        }
        userCollection.insert_one(user)
        return jsonify({"status": "ok", "authToken": token})

    except Exception as e:
        print(e)
    return jsonify({
        "status": "error",
        "error": "unknown"
    })


@app.route("/api/get_user", methods=["POST"])
def get_user_by_token():
    token = request.get_json()["authToken"]
    if(token == None):
        return jsonify({"status": "not_found"})

    user = userCollection.find_one({"authToken": token})
    if user == None:
        return jsonify({"status": "not_found"})
    userCollection.update_one({"authToken": user["authToken"]}, {
                              "$set": {"logged_in": int(time.time())}})
    return jsonify({
        "status": "found",
        "username": user["username"],
        "online": True,
        "id": str(user["_id"])
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    token = request.get_json()["authToken"]
    username = request.get_json()["username"]
    user = userCollection.find_one({"authToken": token})
    if user["username"] == username:
        userCollection.update_one({"authToken": token}, {
                                  "$unset": {"authToken": 1}})
        return jsonify({"status": "ok"})
    else:
        return jsonify({"status": "error", "error": "invalid token or username"})


@app.route("/api/threads", methods=["POST"])
def get_threads():
    try:
        username = request.get_json()["username"]
        token = request.get_json()["authToken"]
        db_user = userCollection.find_one({"authToken": token})
        if db_user["username"] != username:
            return jsonify({"status": "error", "error": "authintication error"})
        try:
            thread_id = ObjectId(request.get_json()["thread_id"])
            db_threads = threadCollection.find({"_id": thread_id})
            # add view if a specific thread was selected
            threadCollection.update_one(
                {"_id": thread_id}, {"$inc": {"views": 1}})
        except:
            db_threads = threadCollection.find()
        threads = []
        for thread in db_threads:
            try:
                db_creator = userCollection.find_one(
                    {"_id": thread["creator"]})

                db_last_comment = commentCollection.find_one(
                    {"_id": {"$in": thread["comments"]}}, sort=[("_id", DESCENDING)])

                db_comment_creator = userCollection.find_one(
                    {"_id": db_last_comment["creator"]})

                last_comment = {
                    "creator": db_comment_creator["username"],
                    "date": db_last_comment["date"]
                }
                threads.append({
                    "id": str(thread["_id"]),
                    "title": thread["title"],
                    "creator": db_creator["username"],
                    "date": thread["date"],
                    "views": thread["views"],
                    "comments": len(thread["comments"]),
                    "last_comment": last_comment
                })
            except Exception as e:
                e_type, e_obj, e_tb = sys.exc_info()
                print("Error with a thread:" + str(e))
                print(e_type, e_obj, e_tb.tb_lineno)

        return jsonify({"status": "ok", "threads": threads})
    except Exception as e:
        print("exception (in get threads): ")
        print(e)
        return jsonify({"status": "error", "error": "unknown error"})


@app.route("/api/threads/add", methods=["POST"])
def add_thread():
    try:
        username = request.get_json()["username"]
        token = request.get_json()["authToken"]
        db_user = userCollection.find_one({"authToken": token})
        if(db_user["username"] != username):
            return jsonify({"status": "error", "error": "authintication error"})
    except Exception as e:
        return jsonify({"status": "error", "error": "exception in authintication"})
    try:
        title = request.get_json()["title"]
        comment_text = request.get_json()["comment"]
        thread = threadCollection.insert_one({
            "creator": db_user["_id"],
            "title": title,
            "date": int(time.time()),
            "views": 1
        })
        comment = commentCollection.insert_one({
            "creator": db_user["_id"],
            "content": comment_text,
            "date": int(time.time()),
            "thread": thread.inserted_id
        })
        threadCollection.update_one(
            {"_id": thread.inserted_id},
            {"$set":
             {"comments": [comment.inserted_id]}
             })
        return jsonify({"status": "ok"})

    except Exception as e:
        print("Exception")
        print(e)
        return jsonify({"status": "error", "error": "unknown error"})


@app.route("/api/comments/add", methods=["POST"])
def add_comment():
    try:
        username = request.get_json()["username"]
        token = request.get_json()["authToken"]
        db_user = userCollection.find_one({"authToken": token})
        if db_user["username"] != username:
            return jsonify({"status": "error", "error": "authintication error"})
        thread_id = ObjectId(request.get_json()["thread_id"])
        comment_content = request.get_json()["content"]
        comment_inserted = commentCollection.insert_one({
            "creator": db_user["_id"],
            "date": int(time.time()),
            "content": comment_content,
            "thread": thread_id
        })
        if debug_flag:
            print(comment_inserted.inserted_id)
        thread_db = threadCollection.update_one(
            {"_id": thread_id},
            {"$push":  {
                "comments": comment_inserted.inserted_id
            }}
        )

        return jsonify({"status": "ok", "comment": {
            "content": comment_content,
            "creator": db_user["username"],
            "date": int(time.time()),
            "id": str(comment_inserted.inserted_id)
        }})
    except Exception as e:
        print("Exception in adding comment:" + str(e))
        return jsonify({"status": "error", "error": "unknown error"})


@app.route("/api/comments", methods=["POST"])
def get_comments():
    try:
        username = request.get_json()["username"]
        token = request.get_json()["authToken"]
        db_user = userCollection.find_one({"authToken": token})
        if db_user["username"] != username:
            return jsonify({"status": "error", "error": "authintication error"})
        thread_id = request.get_json()["thread_id"]
        db_comments = commentCollection.find({"thread": ObjectId(thread_id)})
        comments = []
        for comment in db_comments:
            creator = userCollection.find_one({"_id": comment["creator"]})
            creator_name = creator["username"]
            comments.append({
                "content": comment["content"],
                "id": str(comment["_id"]),
                "creator": creator_name,
                "date": comment["date"]
            })
        return jsonify({"status": "ok", "comments": comments})
    except Exception as e:
        print("exception in get comments:")
        print(e)
        return jsonify({"status": "error", "error": "unknown error"})


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="----======Forum Server======----")
        
    parser.add_argument("-d", action="store", required=True,
                        dest="db_url", help="MongoDB url")
    
    parser.add_argument("-n", action="store", required=True,
                        dest="db_name", help="DB name")
                        
    parser.add_argument("-p", action="store", type=int, 
                        dest="port", default="80", help="Port of the server")
    
    
    parser.add_argument("--debug", action="store_true", 
                        default=False, dest="dbg", help="DEBUG flag")

    args = parser.parse_args()
    start_server(port=args.port, dbg=args.dbg,mongo_uri=args.db_url, db_name=args.db_name)