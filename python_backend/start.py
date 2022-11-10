import webbrowser

from flask_server import FlaskServer

if __name__ == '__main__':
    flaskserver = FlaskServer()
    flaskserver.add_all_endpoints()
    webbrowser.open("http://localhost:5000")
    flaskserver.run(threaded=True)
