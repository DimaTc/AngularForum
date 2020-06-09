# Angular basic Forum
Basic minimalistic forum to play with angular + flask.
You can check out the forum in [in this link](https://dt-ng-forum.herokuapp.com/)
![screenshot](https://i.imgur.com/PolijLF.png)

### Installation (python 3+)

```sh
$ git clone https://github.com/DimaTc/AngularForum
$ cd AngularForum
$ pip install -r requirements.txt
$ cd forumAngular
$ npm install
```
Note:
Don't forget to run a MongoDB server

### Run
```sh
python ./app.py -d <MongoDB_URL> -n <DB_Name> [-p <port>]
```
