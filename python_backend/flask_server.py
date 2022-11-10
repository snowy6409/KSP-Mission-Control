"""
    Singleton Flask localhost server for transmitting data to the GUI
"""
import logging
import threading
import time
import Queue
import json
import krpc
from flask import Flask, render_template, Response, request
from message_announcer import MessageAnnouncer
from json import dumps
from datetime import datetime

conn = krpc.connect()
print(conn.krpc.get_status().version)
vessel = conn.space_center.active_vessel
ut = conn.add_stream(getattr, conn.space_center, 'ut')
altitude = conn.add_stream(getattr, vessel.flight(), 'mean_altitude')
apoapsis = conn.add_stream(getattr, vessel.orbit, 'apoapsis_altitude')
stage_0_resources = vessel.resources
srb_fuel_0 = conn.add_stream(stage_0_resources.amount, 'SolidFuel')
lq_fuel_0 = conn.add_stream(stage_0_resources.amount, 'LiquidFuel')
ox_0 = conn.add_stream(stage_0_resources.amount, 'Oxidiser')
ec_0 = conn.add_stream(stage_0_resources.amount, 'ElectricCharge')


class FlaskServer(object):
    _instance = None

    host = "0.0.0.0"
    port = 5000
    debug = True
    value = ""
    shutdown = False
    app = Flask(__name__)
    announcer = MessageAnnouncer()

    # x = threading.Thread(target=send_to_stream, args=())
    # x.start()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(FlaskServer, cls).__new__(
                cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        print("Server Created")

    def add_all_endpoints(self):
        # Create event stream
        self.app.add_url_rule("/listen", "/listen", self.listen)
        self.add_endpoint(endpoint="/begin",
                          endpoint_name="/begin",
                          methods=['GET'],
                          handler=self.begin)
        # Add data url endpoints
        self.add_endpoint(endpoint="/",
                          endpoint_name="/",
                          methods=['GET'],
                          handler=self.index)
        self.add_endpoint(endpoint="/test",
                          endpoint_name="/test",
                          methods=['GET'],
                          handler=self.test)
        self.add_endpoint(endpoint="/stage",
                          endpoint_name="/stage",
                          methods=['GET'],
                          handler=self.stage)
        self.add_endpoint(endpoint="/actions/<action>",
                          endpoint_name="/actions/<action>",
                          methods=['GET'],
                          handler=self.handle_action)
        self.add_endpoint(endpoint="/widgets/update_widgets/<widget_filename>",
                          endpoint_name="/widgets/update_widgets/<widget_filename>",
                          methods=['POST'],
                          handler=self.update_widgets)
        self.add_endpoint(endpoint="/widgets/<widget_filename>",
                          endpoint_name="/widgets/<widget_filename>",
                          methods=['GET'],
                          handler=self.widget_file)
        self.add_endpoint(endpoint="/stop",
                          endpoint_name="/stop",
                          methods=['GET'],
                          handler=self.stop)

    def event_stream(self, timeout=0.0, test_message=None):
        """
            Event stream that is returned when accessing the /listen endpoint
        :param timeout: stream timeout, used for testing: float
        :param test_message: Test message to be published: str
        """
        messages = self.announcer.listen()
        self.send_message(test_message) if test_message else None  # Publish a test message

        starting_time = time.time()
        while not timeout or (time.time() - starting_time < timeout):
            try:
                yield messages.get(timeout=timeout)
            except Queue.Empty:
                pass

    def begin(self):
        print self.shutdown
        while not self.shutdown:
            time.sleep(1)
            self.announcer.announce(altitude(), "altitude")
            self.announcer.announce(srb_fuel_0(), "srb_fuel_1")
            self.announcer.announce(lq_fuel_0(), "lq_fuel_1")
            self.announcer.announce(ox_0(), "ox_0")
            self.announcer.announce(ec_0(), "ec_0")
            self.announcer.announce(apoapsis(), "apoapsis")

    def stop(self):
        self.shutdown = True

    def listen(self):
        """
            Prepare a server side event stream
        :return: the server side event stream: Response
        """
        return Response(self.event_stream(), mimetype="text/event-stream")

    def add_endpoint(self, endpoint=None, endpoint_name=None, methods=None,
                     handler=None):
        """
            Add an endpoint to the webserver
        :param endpoint: URL rule: str
        :param endpoint_name: name to associate with the url rule: str
        :param methods: endpoint methods: list
        :param handler: function to attach the endpoint to: callable
        :return: None
        """
        self.app.add_url_rule(endpoint, endpoint_name, EndpointAction(handler), methods=methods)

    def stage(self):
        vessel.control.activate_next_stage()

    def handle_action(self, action):
        if str(action) == "solar_panels":
            print("Deploying Solar Panels")
            for solar_panel in vessel.parts.solar_panels:
                solar_panel.deployed = not solar_panel.deployed
        if str(action) == "deploy_parachutes":
            for parachute in vessel.parts.parachutes:
                parachute.deploy()

    def widget_file(self, widget_filename):
        """
            Get widget definitions from definition file
        :param widget_filename: file name to path to: str
        :return: Widget definition JSON: str
        """
        return widget_filename
        return dumps(self.__file_system.load_widgets(widget_filename))

    def update_widgets(self, widget_filename):
        """
            Endpoint to update the widget definition file
        :param widget_filename: file name to path to: str
        :return: None
        """
        data = request.form
        self.__file_system.write_widgets(widget_filename, data)

    @staticmethod
    def index():
        return render_template('index.html')

    @staticmethod
    def test():
        return render_template('indextest.html')

    def run(self, threaded):
        """
            Start flask server
        :return: None
        """
        log = logging.getLogger('werkzeug')
        log.setLevel(logging.CRITICAL)
        self.app.run(threaded=threaded, host=self.host, port=self.port, debug=self.debug, use_reloader=False)


class EndpointAction(object):

    def __init__(self, action):
        self.action = action

    def __call__(self, *args, **kwargs):
        if not isinstance(self.action, Response):
            answer = self.action(*args, **kwargs)
            self.response = Response(answer, status=200)
            self.response.headers.add('Access-Control-Allow-Origin', '*')
            return self.response
        return self.action
