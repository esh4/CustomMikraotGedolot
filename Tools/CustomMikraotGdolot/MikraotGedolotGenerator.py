import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
import subprocess
from DataStructures import BookContent


class MikraotGedolotGenerator:
    def __init__(self, book, is_demo=False, chapter_range=(1, 1000)):
        self.book_content: BookContent = book
        self.template_content = []
        self.chapter_range = chapter_range

        self.max_verses, self.max_chapters = (5, 1) if is_demo else (1000, 1000)

    @staticmethod
    def calculate_pages_per_text(text, font_size, aspect_ratio=0.75, page_size=(794 - 166, 1123 - 166)):
        # A4 = (794px, 1123px)
        # 20mm top margin + 24mm bottom margin = 44mm = 166px (96 DPI)
        # 22mm margin on each side = 44mm
        # first page has a title that adds 22mm = 83px

        # filter out hebrew punctuation
        chars = ''.join(c for c in text if
                        u'\u05d0' <= c <= u'\u05ea' or u'\u0041' <= c <= u'\u005a' or u'\u0061' <= c <= u'\u007a')
        size_in_pixels = len(chars) * font_size * font_size * aspect_ratio

        return (size_in_pixels + (83 * page_size[0])) / (page_size[0] * page_size[1])

    def format_commentators(self, chapter, verse):
        commentators_for_template = []
        for commentator in self.book_content.commentary[chapter][verse]:
            commentators_for_template.append({
                'name': commentator.heName,
                'text': commentator.content
            })
        return commentators_for_template

    def generate(self):
        print('generating...')
        for ch_index, chapter in enumerate(self.book_content.book.content):
            ch_num = ch_index + self.chapter_range[0]
            if ch_num == self.chapter_range[1]:
                break
            cache = {'verse':[], 'content':[], 'translation':[], 'commentators':[]}
            v_num = 0
            while v_num < len(chapter):
                # print(ch_num, v_num)
                commentry = self.format_commentators(ch_index, v_num)

                # calculate how many pages the text will take:
                total_com_text = ''.join([j for c in commentry for j in c['text']])
                total_com_names = ''.join([j for c in commentry for j in c['name']])
                total_com = total_com_text + total_com_names

                text_p = self.calculate_pages_per_text(chapter[v_num], 21) + \
                         self.calculate_pages_per_text(self.book_content.translation.content[ch_index][v_num], 14) + \
                         self.calculate_pages_per_text(total_com, 12)

                # print('verse {} takes {} pages'. format(v_num + 1, text_p))

                if text_p // 1 < 2 and text_p % 1 < 0.6 and len(cache['content']) <= 3:
                    # print('caching verse {}'.format(v_num + 1))
                    cache['verse'].append(v_num + 1)
                    cache['content'].append(chapter[v_num])
                    cache['translation'].append(self.book_content.translation.content[ch_index][v_num])
                    cache['commentators'].append(commentry)
                else:
                    # print('adding cache to verse {}'.format(v_num + 1))
                    # print(cache)

                    # combine coms:
                    for c in commentry:
                        for j in cache['commentators']:
                            for i in j:
                                if i['name'] == c['name']:
                                    c['text'].append(''.join(i['text']))

                    self.template_content.append({
                        'verse': '{}'.format(cache['verse'][0] if len(cache['verse']) > 0 else v_num + 1),
                        'book': u'{}'.format(self.book_content.book.heName),
                        'chapter': u'{}'.format(ch_num),
                        'content': ' '.join(cache['content']) + ' ' + chapter[v_num],
                        'translation': ' '.join(cache['translation']) + ' ' + self.book_content.translation.content[ch_index][v_num],
                        'commentators': commentry,
                        'debug': ''#'text_p: {}'.format(text_p)
                    })
                    # clear cache
                    cache = {'verse': [], 'content': [], 'translation': [], 'commentators': []}

                v_num += 1

            # add leftover cache if any
            if len(cache['verse']) > 0:
                commentary = cache['commentators'][0]
                for c in commentary:
                    for j in range(1, len(cache['commentators'])):
                        for i in cache['commentators'][j]:
                            if i['name'] == c['name']:
                                c['text'].append(''.join(i['text']))

                self.template_content.append({
                    'verse': '{}'.format(cache['verse'][0] if len(cache['verse']) > 0 else v_num + 1),
                    'book': u'{}'.format(self.book_content.book.heName),
                    'chapter': u'{}'.format(ch_num),
                    'content': ' '.join(cache['content']),
                    'translation': ' '.join(cache['translation']),
                    'commentators': commentary,
                    'debug': ''
                })
        print('finished generating content')
        return {
            'book': self.template_content,
            'book_info': {
                'title': self.book_content.book.heName,
                'comms': self.book_content.commentator_names,
                'trans': self.book_content.translation.version
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
        print('document rendered!')


if __name__ == '__main__':
    book_content = BookContent('I Kings', 'Targum Jonathan on I Kings 1:3',
                               ['Rashi on I Kings ', 'Abarbanel on I Kings ', 'Malbim on I Kings'],
                               text_range=(1, 6))
    book_content.populate()

    mg = MikraotGedolotGenerator(book_content, chapter_range=(1, 6))
    tm = TemplateManager('testGen')
    tm.config_env()

    data = mg.generate()
    tm.render_template(data)

