import Queue


class MessageAnnouncer:

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MessageAnnouncer, cls).__new__(
                cls, *args, **kwargs)
        return cls._instance
    _instance = None

    listeners = []

    def listen(self):
        self.listeners.append(Queue.Queue(maxsize=5))
        return self.listeners[-1]

    def announce(self, msg, event=None):
        # We go in reverse order because we might have to delete an element, which will shift the
        # indices backward
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(self.format_sse(msg, event))
            except Queue.Full:
                del self.listeners[i]

    @staticmethod
    def format_sse(data, event=None):
        data = str(data)
        msg = 'data: '+data+'\n\n'
        if event is not None:
            msg = 'event: '+event+'\n'+msg
        return msg
