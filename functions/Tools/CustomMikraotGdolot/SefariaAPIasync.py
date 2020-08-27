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

    def __init__(self, name: str, author=None, content=[], text_range=None):
        name = name.split('/')
        self.Name = name[0]
        try:
            self.language = name[1]
            self.version = name[2]
        except IndexError as e:
            pass
        self.Author = author
        self.content = content
        self.range = text_range


class SefariaAPIText(Text):
    base_url = 'http://www.sefaria.org/api'

    def __init__(self, name, session=None, text_range=None):
        Text.__init__(self, name, text_range=text_range)
        self.session = session #aiohttp.ClientSession()

    async def async_get_text(self):
        params = ''
        text_key = 'he' if self.language == 'he' else 'text'
        if self.version is not None:
            params = '/{lang}/{ver}'.format(lang=self.language, ver=self.version)

        book_content = []
        if self.range is not None:
            for i in range(self.range[0], self.range[1]):
                req = '{}/texts/{}.{}{}?pad=0'.format(self.base_url, self.Name, str(i), params)
                async with self.session.get(req) as res:
                    book = await res.json()
                    book_content.append(book[text_key])
                    # print('response for: {}'.format(req))
        else:
            req = '{}/texts/{}{}?pad=0'.format(self.base_url, self.Name, params)
            async with self.session.get(req) as res:
                book = await res.json()
                book_content = book[text_key]
                # print('response for: {}'.format(req))

        self.heName = book['heIndexTitle']

        try:
            self.content = book_content
        except KeyError as e:
            print(book)

    # def get_text(self):
    #     params = ''
    #     if self.version is not None:
    #         params = '/{lang}/{ver}'.format(lang=self.language, ver=self.version)
    #
    #     if self.range is not None:
    #         req = '{}/texts/{}.{}{}'.format(self.base_url, self.Name, str(i), params)
    #         requests.get
    #
    #     else:
    #         req = '{}/texts/{}{}?pad=0'.format(self.base_url, self.Name, params)
    #         print(req)
    #         res = requests.get(req)
    #         book = res.json()
    #
    #     text_key = 'he' if self.language == 'he' else 'text'
    #     self.content = book[text_key]


