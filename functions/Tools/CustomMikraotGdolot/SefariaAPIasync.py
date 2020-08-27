import asyncio
import aiohttp
import requests


class Text:
    Name = ''
    Author = None
    content = []
    commentary = None
    language = 'he'
    version = None
    heName = ''

    def __init__(self, name: str, author=None, content=[], comm=None):
        name = name.split('/')
        self.Name = name[0]
        try:
            self.language = name[1]
            self.version = name[2]
        except IndexError as e:
            pass
        self.Author = author
        self.content = content
        self.commentary = comm


class SefariaAPIText(Text):
    base_url = 'http://www.sefaria.org/api'

    def __init__(self, name, comm=None, session=None):
        Text.__init__(self, name, comm=comm)
        self.session = session #aiohttp.ClientSession()

    async def async_get_text(self):
        params = ''
        if self.version is not None:
            params = '/{lang}/{ver}'.format(lang=self.language, ver=self.version)
        req = '{}/texts/{}{}?pad=0'.format(self.base_url, self.Name, params)
        async with self.session.get(req) as res:
            book = await res.json()
            # print('response for {}'.format(req))

        self.heName = book['heIndexTitle']

        text_key = 'he' if self.language == 'he' else 'text'
        try:
            self.content = book[text_key]
        except KeyError as e:
            print(book)

    def get_text(self):
        params = ''
        if self.version is not None:
            params = '/{lang}/{ver}'.format(lang=self.language, ver=self.version)
        req = '{}/texts/{}{}?pad=0'.format(self.base_url, self.Name, params)
        print(req)
        res = requests.get(req)
        book = res.json()

        text_key = 'he' if self.language == 'he' else 'text'
        self.content = book[text_key]


