import os
import argparse
from MikraotGedolotGenerator import MikraotGedolotGenerator, TemplateManager
from DataStructures import BookContent


def StrRange(s: str):
    i = s.strip(')(').split(', ')
    return int(i[0]), int(i[1]) + 1


def get_arguments():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument('-b', type=str)
    arg_parser.add_argument('--out', type=str, required=True)
    arg_parser.add_argument('-t', type=str, required=False)
    arg_parser.add_argument('-c', type=str, nargs='+')
    arg_parser.add_argument('--range', type=StrRange)

    args = arg_parser.parse_args()

    dir_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(dir_path)

    print(vars(args))

    book = args.b
    commentators = args.c
    output_file = args.out
    trans = args.t
    text_range = args.range

    return book, commentators, output_file, trans, text_range


book, comms, out_file, trans, text_range = get_arguments()

# for demo
# text_range = (1, 2)

book_content = BookContent(book, trans, comms, text_range=text_range)
book_content.populate()

mg = MikraotGedolotGenerator(book_content, chapter_range=text_range)
tm = TemplateManager(out_file)
tm.config_env()

data = mg.generate()
tm.render_template(data)
