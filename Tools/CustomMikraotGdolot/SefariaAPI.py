import requests


class SefariaAPI:
    def __init__(self, base_url='http://www.sefaria.org/api'):
        self.base_url = base_url

    def chapters_in_book(self, book, lang='he', version=None):
        book = self.get_book_text(book, lang=lang, version=version)
        for chapter in range(len(book[0])):
            yield book[0][chapter]

    def get_book_text(self, book, lang='he', version=None):
        params = ''
        if self.version is not None:
            params = '/{lang}/{ver}'.format(lang=lang, ver=version)
        req = '{}/texts/{}{}?pad=0'.format(self.base_url, book, params)
        print(req)
        res = requests.get(req)
        print(res)
        book = res.json()
        text_key = 'he' if lang == 'he' else 'text'
        return book[text_key], book

    def get_book_info(self, book):
        res = requests.get('{}/index/{}'.format(self.base_url, book))
        res = res.json()
        return res