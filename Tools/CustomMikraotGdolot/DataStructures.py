from SefariaAPIasync import SefariaAPIText
import asyncio, aiohttp
import re


class BookContent:
    book = None
    translation = None
    commentary = []

    def __init__(self, book_name, translation_version, commentators, text_range=(1, 1000)):
        self.session = aiohttp.ClientSession()
        self.range = text_range

        self.book = SefariaAPIText(book_name, session=self.session, text_range=text_range)

        translation_version = re.sub('[1-9]+:[1-9]+|[1-9]+', '', translation_version)   # remove chapter:verse from ref
        self.translation = SefariaAPIText(translation_version, session=self.session, text_range=text_range)
        self.commentator_names = commentators

    def populate_commentators(self):
        print(len(self.book.content))
        for chapter in range(len(self.book.content)):
            comms_for_chapter = []
            for verse in range(len(self.book.content[chapter])):
                comms_for_verse = []
                for comm in self.commentator_names:
                    comms_for_verse.append(SefariaAPIText('{}.{}.{}'.format(comm, chapter + self.range[0], verse + 1), session=self.session))
                comms_for_chapter.append(comms_for_verse)
            self.commentary.append(comms_for_chapter)

    def populate(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.book.async_get_text())

        loop.create_task(self.translation.async_get_text())

        self.populate_commentators()
        for chapter in range(len(self.commentary)):
            for c in range(len(self.commentary[chapter])):
                for i in range(len(self.commentary[chapter][c])):
                    loop.create_task(self.commentary[chapter][c][i].async_get_text())

        tasks = asyncio.all_tasks(loop=loop)
        group = asyncio.gather(*tasks)
        loop.run_until_complete(group)
        loop.run_until_complete(self.session.close())


if __name__ == '__main__':
    book = BookContent('Genesis', 'en/Bible du Rabbinat 1899 [fr]', commentators=['Rashi on Genesis', 'Malbim on Genesis'])
    book.populate()
