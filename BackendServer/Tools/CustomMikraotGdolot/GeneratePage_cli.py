from SefariaAPI import SefariaAPI
from jinja2 import Environment, FileSystemLoader, select_autoescape
import subprocess
import os
import argparse

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('-b', type=str)
arg_parser.add_argument('-c', type=str, nargs='+')

args = arg_parser.parse_args()

dir_path = os.path.dirname(os.path.realpath(__file__))
os.chdir(dir_path)

print(vars(args))

'''
1. Choose book and commentators
2. Divide verses and commentators so that they fit in the pages. How many pages will it take?
3. Generate PDFs
'''

book = args.b
commentators = args.c

api = SefariaAPI()

env = Environment(
    loader=FileSystemLoader('templates'),
    autoescape=select_autoescape(['html', 'xml'])
)
print(os.getcwd())
book_template = env.get_template('daf layout.html')
page_template = env.get_template('page_content.html')

book_content = []

if not 'generated' in os.listdir():
    os.mkdir('generated')

if not book in os.listdir('generated'):
    os.mkdir('generated/{}'.format(book))
    os.mkdir('generated/{}'.format(book + '/pdf'))
    os.mkdir('generated/{}'.format(book + '/html'))

for ch_num, chapter in enumerate(api.chapters_in_book(book)):
    for v_num, verse in enumerate(chapter):
        commentators_for_template = []
        for commentator in commentators:
            commentary = api.get_book_text('{}.{}.{}'.format(commentator, ch_num + 1, v_num + 1))[0]
            commentators_for_template.append({
                'name': commentator,
                'text': commentary
            })

        book_content.append({
            'verse': '{}'.format(v_num + 1),
            'book': u'{}'.format(book),
            'chapter': u'{}'.format(ch_num + 1),
            'content': chapter[0][v_num],
            'translation': chapter[1][v_num],
            'commentators': commentators_for_template
        })

        if v_num == 3:
            break

    if ch_num == 0:
        break

book_html = book_template.render({
    'book': book_content
})

with open('generated/{}/html/rendered_html_{}.html'.format(book, book), 'wb') as f:
    f.write(book_html.encode('utf-8'))

subprocess.Popen(['prince', 'generated/{}/html/rendered_html_{}.html'.format(book, book),
                  '-s', 'templates/styles.css', '-o', 'generated/{}/pdf/out.pdf'.format(book)])
