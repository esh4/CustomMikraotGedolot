from SefariaAPI import SefariaAPI
import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
import subprocess


class MikraotGedolotGenerator:
    def __init__(self, book, commentators, trans):
        self.book = book
        self.commentators = commentators

        self.book_content = []

        self.api = SefariaAPI()

        self.book_info = self.api.get_book_info(book)

        # for demo:
        self.max_verses = 5
        self.max_chapters = 1


    def calculateTextsizeOnPage(self, text, font_size, aspect_ratio=0.75, page_size=(794 - 166, 1123 - 166)):
        # A4 = (794px, 1123px)
        # 20mm top margin + 24mm bottom margin = 44mm = 166px (96 DPI)
        # 22mm margin on each side = 44mm
        # first page has a title that adds 22mm = 83px

        # filter out hebrew punctuation
        chars = ''.join(c for c in text if
                        u'\u05d0' <= c <= u'\u05ea' or u'\u0041' <= c <= u'\u005a' or u'\u0061' <= c <= u'\u007a')
        size_in_pixels = len(chars) * font_size * font_size * aspect_ratio

        return (size_in_pixels + (83 * page_size[0])) / (page_size[0] * page_size[1])

    def get_commentators(self, chapter, verse):
        commentators_for_template = []
        for commentator in self.commentators:
            commentary = self.api.get_book_text('{}.{}.{}'.format(commentator, chapter, verse))
            commentators_for_template.append({
                'name': commentary[2]['heIndexTitle'],
                'text': commentary[0]
            })
        return commentators_for_template

    def generate(self):
        for ch_num, chapter in enumerate(self.api.chapters_in_book(self.book)):
            cache = {'verse':[], 'content':[], 'translation':[], 'commentators':[]}
            v_num = 0

            while v_num < len(chapter[0]) and v_num <= self.max_verses - 1:
                commentry = self.get_commentators(ch_num + 1, v_num + 1)

                # calculate how many pages the text will take:
                total_com_text = ''.join([j for c in commentry for j in c['text']])
                total_com_names = ''.join([j for c in commentry for j in c['name']])
                total_com = total_com_text + total_com_names

                text_p = self.calculateTextsizeOnPage(chapter[0][v_num], 21) + \
                         self.calculateTextsizeOnPage(chapter[1][v_num], 14) + \
                         self.calculateTextsizeOnPage(total_com, 12)

                print('verse {} takes {} pages'. format(v_num + 1, text_p))

                if text_p // 1 < 2 and text_p % 1 < 0.6:
                    print('caching verse {}'.format(v_num + 1))
                    cache['verse'].append(v_num + 1)
                    cache['content'].append(chapter[0][v_num])
                    cache['translation'].append(chapter[1][v_num])
                    cache['commentators'].append(commentry)
                else:
                    print('adding cache to verse {}'.format(v_num + 1))
                    print(cache)

                    # combine coms:
                    for c in commentry:
                        for j in cache['commentators']:
                            for i in j:
                                if i['name'] == c['name']:
                                    c['text'].append(''.join(i['text']))

                    self.book_content.append({
                        'verse': '{}'.format(cache['verse'][0] if len(cache['verse']) > 0 else v_num + 1),
                        'book': u'{}'.format(self.book_info['heTitle']),
                        'chapter': u'{}'.format(ch_num + 1),
                        'content': ' '.join(cache['content']) + ' ' + chapter[0][v_num],
                        'translation': ' '.join(cache['translation']) + ' ' + chapter[1][v_num],
                        'commentators': commentry,
                        'debug': ''#'text_p: {}'.format(text_p)
                    })
                    # clear cache
                    cache = {'verse': [], 'content': [], 'translation': [], 'commentators': []}

                v_num += 1

            # add leftover cache if any
            commentary = cache['commentators'][0]
            # commentary.append(cache['commentators'][0])
            for c in commentary:
                for j in range(1, len(cache['commentators'])):
                    for i in cache['commentators'][j]:
                        if i['name'] == c['name']:
                            c['text'].append(''.join(i['text']))

            self.book_content.append({
                'verse': '{}'.format(cache['verse'][0] if len(cache['verse']) > 0 else v_num + 1),
                'book': u'{}'.format(self.book_info['heTitle']),
                'chapter': u'{}'.format(ch_num + 1),
                'content': ' '.join(cache['content']) + ' ' + chapter[0][v_num],
                'translation': ' '.join(cache['translation']) + ' ' + chapter[1][v_num],
                'commentators': commentary,
                'debug': ''
            })
            if ch_num >= self.max_chapters - 1:
                break
        return {
            'book': self.book_content,
            'book_info': {
                'title': self.book_info['heTitle'],
                'comms': self.commentators
            }
        }


class TemplateManager:
    def __init__(self, output_file_dir):
        self.output_file = output_file_dir
        self.book_template = None

    def config_env(self):
        env = Environment(
            loader=FileSystemLoader('templates'),
            autoescape=select_autoescape(['html', 'xml'])
        )

        self.book_template = env.get_template('daf layout.html')

        if not 'generated' in os.listdir():
            os.mkdir('generated')

        if not self.output_file in os.listdir('generated'):
            os.mkdir('generated/{}'.format(self.output_file))
            os.mkdir('generated/{}'.format(self.output_file + '/pdf'))
            os.mkdir('generated/{}'.format(self.output_file + '/html'))

    def render_template(self, data):
        book_html = self.book_template.render(data)

        with open('generated/{}/html/rendered_html.html'.format(self.output_file), 'wb') as f:
            f.write(book_html.encode('utf-8'))

        subprocess.Popen(['prince', 'generated/{}/html/rendered_html.html'.format(self.output_file),
                          '-s', 'templates/styles.css', '-o', 'generated/{}/pdf/out.pdf'.format(self.output_file)])

if __name__ == '__main__':
    mg = MikraotGedolotGenerator('Ezra', ['Rashi on Ezra', 'Saadia Gaon on Ezra'])
    tm = TemplateManager('testEzra')
    tm.config_env()

    data = mg.generate()
    tm.render_template(data)

